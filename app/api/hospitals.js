import client from "./client";

const endPoint = "/hospitals";

const getHospitals = () => client.get(endPoint);

const saveHospitalName = (name) => client.post(endPoint, { name });
export default {
  getHospitals,
  saveHospitalName,
};
