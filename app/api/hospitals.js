import client from "./client";

const endPoint = "/hospitals";

const getHospitals = () => client.get(endPoint);

const saveHospitalName = (name, address) => client.post(endPoint, { name, address });
export default {
  getHospitals,
  saveHospitalName,
};
