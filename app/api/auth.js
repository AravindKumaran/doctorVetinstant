import client from "./client";

const login = (emailID, password) =>
  client.post("/auth/login", { emailID, password });

const register = (emailID, password) =>
  client.post("/auth/signup", { emailID, password });

export default {
  login,
  register,
};
