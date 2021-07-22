import IO from 'socket.io-client'

// const socket = IO('http://192.168.43.242:8000')
// const socket = IO('https://vetinstantbe.azurewebsites.net')

// const socket = IO('https://vetinstantbe.azurewebsites.net', {
//   transports: ['websocket'],
// })

const socket = IO('http://ec2-3-109-48-3.ap-south-1.compute.amazonaws.com:8000', {
  transports: ['websocket'],
})

export default socket
