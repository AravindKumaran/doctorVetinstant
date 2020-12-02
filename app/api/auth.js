import client from "./client";

const login = (emailID, password) =>
  client.post("/auth/login", { emailID, password });

const register = (emailID, password) =>
  client.post("/auth/signup", { emailID, password });

const saveGoogleUser = (emailID, password) =>
  client.post("/auth/saveGoogle", { emailID, password });

export default {
  login,
  register,
  saveGoogleUser,
};
