import IO from 'socket.io-client'

const socket = IO('http://192.168.43.242:8000')
// const socket = IO('https://vetinstantbe.azurewebsites.net')

// const socket = IO('https://vetinstantbe.azurewebsites.net', {
//   transports: ['websocket'],
// })

export default socket
