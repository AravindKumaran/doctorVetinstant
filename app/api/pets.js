import client from './client'

const endPoint = '/pets'

const sendPetPrescription = (data, id) => {
  return client.patch(`${endPoint}/prescription/${id}`, data)
}

const getPetDetails = (petId) => {
  return client.get(`${endPoint}/${petId}`)
}

export default {
  sendPetPrescription,
  getPetDetails,
}
