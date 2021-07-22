import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import PDFView from "react-native-view-pdf";
import AppButton from "../components/AppButton";
import DocumentPicker from "react-native-document-picker";
import petsApi from "../api/pets";

const PrescriptionPreview = ({ navigation, route }) => {
  const resourceType = "file";
  const { pdfUri, prescription, details } = route.params;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("pdfUri", pdfUri);
    console.log("details", details);
  }, [pdfUri]);
  const resources = {
    file: Platform.OS === "ios" ? "downloadedDocument.pdf" : pdfUri,
  };

  const selectFile = async () => {
    try {
      setLoading(true);
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (results) {
        const form = new FormData();

        form.append("photo", {
          name: results.name,
          type: results.type,
          uri: results.uri,
          size: results.size,
        });
        form.append("prescription", prescription);
        form.append("docname", details.docName);
        console.log("form", form);

        const ress = await petsApi.sendPetPrescription(form, details.petId);

        if (!ress.ok) {
          console.log("ress", ress);
          setLoading(false);
          return;
        }
        console.log("ress", ress.data.pet);
        navigation.navigate("Room", {
          petId: details.petId,
          petname: details.petName,
          docName: details.docName,
          userName: details.userName,
          docId: details.docId,
          userId: details.userId,
          prescriptionAdded: true,
          pdfUri: pdfUri,
          callId: details.callId,
          petowner: details.petowner,
        });
        setLoading(false);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.text1}>Preview Prescription</Text>
        {/* <Image source={require("../components/assets/images/document1.png")} /> */}
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1, height: 400, width: 400 }}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log("Cannot render PDF", error)}
        />
        <AppButton title="Upload" onPress={() => selectFile()} />
        <AppButton title="Edit" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    alignItems: "center",
    margin: 50,
  },
  text1: {
    color: "#47687F",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 5,
  },
});

export default PrescriptionPreview;
