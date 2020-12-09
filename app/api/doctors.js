import client from "./client";

const endPoint = "/doctors";

const saveDoctor = (doctor) => client.post(endPoint, doctor);

const getSingleDoctor = (id) => client.get(`${endPoint}/${id}`);

export default {
  saveDoctor,
  getSingleDoctor,
};
