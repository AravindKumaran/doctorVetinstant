import { create } from "apisauce";

const api = create({
  baseURL: "https://www.googleapis.com/userinfo/v2/me",
});

const getGoggleLoggedInUser = (token) => {
  return api.get(
    "/",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export { getGoggleLoggedInUser };
