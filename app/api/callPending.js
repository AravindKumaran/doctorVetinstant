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
const deleteCallPending = (id) => {
  return client.delete(`${endPoint}/${id}`)
}
const singleCallPending = (id) => {
  return client.get(`${endPoint}/${id}`)
}

const deleteCallPendingAfter = (id) => {
  return client.delete(`${endPoint}/after/${id}`)
}
export default {
  saveCallPending,
  getCallPendingByDoctor,
  updateCallPending,
  deleteCallPending,
  singleCallPending,
  deleteCallPendingAfter,
}
