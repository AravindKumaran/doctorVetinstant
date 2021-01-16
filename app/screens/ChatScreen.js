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
      setMessages(chatRes.data.chats)
      setLoading(false)

      socket.emit('room', route.params?.pat.name)
      socket.on('chat', (data) => {
        setMessages(data)
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
    setLoading(true)
    await chatsApi.createChat(newMsg[0])
    setLoading(false)
    socket.emit('chat', {
      room: route.params?.pat.name,
      msg: GiftedChat.append(messages, newMsg),
    })
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
