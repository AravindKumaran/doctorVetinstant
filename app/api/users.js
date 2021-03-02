import client from './client'

const endPoint = '/users'

const getUsers = () => client.get(endPoint)

const getLoggedInUser = () => {
  // console.log(client.getBaseURL());

  return client.patch(`${endPoint}/me`)
}

const getVideoToken = (data) => {
  return client.post(`${endPoint}/getToken`, data)
}

const createPushToken = (token) => {
  return client.patch(`${endPoint}/saveToken`, token)
}

const sendPushNotification = (data) => {
  return client.post(`${endPoint}/sendNotification`, data)
}

const getPushToken = (id) => {
  return client.get(`${endPoint}/getPushToken/${id}`)
}

export default {
  getUsers,
  getLoggedInUser,
  getVideoToken,
  createPushToken,
  sendPushNotification,
  getPushToken,
}
