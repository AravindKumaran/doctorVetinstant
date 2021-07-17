import client from "./client";

const endPoint = "/hospitals";

const getHospitals = () => client.get(endPoint);

const getSingleHospital = (id) => client.get(`${endPoint}/${id}`);

const saveHospitalName = (name, address) => client.post(endPoint, { name, address });

const updateHospital = (data, id) => client.patch(`${endPoint}/${id}`, data);
export default {
  getHospitals,
  saveHospitalName,
  getSingleHospital,
  updateHospital
};
