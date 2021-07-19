import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppNavigator from "./AppNavigator";
import PetLobby from "../screens/PetLobby";
import Room from "../screens/Room";
import { Image, Keyboard, TouchableOpacity, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const { keyboardHidesTabBars } = useState(true);
  const [didKeyboardShow, setKeyboardShow] = useState(false);
  const [touched, setTouched] = useState(false);

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
  return (
    <>
      <Tab.Navigator
        tabBarOptions={{
          keyboardHidesTabBar: true,
          tabStyle: {
            backgroundColor: "#FFFFFF",
            height: 50,
            bottom: 10,
          },
          inactiveTintColor: "#FFFFFF",
          activeTintColor: "#21FFFC",
          showLabel: false,
          showIcon: true,
          indicatorStyle: {
            opacity: 0.2,
          },
          style: {
            backgroundColor: "#FFFFFF",
            position: "absolute",
            bottom: 0,
            padding: 10,
            height: 50,
            zIndex: 8,
            borderRadius: 15,
          },
        }}
      >
        <Tab.Screen
          name={"Bottom1"}
          component={AppNavigator}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <>
                <Feather
                  style={{
                    position: "absolute",
                    color: focused ? "#4AC4F1" : "#47687F",
                  }}
                  name={"home"}
                  size={25}
                />
              </>
            ),
          }}
        />
        <Tab.Screen
          name={"PetLobby"}
          component={PetLobby}
          options={{
            // tabBarIcon: ({ focused, color }) => (
            //   <>
            //     {!didKeyboardShow && (
            //       <Feather
            //         style={{
            //           color: focused ? "#4AC4F1" : "#47687F",
            //         }}
            //         name={"phone-call"}
            //         size={25}
            //       />
            //     )}
            //   </>
            // ),
            tabBarIcon: ({ focused, color }) => (
              <>
                {!didKeyboardShow && (
                  <Image
                    source={require("../components/assets/images/middleicon.png")}
                    style={{
                      width: 100,
                      height: 100,
                      bottom: didKeyboardShow ? -20 : 20,
                    }}
                  />
                )}
              </>
            ),
          }}
        />
        <Tab.Screen
          name={"Room"}
          component={Room}
          options={{
            tabBarIcon: ({ focused, tintColor }) => (
              <>
                <Feather
                  style={{
                    color: focused ? "#4AC4F1" : "#47687F",
                  }}
                  name={"activity"}
                  size={25}
                />
              </>
            ),
            // tabBarVisible: false,
          }}
        />
      </Tab.Navigator>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PetLobby");
        }}
        style={{
          backgroundColor: "transparent",
          zIndex: 1,
          position: "absolute",
          bottom: 20,
          height: 65,
          width: 65,
          alignSelf: "center",
          borderRadius: 35,
        }}
      >
        <Text style={{ fontSize: 30, color: "transparent" }}>Hello</Text>
      </TouchableOpacity>
    </>
  );
};

export default BottomTab;
