import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getQuestionsByTopic,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "../../api/questions.api";
import QuestionForm from "./QuestionForm";
import "./admin.css";

export default function AdminQuestions() {
  const { id: topicId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);


  const emptyForm = {
    content: "",
    type: "multiple",
    answers: [
      { content: "", is_correct: false },
      { content: "", is_correct: false },
      { content: "", is_correct: false },
      { content: "", is_correct: false }
    ]
  };

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const res = await getQuestionsByTopic(topicId);
    setQuestions(res.data);
  };

  useEffect(() => {
    load();
  }, [topicId]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (q) => {
    setEditing(q);
    setForm({
      content: q.content,
      type: q.type,
      answers: q.answers.map(a => ({
        content: a.content,
        is_correct: a.is_correct
      }))
    });
    setOpen(true);
  };

  const submit = async () => {
    const payload = {
      topic_id: Number(topicId),
      ...form
    };

    if (editing) {
      await updateQuestion(editing.id, payload);
    } else {
      await createQuestion(payload);
    }

    setOpen(false);
    load();
  };

  const remove = async (id) => {
    if (confirm("Xoá câu hỏi này?")) {
      await deleteQuestion(id);
      load();
    }
  };

  return (
    <>
      <div className="topic-header">
        <h1>Questions</h1>
        <button
            className="btn-primary"
            onClick={() => {
                setEditingQuestion(null);
                setOpenForm(true);
            }}
            >
            + New Question
        </button>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th width="120">Type</th>
              <th width="120">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.content}</td>
                <td>{q.type}</td>
                <td>
                  <button
                    className="action-btn action-edit"
                    onClick={() => {
                        setEditingQuestion(q);
                        setOpenForm(true);
                    }}
                    >
                    ✏️
                  </button>

                  <button
                    className="action-btn action-delete"
                    onClick={() => remove(q.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openForm && (
        <QuestionForm
            topicId={topicId}
            initialData={editingQuestion}
            onSubmit={async (payload) => {
            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, payload);
            } else {
                await createQuestion(payload);
            }
            setOpenForm(false);
            load();
            }}
            onCancel={() => setOpenForm(false)}
        />
        )}

    </>
  );
}

