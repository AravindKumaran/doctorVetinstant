import client from './client'

const endPoint = '/pendingcalls'

const saveCallPending = (data) => {
  return client.post(`${endPoint}`, data)
}

const getCallPendingByDoctor = (userId) => {
  return client.get(`${endPoint}/doctor/${userId}`)
}

const updateCallPending = (id, data) => {
  return client.patch(`${endPoint}/${id}`, data)
}

export default {
  saveCallPending,
  getCallPendingByDoctor,
  updateCallPending,
}
