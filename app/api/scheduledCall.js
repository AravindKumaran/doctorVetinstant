import client from './client'

const endPoint = '/scheduledCalls'

const createScheduledCall = (data) => {
  return client.post(`${endPoint}`, data)
}

const getScheduledCallsByUser = () => {
  return client.get(`${endPoint}`)
}

const getScheduledCallsByUserAndDoc = (userId, docId) => {
  return client.get(`${endPoint}/${userId}/${docId}`)
}

export default {
  createScheduledCall,
  getScheduledCallsByUser,
  getScheduledCallsByUserAndDoc
}
