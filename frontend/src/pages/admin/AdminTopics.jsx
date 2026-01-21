import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic
} from "../../api/topics.api";
import "./admin.css";

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = async () => {
    const res = await getTopics();
    setTopics(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name, description: t.description || "" });
    setOpen(true);
  };

  const submit = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      difficulty: "medium",
      is_published: true
    };

    if (editing) {
      await updateTopic(editing.id, payload);
    } else {
      await createTopic(payload);
    }

    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (confirm("Xoá topic này?")) {
      await deleteTopic(id);
      load();
    }
  };

  return (
    <>
      <div className="topic-header">
        <h1>📚 Topics</h1>
        <button className="btn-primary" onClick={openCreate}>
          + New Topic
        </button>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {topics.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td>{t.description}</td>

                <td>
                  {t.is_published ? (
                    <span className="badge green">Published</span>
                  ) : (
                    <span className="badge gray">Draft</span>
                  )}
                </td>

                <td className="actions">
                  {/* Manage Questions */}
                  <Link
                    to={`/admin/topics/${t.id}/questions`}
                    className="action-btn"
                    title="Manage questions"
                  >
                    📄
                  </Link>

                  {/* Edit */}
                  <button
                    className="action-btn action-edit"
                    onClick={() => openEdit(t)}
                    title="Edit topic"
                  >
                    ✏️
                  </button>

                  {/* Delete */}
                  <button
                    className="action-btn action-delete"
                    onClick={() => remove(t.id)}
                    title="Delete topic"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editing ? "Edit Topic" : "New Topic"}</h2>

            <input
              placeholder="Topic name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={submit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
