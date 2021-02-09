import client from './client'

const endPoint = '/users'

const getUsers = () => client.get(endPoint)

const getLoggedInUser = () => {
  // console.log(client.getBaseURL());

  return client.patch(`${endPoint}/me`)
}

const getVideoToken = (username) => {
  return client.get(`${endPoint}/getToken/?userName=${username}`)
}

const createPushToken = (token) => {
  return client.patch(`${endPoint}/saveToken`, token)
}

const sendPushNotification = (data) => {
  return client.post(`${endPoint}/sendNotification`, data)
}

export default {
  getUsers,
  getLoggedInUser,
  getVideoToken,
  createPushToken,
  sendPushNotification,
}
