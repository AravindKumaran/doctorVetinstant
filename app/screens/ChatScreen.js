import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat'

import AuthContext from '../context/authContext'
import chatsApi from '../api/chat'
import LoadingIndicator from '../components/LoadingIndicator'

import socket from '../components/utils/socket'

const ChatScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  console.log('Route', route.params)

  useEffect(() => {
    const getAllChats = async () => {
      setLoading(true)
      const chatRes = await chatsApi.getRoomAllChat(
        route.params?.pat.name,
        route.params?.pat.petId
      )
      if (!chatRes.ok) {
        console.log(chatRes)
        setLoading(false)
        return
      }
      const sortedChat = chatRes.data.chats.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      // const chatMessages = chatRes.data.chats
      const newMessages = sortedChat.map((msg) => {
        return {
          ...msg,
          user: {
            _id: msg.userId,
            name: msg.userName,
          },
        }
      })
      setMessages(newMessages)
      setLoading(false)

      socket.emit('room', route.params?.pat.name)
      socket.on('chat', (data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setMessages(sortedData)
      })
    }

    getAllChats()
    navigation.setOptions({ title: route.params?.pat.senderName })
  }, [])

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E8E8E8',
          },
        }}
      />
    )
  }

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 16,
        }}
      />
    )
  }

  const onSend = async (newMsg) => {
    newMsg[0].roomName = route.params?.pat.name
    newMsg[0].petId = route.params?.pat.petId
    newMsg[0].userId = user._id
    newMsg[0].userName = user.name
    setLoading(true)
    const ress = await chatsApi.createChat({
      petId: route.params?.pat.petId,
      roomName: route.params?.pat.name,
      text: newMsg[0].text,
      userId: user._id,
      userName: user.name,
    })
    if (!ress.ok) {
      console.log('ress', ress)
      setLoading(false)
      return
    }
    //  console.log('ress', ress)
    socket.emit('chat', {
      room: route.params?.pat.name,
      msg: GiftedChat.append(messages, newMsg),
    })
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: user._id,
          name: user.name,
        }}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        placeholder='Type your message here...'
        showUserAvatar
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ChatScreen
