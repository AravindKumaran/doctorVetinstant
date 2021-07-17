import client from './client'

const endPoint = '/rooms'

const createRoom = (room) => {
  return client.post(endPoint, room)
}

const getReceiverRoom = (name) => {
  return client.get(`${endPoint}/receiver/${name}`)
}

export default {
  createRoom,
  getReceiverRoom,
}
