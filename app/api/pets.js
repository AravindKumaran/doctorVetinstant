import client from './client'

const endPoint = '/pets'

const sendPetPrescription = (data, id) => {
  return client.patch(`${endPoint}/prescription/${id}`, data)
}

export default {
  sendPetPrescription,
}
