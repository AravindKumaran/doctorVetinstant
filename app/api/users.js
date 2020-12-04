import client from "./client";

const endPoint = "/users";

const getUsers = () => client.get(endPoint);

const getLoggedInUser = () => {
  return client.get(`${endPoint}/me`);
};

export default {
  getUsers,
  getLoggedInUser,
};
