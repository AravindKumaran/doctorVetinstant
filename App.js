import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "./app/screens/WelcomeScreen";
import AuthScreen from "./app/screens/AuthScreen";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import AccountScrren from "./app/screens/AccountScreen";

import AuthContext from "./app/context/authContext";
import authStorage from "./app/components/utils/authStorage";

import usersApi from "./app/api/users";

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState();

  const restoreToken = async () => {
    const token = await authStorage.getToken();
    if (!token) return;
    const userRes = await usersApi.getLoggedInUser();
    setUser(userRes.data.user);
  };

  useEffect(() => {
    restoreToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen name='Account' component={AccountScrren} />
          ) : (
            <>
              <Stack.Screen name='Welcome' component={WelcomeScreen} />
              <Stack.Screen name='Auth' component={AuthScreen} />
              <Stack.Screen name='Login' component={LoginScreen} />
              <Stack.Screen name='Register' component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
