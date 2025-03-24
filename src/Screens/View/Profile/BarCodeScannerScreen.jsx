import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, Modal, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Icon from "react-native-vector-icons/Ionicons";
const { height, width } = Dimensions.get('window');

export default function BarCodeScannerScreen({ onValue, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanModal, setScanModal] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsScanning(false);
    console.log("Type:", type);
    console.log("Data:", data);
    setScanModal(false);
    onValue({ type, data });
    return data;
  };

  const startScanning = () => {
    setScanModal(true);
    setIsScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanModal(false);
    if (onClose) {
      onClose();
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        {!isScanning ? (
          <TouchableOpacity onPress={startScanning} style={styles.scanButton}>
            <Icon name="scan" size={20} color="white" />
          </TouchableOpacity>
        ) : null}

        {isScanning && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopScanning}
          >
            <Icon name="stop" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={scanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={stopScanning}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: [
                  "code128",
                  "ean13",
                  "ean8",
                  "qr",
                  "pdf417",
                  "upc_e",
                  "datamatrix",
                  "code39",
                  "code93",
                  "itf14",
                  "codabar",
                  "upc_a",
                  "aztec",
                ],
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: "#0384d5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  stopButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
});