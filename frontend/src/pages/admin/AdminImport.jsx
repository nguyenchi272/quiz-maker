import { useState } from "react";
import api from "../../api/axios";
import "./admin.css";

export default function AdminImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (!f.name.endsWith(".xlsx")) {
      setError("Only .xlsx file is supported");
      return;
    }
    setError("");
    setFile(f);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await api.post("/questions/import-excel", form);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-box">
      <h1>📥 Import Questions</h1>
      <p className="hint">
        Topic name will be taken from <b>file name</b>
      </p>

      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {file ? (
          <div className="file-preview">
            <strong>{file.name}</strong>
            <span>{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : (
          <span>Drag & drop Excel file here</span>
        )}
      </div>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className="format-box">
        <b>Excel format required:</b>
        <pre>
question | type | answer_a | answer_b | answer_c | answer_d | correct
        </pre>
        <small>
          type = multiple | checkbox | ranking<br />
          correct = A | A,B | A,B,C
        </small>
      </div>

      {error && <div className="error-box">{error}</div>}

      <button
        className="btn-primary"
        disabled={!file || loading}
        onClick={submit}
      >
        {loading ? "Importing..." : "Import Questions"}
      </button>

      {result && (
        <div className="success-box">
          ✅ Imported <b>{result.questions_imported}</b> questions into topic
          <b> {result.topic}</b>
        </div>
      )}
    </div>
  );
}
