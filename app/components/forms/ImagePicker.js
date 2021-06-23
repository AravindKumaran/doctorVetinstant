import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import AppText from "../AppText";
import AppButton from "../AppButton";

const ImagePicker = ({ imageUri, onChangeImage, imageList }) => {
  const refRBSheet = useRef();

  const openCamera = async () => {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    if (
      results["android.permission.CAMERA"] &&
      results["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted"
    ) {
      const options = {
        mediaType: "photo",
        saveToPhotos: true,
        quality: 0.5,
        maxWidth: 500,
        maxHeight: 500,
      };
      launchCamera(options, (res) => {
        if (res.didCancel) return;

        if (res.errorMessage) {
          console.log("Error in Picking Image", res.errorMessage);
          return;
        }

        if (res.fileSize <= 1000000) {
          //  console.log(res.uri)
          onChangeImage(res.uri);
        } else {
          alert("Please select image of size less than 1mb");
        }
      });
    } else {
      console.log("Please Provide Permissions ");
    }

    refRBSheet.current.close();
  };

  const openImageLibrary = () => {
    const options = {};
    launchImageLibrary(options, (res) => {
      if (res.didCancel) return;

      if (res.errorMessage) {
        console.log("Error in Picking Image", res.errorMessage);
        return;
      }

      if (res.fileSize <= 1000000) {
        console.log(res.uri);
        onChangeImage(res.uri);
      } else {
        alert("Please select image of size less than 1mb");
      }
    });
    refRBSheet.current.close();
  };

  const handlePress = () => {
    if (imageList && imageUri) {
      Alert.alert("Delete", "Are you sure you want to delete this image", [
        { text: "Yes", onPress: () => onChangeImage(null) },
        { text: "No" },
      ]);
      return;
    }
    refRBSheet.current.open();
  };

  return (
    <View>
      {/* <AppText> Hello{imageUri}</AppText> */}
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.container}>
          {!imageUri && (
            <Text
              style={{
                color: "#47687F",
                fontSize: 12,
                fontWeight: "400",
                alignSelf: "center",
              }}
            >
              Upload your photo
            </Text>
          )}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        height={400}
        animationType="fade"
        closeOnDragDown={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,.6)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            backgroundColor: "#fff",
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          },
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 20,
            marginBottom: 10,
          }}
        >
          <AppText style={{ marginVertical: 15, fontSize: 22 }}>
            Upload Image
          </AppText>
          <AppButton
            title="Take Photo"
            iconName="camera"
            txtStyle={{ textAlign: "center" }}
            onPress={openCamera}
          />
          <AppButton
            title="Choose From Library"
            iconName="image"
            txtStyle={{ textAlign: "center" }}
            onPress={openImageLibrary}
          />
          <AppButton
            title="Cancel"
            onPress={() => refRBSheet.current.close()}
          />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#4DD1EF",
    borderRadius: 30,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImagePicker;

{
  /* <TouchableOpacity
style={{
  height: 40,
  width: "100%",
  borderWidth: 1,
  borderColor: "#41CE8A",
  borderRadius: 30,
  justifyContent: "center",
  alignSelf: "center",
  marginBottom: 10,
}}
onPress={photo}
>
<Text
  style={{
    color: "#47687F",
    fontSize: 12,
    fontWeight: "400",
    alignSelf: "center",
  }}
>
  Upload your photo
</Text>
</TouchableOpacity> */
}
