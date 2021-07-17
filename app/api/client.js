import { create } from "apisauce";
import authStorage from "../components/utils/authStorage";

const apiClient = create({
  //baseURL: "http://localhost:8000/api/v1",
  // baseURL: 'https://vetinstant.azurewebsites.net/api/v1',
  // baseURL: 'https://vetinstantbe.azurewebsites.net/api/v1',
  //baseURL: 'http://192.168.29.239:8000/api/v1',
<<<<<<< HEAD
  baseURL: "http://192.168.1.46:8000/api/v1", //hotspot
  //baseURL: 'http://192.168.1.10:8000/api/v1', //wifi
=======
  //baseURL: 'http://192.168.0.167:8000/api/v1', //hotspot
  baseURL: 'http://192.168.255.167:8000/api/v1', //wifi
>>>>>>> d2843004ca2ccf1f3d7a2a74b4c9cf6b9611d212
  // baseURL:
  //   "http://ec2-13-126-97-116.ap-south-1.compute.amazonaws.com:8000/api/v1",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] = `Bearer ${authToken}`;
});

export default apiClient;
