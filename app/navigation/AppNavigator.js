import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DoctorScreen from "../screens/DoctorScreen";
import DoctorDetailsScreen from "../screens/DoctorDetailsScreen";
import PatientScreen from "../screens/PatientScreen";
import ChatScreen from "../screens/ChatScreen";
import PatientListScreen from "../screens/PatientListScreen";
import PatientDetailsScreen from "../screens/PatientDetailsScreen";
import VideoCallScreen from "../screens/VideoCallScreen";
import PrescriptionScreen from "../screens/PrescriptionScreen";
import ViewPrescription from "../screens/ViewPrescription";
import VetProfile from "../screens/VetProfile";
import EditVetProfile from "../screens/EditVetProfile";
import MedicalHistoryPets from "../screens/MedicalHistoryPets";
import Notification from "../screens/Notification";
import ChatNotification from "../screens/ChatNotification";
import MenuScreen from "../screens/MenuScreen";
import WalletScreen from "../screens/WalletScreen";
import Prescription from "../screens/Prescription";
import PetMedication from "../screens/PetMedication";
import ProfileSetup from "../screens/ProfileSetup";
import PrescriptionPreview from "../screens/PrescriptionPreview";
import { Feather } from "@expo/vector-icons";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";

const Stack = createStackNavigator();

const AppNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 5,
          borderBottomStartRadius: 15,
          borderBottomEndRadius: 15,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Doctor" component={DoctorScreen} />
      <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} />
      <Stack.Screen name="Patient" component={PatientScreen} />
      <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
      <Stack.Screen name="ViewPrescription" component={ViewPrescription} />
      <Stack.Screen
        name="PrescriptionScreen"
        component={PrescriptionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="PatientList" component={PatientListScreen} />
      <Stack.Screen name="VetProfile" component={VetProfile} />
      <Stack.Screen name="EditVetProfile" component={EditVetProfile} />
      <Stack.Screen name="MedicalHistoryPets" component={MedicalHistoryPets} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ChatNotification" component={ChatNotification} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="Prescriptionnnnn" component={Prescription} />
      <Stack.Screen name="PetMedication" component={PetMedication} />
      <Stack.Screen
        name="ProfileSetup"
        options={{
          title: "Setting Up Your Profile",
          headerTitleStyle: {
            color: "#476880",
          },
          headerTitleAlign: "center",
        }}
        component={ProfileSetup}
      />
      <Stack.Screen
        options={{
          title: "Verification",
          headerTitleStyle: {
            color: "#476880",
          },
          headerTitleAlign: "center",
        }}
        name="VerificationCode"
        component={VerificationCodeScreen}
      />
      <Stack.Screen
        name="PrescriptionPreview"
        component={PrescriptionPreview}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
