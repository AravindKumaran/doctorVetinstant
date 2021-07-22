import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PDFView from "react-native-view-pdf";

export default function ViewPrescription({ route }) {
  const { pdfUri } = route.params;
  const resourceType = "file";
  const resources = {
    file: Platform.OS === "ios" ? "downloadedDocument.pdf" : pdfUri,
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.container1}>
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1, height: 400, width: 400 }}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log("Cannot render PDF", error)}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    alignItems: "center",
    margin: 50,
  },
});
