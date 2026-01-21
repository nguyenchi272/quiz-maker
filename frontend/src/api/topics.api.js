import api from "./axios";

export const getTopics = () => api.get("/topics");
export const createTopic = (data) => api.post("/topics", data);
export const updateTopic = (id, data) => api.put(`/topics/${id}`, data);
export const deleteTopic = (id) => api.delete(`/topics/${id}`);
