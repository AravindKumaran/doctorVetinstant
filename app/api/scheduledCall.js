import client from './client'

const endPoint = '/scheduledCalls'

const createScheduledCall = (data) => {
  return client.post(`${endPoint}`, data)
}

export default {
  createScheduledCall,
}
