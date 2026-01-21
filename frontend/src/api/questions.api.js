import api from "./axios";

export const getQuestionsByTopic = (topicId) =>
  api.get("/questions", {
    params: { topic_id: topicId }
  });

export const createQuestion = (data) =>
  api.post("/questions", data);

export const updateQuestion = (id, data) =>
  api.put(`/questions/${id}`, data);

export const deleteQuestion = (id) =>
  api.delete(`/questions/${id}`);
