import client from './client'

const endPoint = '/users'

const getUsers = () => client.get(endPoint)

const getLoggedInUser = () => {
  return client.patch(`${endPoint}/me`)
}

const checkRegisteredUser = () => client.get(`${endPoint}/register/check`)

const updateMe = (data) => client.patch('/me', data)

const getVideoToken = (data) => {
  return client.post(`${endPoint}/getToken`, data)
}

const createPushToken = (token) => {
  return client.patch(`${endPoint}/saveToken`, token)
}

const updateDoctorHosp = (form) => {
  return client.patch(`${endPoint}/updateDoctorHosp`, form)
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
  updateDoctorHosp,
  updateMe,
  checkRegisteredUser
}
