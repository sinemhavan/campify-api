import api from "../utils/api";

export const getChats = () => api.get("/chats").then((r) => r.data);

export const sendMessage = (chatId, content) =>
  api.post(`/chats/${chatId}/messages`, { content }).then((r) => r.data);