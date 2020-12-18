import client from './client'

const endPoint = '/doctors'

const saveDoctor = (doctor) => client.post(endPoint, doctor)

const getSingleDoctor = (id) => client.get(`${endPoint}/${id}`)

const getLoggedInDoctor = (id) => client.get(`${endPoint}/user/${id}`)

export default {
  saveDoctor,
  getSingleDoctor,
  getLoggedInDoctor,
}
