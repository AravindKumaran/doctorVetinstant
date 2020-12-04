import React, { useContext, useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";
import AddPetButton from "../components/AddPetButton";

const HomeScreen = ({ navigation, route }) => {
  console.log(route);
  const { user, setUser } = useContext(AuthContext);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (route.params && route.params.pet) {
      setPets([route.params.pet, ...pets]);
      route.params.pet = undefined;
    }
  }, [route.params?.pet]);

  const handleLogout = () => {
    setUser();
    authStorage.removeToken();
  };

  return (
    <ScrollView vertical={true}>
      <View style={styles.container}>
        <AppText style={{ fontWeight: "500", fontSize: 30 }}>
          Hi, Avinash!
        </AppText>
        <AppText style={{ fontWeight: "100", fontSize: 13 }}>
          In order to start a call please add your pet below
        </AppText>

        <View style={styles.addPetContainer}>
          <ScrollView horizontal={true}>
            {pets.length > 0 &&
              pets.map((pet) => (
                <AddPetButton
                  key={pet.name}
                  title='+'
                  name={pet.name}
                  // onPress={() => navigation.navigate("AddPet")}
                />
              ))}
            <AddPetButton
              title='+'
              onPress={() => navigation.navigate("AddPet")}
            />
          </ScrollView>
        </View>

        <AppText style={{ fontWeight: "500", fontSize: 22 }}>
          Recent Activity
        </AppText>
        <AppText style={{ fontWeight: "100", fontSize: 13 }}>
          In order to start a call please add your pet below
        </AppText>

        <View style={styles.bottomCard}>
          <AppText style={{ fontWeight: "500", fontSize: 25, color: "#fff" }}>
            Health tip: Feed your pet a nutritious diet.
          </AppText>
          <AppText
            style={{
              fontWeight: "100",
              fontSize: 13,
              color: "#fff",
              lineHeight: 20,
            }}
          >
            In addition to healthy ingredients,select a food that is appropriate
            for your pet's age,health and activity level.
          </AppText>
        </View>

        <AppText>{user ? user.emailID || user.email : ""}</AppText>
        <AppButton title='Logout' onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addPetContainer: {
    width: "100%",
    flexDirection: "row",
  },
  bottomCard: {
    marginVertical: 15,
    backgroundColor: "#32a852",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
});

export default HomeScreen;
