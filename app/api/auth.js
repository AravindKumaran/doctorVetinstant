import client from "./client";

const login = (emailID, password) =>
  client.post("/auth/login", { emailID, password });

const register = (name, emailID, password, role = "doctor") =>
  client.post("/auth/signup", { name, emailID, password, role });

const saveGoogleUser = (emailID, password) =>
  client.post("/auth/saveGoogle", { emailID, password });

export default {
  login,
  register,
  saveGoogleUser,
};
