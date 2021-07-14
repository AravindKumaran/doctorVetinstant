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

const ChatScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState(false);

  const { keyboardHidesTabBars } = useState(true);
  const [didKeyboardShow, setKeyboardShow] = useState(false);

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

  // console.log("Route", route.params);

  useEffect(() => {
    const getAllChats = async () => {
      setLoading(false);
      const chatRes = await chatsApi.getRoomAllChat(
        route.params?.pat.name,
        route.params?.pat.petId
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
        return {
          ...msg,
          user: {
            _id: msg.userId,
            name: msg.userName,
          },
        };
      });
      setMessages(newMessages);
      setLoading(false);

      socket.emit("room", route.params?.pat.name);
      socket.on("chat", (data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedData);
      });
    };

    getAllChats();
    navigation?.setOptions({ title: route.params?.pat.senderName });
  }, []);

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

  const onSend = useCallback((messages = [], image) => {
    console.log("on send")
    socket.emit("chat", {
      room: 'test',
      msg: 'test'
    });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages, image)
    );
  }, []);

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
  //       // image: "https://placeimg.com/140/140/any",
  //       // video:
  //       //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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

  // const onSend = async (newMsg) => {
  //   newMsg[0].roomName = route.params?.pat.name;
  //   newMsg[0].petId = route.params?.pat.petId;
  //   newMsg[0].userId = user._id;
  //   newMsg[0].userName = user.name;
  //   setLoading(true);
  //   const ress = await chatsApi.createChat({
  //     petId: route.params?.pat.petId,
  //     roomName: route.params?.pat.name,
  //     text: newMsg[0].text,
  //     userId: user._id,
  //     userName: user.name,
  //   });
  //   if (!ress.ok) {
  //     console.log("ress", ress);
  //     setLoading(false);
  //     return;
  //   }
  //   //  console.log('ress', ress)
  //   socket.emit("chat", {
  //     room: route.params?.pat.name,
  //     msg: GiftedChat.append(messages, newMsg),
  //   });
  //   setLoading(false);
  // };

  const renderInputToolbar = (props) => {
    return (
      <View
        style={{
          flexDirection: "column",
          bottom: didKeyboardShow ? -10 : 70,
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
        />
        <TouchableOpacity
          style={{ position: "absolute", left: 110 }}
          onPress={onSend}
        >
          <IconButton icon="send-circle" size={45} color="#4AC4F1" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        // user={{
        //   _id: 1,
        // }}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        showUserAvatar
        isTyping
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
