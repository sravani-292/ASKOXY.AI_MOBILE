import React,{useState} from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet,ActivityIndicator,Dimensions,Image } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../Config";

const { width, height } = Dimensions.get("window");

const FreeContainer = ({navigation}) => {
  const userData = useSelector((state) => state.counter);
//   console.log({ userData });
  const [loading, setLoading] = useState(false);
  function interestedfunc() {
    if (userData == null) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    } else {
      let data = {
        askOxyOfers: "FREESAMPLE",
        id: userData.userId,
        mobileNumber: userData.whatsappNumber,
        projectType: "ASKOXY",
      };
      console.log(data);
      setLoading(true);
      axios({
        method: "post",
        url:
          userStage == "test"
            ? BASE_URL + "marketing-service/campgin/askOxyOfferes"
            : BASE_URL + "auth-service/auth/askOxyOfferes",
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          Alert.alert(
            "Success",
            "Your interest has been submitted successfully!"
          );
          //  if (response.data.status == "SUCCESS") {
          //    navigation.navigate("Otp", { mobileNumber: mobileNumber });
          //  } else {
          //    alert(response.data.message);
          //  }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status == 400) {
            Alert.alert("Failed", "You have already participated. Thank you!");
          } else {
            Alert.alert("Failed", error.response.data);
          }
        });
    }
  }  

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: "#f8f8f8" }}>
      <Text style={styles.header}>Free Rice Samples & Steel Container</Text>
      <Image
        source={require("../../assets/container.jpg")}
        style={styles.image}
      />
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "green",
            textAlign: "center",
          }}
        >
          Special Offer: Free Rice Container! 🎉
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Buy a 26kg rice bag & get a FREE rice container!
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontStyle: "italic",
            color: "#555",
            marginTop: 5,
            textAlign: "center",
          }}
        >
          (Container remains Oxy Group asset until ownership is earned.)
        </Text>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            How to Earn Ownership:
          </Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            ✅ <Text style={styles.text}>Plan A:</Text> Buy 9 bags in 1 year and
            the container is yours forever.
          </Text>
          <Text style={styles.ortext}>OR</Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            ✅ <Text style={styles.text}>Plan B:</Text> Refer 9 people, and when
            they buy their first bag, the container is yours forever.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Important Info:
          </Text>
          <Text style={{ fontSize: 16, marginTop: 5, color: "#555" }}>
            ✅ No purchase in 45 days or a 45-day gap between purchases =
            Container will be taken back.
          </Text>
          <Text style={{ marginTop: 5 }}>
            If you are interested in buying a rice bag, please click the I am
            Interested button
          </Text>
         
        </View>

        {loading == false ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6f2dbd" }]} // Add background color here
            onPress={() => interestedfunc()}
          >
            <Text style={styles.buttonText}>I'm Interested</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[styles.button, { backgroundColor: "#6f2dbd" }]} // Add background color here
          >
            <Text style={styles.buttonText}>
              <ActivityIndicator size="small" color="#fff" />
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FreeContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignSelf: "center",
  },
  image: {
    height: 250,
    width: width ,
    // padding:10
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    padding:20
  },
  subhead: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontWeight: "bold",
    color: "green",
    fontSize: 17,
  },
  ortext: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3d2a71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
