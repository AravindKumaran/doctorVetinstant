import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  Actions,
  ActionsProps,
  InputToolbar,
  MessageImage,
  SystemMessage,
} from "react-native-gifted-chat";
import AuthContext from "../context/authContext";
import chatsApi from "../api/chat";
import LoadingIndicator from "../components/LoadingIndicator";
import socket from "../components/utils/socket";
import DocumentPicker from "react-native-document-picker";
import { IconButton } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { cos } from "react-native-reanimated";
import pets from "../api/pets";

const ChatScreen = ({ navigation, route, pat }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState(false);

  const { keyboardHidesTabBars } = useState(true);
  const [didKeyboardShow, setKeyboardShow] = useState(false);
  const [text, setText] = useState();

  const toggleTouched = () => {
    setTouched(!touched);
  };

  const seeProfile = () => {
    navigation.navigate("PetLobby");
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardShow(false);
  };

  console.log("Route", pat);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 10,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ])
  // }, [])

  useEffect(() => {
    const getAllChats = async () => {
      console.log("room name is", pat.name)
      setLoading(false); 
      const chatRes = await chatsApi.getRoomAllChat(
        pat.name,
        pat.petId
      );
      if (!chatRes.ok) {
        console.log(chatRes);
        setLoading(false);
        return;
      }
      const sortedChat = chatRes.data.chats.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // const chatMessages = chatRes.data.chats
      const newMessages = sortedChat.map((msg) => {
        let userId = 2;
        if(msg.isDoctorMsg) {
          userId = 1;
        }
        return {
          ...msg,
          user: {
            //_id: msg.userId,
           _id: userId,
            name: msg.userName,
          },
        };
      });
      console.log('newMessages', newMessages.find(item => item._id == "60f19cd4537b7f27e0e5b1fa"))
      setMessages(newMessages);
      setLoading(false);

      socket.emit("room", pat.name);
      socket.on("chat", (data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedData);
      });
    };

    getAllChats();
    navigation?.setOptions({ title: pat.senderName });
  }, []);

  useEffect(() => {
    //console.log('messages', messages[0].text)
  }, [messages])

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#F1F1F1",
          },
          right: {
            backgroundColor: "#4AC4F1",
          },
        }}
        textStyle={{
          left: {
            color: "#47687F",
            fontSize: 12,
            fontWeight: "400",
          },
          right: {
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "400",
          },
        }}
      />
    );
  };

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
    );
  };

  // const onSend = ((messages = [], image) => {
  //   console.log("on send", messages.text)
  //   // socket.emit("chat", {
  //   //   room: 'test',
  //   //   msg: 'test'
  //   // });
  //   // setMessages((previousMessages) =>
  //   //   GiftedChat.append(previousMessages, messages, image)
  //   // );
  // }, []);

  // const onSend = (messages = [], image) => {
  //   console.log("on send", messages)
  //   // socket.emit("chat", {
  //   //   room: 'test',
  //   //   msg: 'test'
  //   // });
  //   // setMessages((previousMessages) =>
  //   //   GiftedChat.append(previousMessages, messages, image)
  //   // );
  // };

  // const onSend = async (newMsg = [], image) => {
  //   console.log('pat', pat)
  //   console.log('newMsg', newMsg[0])
  //   // newMsg.roomName = pat.name
  //   // newMsg.petId = pat.petId
  //   // newMsg.userId = pat.userId
  //   // newMsg.userName = pat.userName
  //   // setLoading(true)
  //   // const ress = await chatsApi.createChat({
  //   //   petId: pat.petId,
  //   //   roomName: pat.name,
  //   //   text: newMsg.text,
  //   //   userId: pat.userId,
  //   //   userName: pat.userName,
  //   // })
  //   // if (!ress.ok) {
  //   //   console.log('ress', ress)
  //   //   setLoading(false)
  //   //   return
  //   // }
  //   // // console.log('Ress', ress)
  //   // setLoading(false)
  //   // socket.emit('chat', {
  //   //   room: pat.name,
  //   //   msg: newMsg,
  //   // })
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages, image)
    // );
  //   // setLoading(false)
  // }

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: "Type your message here...",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: "React Native",
  //         avatar: "https://placeimg.com/140/140/any",
  //       },
  //       image: "https://placeimg.com/140/140/any",
  //       video:
  //         "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  //     },
  //   ]);
  // }, []);

  const selectFile = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        console.log(res.uri, res.type, res.name, res.size);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const renderMessageImage = (props) => {
    console.log("imageprop:", props.currentMessage.image);
    return (
      <View style={{ position: "relative", height: 150, width: 250 }}>
        <Image
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 150,
            width: 250,
            borderRadius: 20,
          }}
          source={{ uri: "https://placeimg.com/140/140/any" }}
        />
      </View>
    );
  };

  const handleTextInput = (c) => {
    console.log('handleTextInput', c)
    setText(c)
  }

  // const renderMessageVideo = (props) => {
  //   console.log("videoprop:", props.currentMessage.video);
  //   return (
  //     <View style={{ position: "relative", height: 150, width: 250 }}>
  //       <Video
  //         style={{
  //           position: "absolute",
  //           left: 0,
  //           top: 0,
  //           height: 150,
  //           width: 250,
  //           borderRadius: 20,
  //         }}
  //         shouldPlay
  //         isLooping
  //         rate={1.0}
  //         resizeMode="cover"
  //         height={150}
  //         width={250}
  //         muted={true}
  //         source={{
  //           uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  //         }}
  //         allowsExternalPlayback={false}
  //       />
  //     </View>
  //   );
  // };

  //s onsend
  const onSend = async (text, image) => {
    let newMsg = {
      text
    }
    newMsg.roomName = pat.name;
    newMsg.petId = pat.petId;
    newMsg.userId = pat.userId;
    newMsg.userName = pat.userName;
    newMsg.isDoctorMsg = true;
    setLoading(true);
    const ress = await chatsApi.createChat(newMsg);
    if (!ress.ok) {
      console.log("ress", ress);
      setLoading(false);
      return;
    }
    let giftedMsg = {
      _id: `${(new Date()).getTime()}`,
      text: text,
      user: {
        _id: 1,
        name: pat.userName
      },
    }
    console.log('giftedMsg', giftedMsg)
    setMessages(GiftedChat.append(messages, giftedMsg));
    //  console.log('ress', ress)
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, giftedMsg, image)
    // )
    socket.emit("chat", {
      room: pat.name,
      msg: GiftedChat.append(messages, giftedMsg),
    });
    setLoading(false);
  };

  const renderInputToolbar = (props) => {
    return (
      <View
        style={{
          flexDirection: "column",
          top: didKeyboardShow ? 20 : 20,
          alignItems: "center",
          alignContent: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 110,
            zIndex: 1,
          }}
          onPress={selectFile}
        >
          <IconButton icon="plus" size={45} color="#4AC4F1" />
        </TouchableOpacity>
        <TextInput
          style={{
            width: "90%",
            borderColor: "#B9C4CF",
            borderWidth: 1.5,
            borderRadius: 30,
            alignSelf: "center",
            position: "absolute",
            paddingLeft: 50,
            paddingRight: 50,
          }}
          multiline={true}
          onChangeText={handleTextInput}
        />
        <TouchableOpacity
          style={{ position: "absolute", left: 110 }}
          onPress={() => onSend(text)}
        >
          <IconButton icon="send-circle" size={45} color="#4AC4F1" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { bottom: didKeyboardShow ? 10 : 90 }]}>
      <LoadingIndicator visible={loading} />
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        showUserAvatar
        //isTyping
        placeholder="Type a message"
        alwaysShowSend
        wrapInSafeArea={true}
        textInputProps={{
          borderColor: "#B9C4CF",
          borderWidth: 1.5,
          borderRadius: 30,
          alignSelf: "center",
          height: 45,
          paddingLeft: 10,
          paddingRight: 50,
        }}
        //bottomOffset
        minComposerHeight={40}
        minInputToolbarHeight={40}
        // renderSend={renderSend}
        // renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        // renderMessageVideo={renderMessageVideo}
        renderMessageImage={renderMessageImage}
        // renderInputToolbar={(props) => (
        //   <InputToolbar {...props} containerStyle={{ borderTopWidth: 0 }} />
        // )}
        // renderSend={(props) => (
        //   <View
        //     style={{
        //       flexDirection: "row",
        //       alignItems: "center",
        //       height: 40,
        //     }}
        //   >
        //     <Actions
        //       {...props}
        //       options={{
        //         ["Send Files"]: selectFile,
        //       }}
        //       icon={() => (
        //         <Feather
        //           name={"plus"}
        //           size={35}
        //           color={"#4AC4F1"}
        //           style={{
        //             left: 0,
        //             width: 35,
        //             bottom: 10,
        //             borderRadius: 30,
        //             backgroundColor: "#FFFFFF",
        //             elevation: 10,
        //           }}
        //         />
        //       )}
        //       onSend={(messages) => {
        //         GiftedChat.append(messages);
        //       }}
        //     />
        //     <Send {...props}>
        //       <IconButton
        //         icon="send-circle"
        //         size={41}
        //         color="#4AC4F1"
        //         style={{
        //           top: 5,
        //           right: 0,
        //           elevation: 50,
        //           backgroundColor: "transparent",
        //         }}
        //       />
        //     </Send>
        //   </View>
        // )}
      />
      {/* <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderInputToolbar={renderInputToolbar}
        user={{
          _id: 1
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;

{
  /* <GiftedChat
messages={messages}
onSend={(message) => onSend(message)}
user={{
  _id: user._id,
  name: user.name,
}}
renderBubble={renderBubble}
renderSystemMessage={renderSystemMessage}
placeholder="Type your message here..."
showUserAvatar
/> */
}
