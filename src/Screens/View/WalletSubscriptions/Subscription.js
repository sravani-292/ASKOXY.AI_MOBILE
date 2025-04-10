import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import BASE_URL, { userStage } from "../../../../Config";
import { useNavigation } from "@react-navigation/native";
import encryptEas from "../../../Screens/View/Payments/components/encryptEas";
import decryptEas from "../../../Screens/View/Payments/components/decryptEas";
import PremiumPlan from "./PremiumPlan";
const { width, height } = Dimensions.get("window");

const Subscription = () => {
  const userData = useSelector((state) => state.counter);
  const customerId = userData.userId;
  const token = userData.accessToken;
  const [loading, setLoading] = useState(false);
  const [subscriptionHistoryData, setSubscriptionHistoryData] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [subscription, setSubscription] = useState();
  const [paymentId, setPaymentId] = useState();
  const [paymentStatus, setPaymentStatus] = useState();
  const [loader, setLoader] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [status, setStatus] = useState(true);
  const [noteResponse, setNoteResponse] = useState();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  const navigation = useNavigation();

  const [profileForm, setProfileForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });

  useEffect(() => {
    const fetchAllDataInOrder = async () => {
      try {
        await getSubscription();
        await fetchSubscriptionData();
        await getProfile();
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };

    fetchAllDataInOrder();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        url:
          BASE_URL +
          `user-service/customerProfileDetails?customerId=${userData.userId}`,
      });

      if (response.status === 200) {
        setProfileForm({
          customer_name: response.data.name,
          customer_email: response.data.email,
          customer_mobile: response.data.mobileNumber,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSubscription = async () => {
    setLoading(true);
    const data = {
      url: BASE_URL + "order-service/getSubscriptionsDetailsForaCustomer",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        customerId: customerId,
      },
    };

    try {
      const response = await axios(data);

      setLoading(false);
      setStatus(response.data.status);
      setNoteResponse(response.data.message);
    } catch (error) {
      setLoading(false);
    }
  };

  const planNames = {
    10000: "Starter",
    20000: "Basic",
    30000: "Silver",
    40000: "Gold",
    50000: "Platinum",
    60000: "Diamond",
    70000: "Elite",
    90000: "Ultra",
    99000: "Premium",
  };

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL + "order-service/getAllPlans", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Plans response:", response.data);

      // if (response.data) {

      //   const updatedPlans = response.data.map((plan) => ({
      //     ...plan,
      //     planName: planNames[plan.amount] || "Custom",
      //     isPremium: planNames[plan.amount] === "Premium"
      //   }));

      //   setSubscriptionHistoryData(updatedPlans);
      // }
      console.log("Plans response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const updatedPlans = response.data.map((plan) => {
          const planName = planNames[plan.amount] || "Custom";
          return {
            ...plan,
            planName,
            isPremium: planName === "Premium",
          };
        });

        setSubscriptionHistoryData(updatedPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = (plan) => {
    setLoader(true);
    Alert.alert(
      "Confirm Subscription",
      `Subscribe to this plan for ₹${plan.amount} and get benefits worth ₹${plan.getAmount}. Would you like to proceed?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setLoader(false),
        },
        {
          text: "OK",
          onPress: () => SubscriptionConfirmation(plan),
        },
      ]
    );
  };

  let postData;

  function SubscriptionConfirmation(details) {
    setSubscription(true);

    postData = {
      customerId: userData.userId,
      planId: details.planId,
    };

    axios
      .post(BASE_URL + "order-service/userSubscriptionAmount", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        if (response.data.paymentId == null && response.data.status == false) {
          Alert.alert(
            "Subscription Status",
            response.data.message.replace(/\. /g, ".\n"),
            [
              {
                text: "OK",
                onPress: () => console.log("Alert closed"),
              },
            ],
            { cancelable: true }
          );
        } else {
          setTransactionId(response.data.paymentId);
          const data = {
            mid: "1152305",
            // amount: details.amount,
            amount:1,
            merchantTransactionId: response.data.paymentId,
            transactionDate: new Date(),
            terminalId: "getepay.merchant128638@icici",
            udf1: profileForm.customer_mobile,
            udf2: profileForm.customer_name,
            udf3: profileForm.customer_email,
            udf4: "",
            udf5: "",
            udf6: "",
            udf7: "",
            udf8: "",
            udf9: "",
            udf10: "",
            ru: "https://app.oxybricks.world/interact/paymentreturn",
            callbackUrl:
              "https://fintech.oxyloans.com/oxyloans/v1/user/getepay",
            currency: "INR",
            paymentMode: "ALL",
            bankId: "",
            txnType: "single",
            productType: "IPG",
            txnNote: "Rice Order in Subscription",
            vpa: "Getepay.merchant129014@icici",
          };
          getepayPortal(data);
        }
      })
      .catch(function (error) {
        console.log(error.response);
        setLoader(false);
      });
  }

  const getepayPortal = async (data) => {
    const JsonData = JSON.stringify(data);
    var ciphertext = encryptEas(JsonData);
    var newCipher = ciphertext.toUpperCase();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        var resultobj = JSON.parse(result);
        var responseurl = resultobj.response;
        var data = decryptEas(responseurl);
        data = JSON.parse(data);

        Requery(data.paymentId);
        setPaymentId(data.paymentId);

        Alert.alert(
          "Payment Confirmation",
          "Are you sure you want to proceed with the payment of to subscribe to this plan?",
          [
            {
              text: "No",
              onPress: () => {
                setLoader(false);
              },
            },
            {
              text: "Yes",
              onPress: () => {
                Linking.openURL(data.qrIntent);
                setLoader(false);
              },
            },
          ]
        );
      })
      .catch((error) => {
        console.log("getepayPortal", error.response);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (
      paymentStatus == "PENDING" ||
      paymentStatus == "" ||
      paymentStatus == null ||
      paymentStatus == "undefined"
    ) {
      const data = setInterval(() => {
        Requery();
      }, 2000);
      return () => clearInterval(data);
    }
  }, [paymentStatus, paymentId]);

  function Requery() {
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null ||
      paymentStatus === undefined
    ) {
      const Config = {
        "Getepay Mid": 1152305,
        "Getepay Terminal Id": "getepay.merchant128638@icici",
        "Getepay Key": "kNnyys8WnsuOXgBlB9/onBZQ0jiYNhh4Wmj2HsrV/wY=",
        "Getepay IV": "L8Q+DeKb+IL65ghKXP1spg==",
      };

      const JsonData = {
        mid: Config["Getepay Mid"],
        paymentId: parseInt(paymentId),
        referenceNo: "",
        status: "",
        terminalId: Config["Getepay Terminal Id"],
        vpa: "",
      };

      var ciphertext = encryptEas(
        JSON.stringify(JsonData),
        Config["Getepay Key"],
        Config["Getepay IV"]
      );

      var newCipher = ciphertext.toUpperCase();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "AWSALBAPP-0=remove; AWSALBAPP-1=remove; AWSALBAPP-2=remove; AWSALBAPP-3=remove"
      );

      var raw = JSON.stringify({
        mid: Config["Getepay Mid"],
        terminalId: Config["Getepay Terminal Id"],
        req: newCipher,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          var resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            var responseurl = resultobj.response;
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            setPaymentStatus(data.paymentStatus);

            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILURE"
            ) {
              axios({
                method: "POST",
                url: BASE_URL + "order-service/userSubscriptionAmount",
                data: {
                  ...postData,
                  paymentId: transactionId,
                  paymentStatus: data.paymentStatus,
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then(function (response) {
                  setLoading(false);
                  Alert.alert(
                    data.paymentStatus,
                    "Successfully you have got subscription",
                    [
                      {
                        text: "Yes",
                        onPress: () => {
                          navigation.navigate("Wallet");
                        },
                      },
                    ]
                  );
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                });
            }
          }
        })
        .catch((error) => console.log("Payment Status", error.response));
    }
  }

  const renderPlan = ({ item, index }) => {
    // Calculate wallet balance based on the amount (using the pattern from the image)
    const walletBalance = item.amount * 1.09;
    const originalPrice = item.amount * 1.09;
    const savings = originalPrice - item.amount;
    const monthlyLimit = item.limitAmount;

   
    const cardColors = ["#9333ea", "#9333ea", "#9333ea"];

    return (
      <>
        {item.status && (
          <View style={styles.planCard}>
            <View style={styles.header}>
              <Text style={styles.planTitle}> {`${item.planName}`} Plan</Text>
              {item.planName == "Premium" && (
                <Text style={styles.bestValue}>BEST VALUE</Text>
              )}
            </View>

            <Text style={styles.priceLabel}>Pay</Text>
            <Text style={styles.priceAmount}>
              ₹{item.amount.toLocaleString()}
            </Text>

            <View style={styles.walletSection}>
              <Text style={styles.walletLabel}>Get in your wallet</Text>
              <Text style={styles.walletAmount}>
                ₹{walletBalance.toLocaleString()}
              </Text>
              <View style={styles.bonusTag}>
                <Text style={styles.bonusText}>
                  + ₹{savings.toLocaleString()} bonus
                </Text>
              </View>
            </View>

            <Text style={styles.benefitsTitle}>Benefits</Text>
            {item.planName == "Premium" ? (
              <>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>🔒</Text>
                  <Text style={styles.benefitText}>
                    <Text style={styles.boldText}>Minimum Lock Period: </Text>30
                    days for first withdrawal; then withdraw ₹99,000 anytime
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>⏳</Text>
                  <Text style={styles.benefitText}>
                    <Text style={styles.boldText}>Monthly Added: </Text>₹2,000
                    to your wallet
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>⚡</Text>
                  <Text style={styles.benefitText}>Instant wallet credit</Text>
                </View>
              </>
            ) : (
              <>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>⚡</Text>
                <Text style={styles.benefitText}>Instant wallet credit</Text>
              </View>
              <View style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>⏳</Text>
                  <Text style={styles.benefitText}>
                    <Text style={styles.boldText}>Monthly Use: </Text>₹{monthlyLimit.toLocaleString()}
                  </Text>
                </View>
              </>
            )}

           {/* The conditional rendering of FAQ button */}
      {item.planName === "Premium" && (
        <TouchableOpacity 
          style={styles.faqButton} 
          onPress={() => setPremiumModalVisible(true)}  
        >
          <Text style={styles.faqText}>❓ FAQs</Text>
        </TouchableOpacity>
      )}
      
      {/* Add the modal at the bottom of your component */}
      <PremiumPlan
        visible={premiumModalVisible}
        onClose={() => setPremiumModalVisible(false)}
      />

            <TouchableOpacity
              style={[styles.chooseButton, { opacity: status ? 0.5 : 1 }]}
              onPress={() => handleSubscription(item)}
              disabled={status || loader}
            >
              {loader ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.chooseButtonText}>
                  {status ? "Subscribed" : "Choose Plan"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#9333ea" />
      ) : (
        <>
          <Text style={styles.header}>Subscription Plans</Text>
          {noteResponse && (
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                <Text style={styles.noteLabel}>Note: </Text>
                {noteResponse}
              </Text>
            </View>
          )}
          {subscriptionHistoryData.length > 0 ? (
            <FlatList
              data={subscriptionHistoryData}
              renderItem={renderPlan}
              keyExtractor={(item) => item.planId.toString()}
              numColumns={1}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.emptyText}>No subscriptions found!</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  listContent: {
    paddingBottom: 16,
  },
  noteContainer: {
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width * 0.9,
    marginBottom: 20,
    alignSelf: "center",
  },
  noteText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    alignSelf: "center",
    fontWeight: "bold",
  },
  noteLabel: {
    color: "red",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#777",
    marginTop: 20,
  },

  // New styles for the cards based on the image
  newPlanContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  walletBalanceSection: {
    padding: 16,
    paddingVertical: 20,
    backgroundColor: "#9333ea",
  },
  walletBalanceLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  walletBalanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  pricingSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subscriptionPriceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actualPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  savingsTag: {
    backgroundColor: "#e6f7ed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  savingsText: {
    color: "#03843b",
    fontSize: 14,
    fontWeight: "500",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  featureBox: {
    marginHorizontal: 16,
    backgroundColor: "#f8f0ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9333ea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 18,
    color: "#fff",
  },
  featureTextContainer: {
    flex: 1,
  },
  featureLabel: {
    fontSize: 16,
    color: "#9333ea",
    fontWeight: "500",
  },
  featureValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chooseButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9333ea",
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chooseButtonText: {
    color: "#9333ea",
    fontSize: 16,
    fontWeight: "600",
  },
  // newly added styles

  planCard: {
    backgroundColor: "#F3E8FF",
    padding: 20,
    borderRadius: 10,
    margin: 15,
    // shadowColor: "#9333ea",
    shadowColor:"#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    // flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9333ea",
    textAlign:"center",
    alignSelf:"center",alignItems:"center"
  },
  bestValue: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#9333ea",
    color: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9333ea",
  },
  walletSection: {
    backgroundColor: "#e9d5ff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  walletLabel: {
    fontSize: 16,
    color: "#444",
  },
  walletAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9333ea",
  },
  bonusTag: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  bonusText: {
    color: "#166534",
    fontWeight: "bold",
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9333ea",
    marginTop: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  benefitText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
    color: "#9333ea",
  },
  faqButton: {
    backgroundColor: "#e9d5ff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  faqText: {
    fontSize: 14,
    color: "#9333ea",
    fontWeight: "bold",
  },
  chooseButton: {
    backgroundColor: "#9333ea",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  chooseButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Subscription;
