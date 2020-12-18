import client from './client'

const endPoint = '/users'

const getUsers = () => client.get(endPoint)

const getLoggedInUser = () => {
  // console.log(client.getBaseURL());

  return client.patch(`${endPoint}/me`)
}

export default {
  getUsers,
  getLoggedInUser,
}
