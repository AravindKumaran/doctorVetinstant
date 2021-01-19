import client from './client'

const endPoint = '/calllogs'

const getCallLog = (id) => {
  return client.get(`${endPoint}?receiverId=${id}`)
}

export default {
  getCallLog,
}
