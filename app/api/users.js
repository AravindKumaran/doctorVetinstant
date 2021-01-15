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

export default {
  getUsers,
  getLoggedInUser,
  getVideoToken,
}
