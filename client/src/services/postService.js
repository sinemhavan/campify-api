import api from "../utils/api";

export const getAllPosts = () => api.get("/posts").then((r) => r.data);

export const createPost = (data) => api.post("/posts", data).then((r) => r.data);

export const updatePost = (postId, data) =>
  api.put(`/posts/${postId}`, data).then((r) => r.data);

export const deletePost = (postId) =>
  api.delete(`/posts/${postId}`).then((r) => r.data);