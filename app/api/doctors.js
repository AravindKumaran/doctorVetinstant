import client from './client'

const endPoint = '/doctors'

const saveDoctor = (doctor) => client.post(endPoint, doctor)

const updateDoctor = (id, doctor) => client.patch(`${endPoint}/${id}`, doctor)

const getSingleDoctor = (id) => client.get(`${endPoint}/${id}`)

const getLoggedInDoctor = (id) => client.get(`${endPoint}/user/${id}`)

export default {
  saveDoctor,
  updateDoctor,
  getSingleDoctor,
  getLoggedInDoctor,
}
