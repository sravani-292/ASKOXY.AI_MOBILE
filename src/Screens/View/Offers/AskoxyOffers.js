import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

const AskoxyOffers = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const openFaqModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      <LinearGradient
        colors={["#9638eb", "#bc73fa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
       
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>LIMITED TIME</Text>
        </View>

        <View style={styles.contentContainer}>
         
          <View style={styles.leftSection}>
            <Text style={styles.heading}>Exclusive Rice Offers!</Text>

            <View style={styles.offerRow}>
              <TouchableOpacity style={styles.offerButton}>
                <FontAwesome5
                  name="box"
                  size={18}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.offerText}>
                  Buy 26kgs Get 20KG+ Steel Container
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.offerButton}>
                <MaterialIcons
                  name="kitchen"
                  size={18}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.offerText}>
                  Buy 26kg Get 35KG+ Steel Container
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>

         
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.roundButton} onPress={openFaqModal}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#7B1FA2"
              />
              <Text style={styles.roundButtonText}>FAQs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roundButton, styles.shopButton]}
              onPress={() =>
                navigation.navigate("Rice Products", {
                  screen: "Rice Products",
                  category: "All CATEGORIES",
                })
              }
            >
              <Text style={[styles.roundButtonText, styles.shopButtonText]}>
                Shop Now
              </Text>
              <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.showMoreButton}>
          <TouchableOpacity style={styles.roundButton} onPress={() => {navigation.navigate("Special Offers")}}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#7B1FA2"
                />
                <Text style={styles.roundButtonText}>Show More Offer's</Text>
              </TouchableOpacity>
            </View> */}
      </LinearGradient>

      {/* <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#9638eb", "#bc73fa"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>
                Promotional Offers – Frequently Asked Questions
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

          
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={true}
            >
           
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    What are the current promotional offers?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.offerHighlight}>
                        🧧 Buy 1 KG Rice
                      </Text>{" "}
                      — Get 1 KG Free{" "}
                      <Text style={styles.offerTag}>(1+1 Offer)</Text>
                    </Text>
                  </View>

                  <View style={styles.offerItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.offerHighlight}>
                        🧧 Buy 10 KG Rice
                      </Text>{" "}
                      — Get a FREE 18+ KG Steel Container{" "}
                      <Text style={styles.offerWorth}>(Worth ₹1800)</Text>
                    </Text>
                  </View>

                  <View style={styles.offerItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.offerHighlight}>
                        🧧 Buy 26 KG Rice
                      </Text>{" "}
                      — Get a FREE 35+ KG Steel Container{" "}
                      <Text style={styles.offerWorth}>(Worth ₹2300)</Text>
                    </Text>
                  </View>
                </View>
              </View>

         
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    Which rice brands are eligible?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.checkBox}>
                      <Entypo name="check" size={14} color="#4CAF50" />
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.greenText}>All rice brands</Text> —
                      Eligible for the steel container offers (10 KG & 26 KG
                      packs)
                    </Text>
                  </View>
                </View>
              </View>

           
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    Do I need to sign any agreement or policy?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.checkBox}>
                      <Entypo name="check" size={14} color="#4CAF50" />
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.greenText}>Yes.</Text> To receive the
                      steel container, you must sign the offer policy as part of
                      the terms and conditions.
                    </Text>
                  </View>
                </View>
              </View>

            
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    How much rice should I buy to own the steel container?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <Text style={styles.optionsText}>You have two options:</Text>

                  <View style={styles.offerItem}>
                    <View style={styles.planBullet}>
                      <Text style={styles.planBulletText}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.planText}>
                        Plan A – Purchase-Based:
                      </Text>{" "}
                      Buy 9 rice bags (10 KG or 26 KG) within 3 years
                    </Text>
                  </View>

                  <View style={styles.offerItem}>
                    <View style={[styles.planBullet, styles.planBOrange]}>
                      <Text style={styles.planBulletText}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.planText}>
                        Plan B – Referral-Based:
                      </Text>{" "}
                      Refer 9 new users to the ASKOXY.ai platform
                    </Text>
                  </View>
                </View>
              </View>

        
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    Are the 1+1 and container offers applicable more than once?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.crossBox}>
                      <Entypo name="cross" size={14} color="#F44336" />
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.redText}>No.</Text> Both the 1+1 KG
                      offer and the steel container offer can be claimed{" "}
                      <Text style={styles.boldText}>only once per address</Text>
                      .
                    </Text>
                  </View>
                </View>
              </View>

         
              <View style={styles.bottomSpace} />
            </ScrollView>
          </View>
        </View>
      </Modal> */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#9638eb", "#bc73fa"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>
                Promotional Offers – Frequently Asked Questions
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

          
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={true}
            >
           
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    What are the current promotional offers?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  {/* <View style={styles.offerItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.offerHighlight}>
                        🧧 Buy 1 KG Rice
                      </Text>{" "}
                      — Get 1 KG Free{" "}
                      <Text style={styles.offerTag}>(1+1 Offer)</Text>
                    </Text>
                  </View> */}

                  <View style={styles.offerItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.offerHighlight}>
                        🧧 Buy 10KGS or 26KGS Rice
                      </Text>{" "}
                      — Get a FREE 20+ KG Steel Container{" "}
                      <Text style={styles.offerWorth}>(Worth ₹1800)</Text>
                    </Text>
                  </View>

                  {/* <View style={styles.offerItem}>
                    <View style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.offerHighlight}>
                        🧧 Buy 26 KG Rice
                      </Text>{" "}
                      — Get a FREE 35+ KG Steel Container{" "}
                      <Text style={styles.offerWorth}>(Worth ₹2300)</Text>
                    </Text>
                  </View> */}
                  
                  <View style={styles.importantNotice}>
                    <Text style={styles.importantText}>
                      <Text style={styles.boldRedText}>IMPORTANT:</Text> All offers are valid for <Text style={styles.boldRedText}>ONE-TIME USE ONLY</Text> and limited to <Text style={styles.boldRedText}>ONE PER ADDRESS</Text>.
                    </Text>
                  </View>
                </View>
              </View>

         
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    Which rice brands are eligible?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.checkBox}>
                      <Entypo name="check" size={14} color="#4CAF50" />
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.greenText}>All rice brands</Text> —
                      Eligible for the steel container offers (10 KG & 26 KG
                      packs)
                    </Text>
                  </View>
                </View>
              </View>

           
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    Do I need to sign any agreement or policy?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.checkBox}>
                      <Entypo name="check" size={14} color="#4CAF50" />
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.greenText}>Yes.</Text> To receive the
                      steel container, you must sign the offer policy as part of
                      the terms and conditions.
                    </Text>
                  </View>
                </View>
              </View>

            
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    How much rice should I buy to own the steel container?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <Text style={styles.optionsText}>You have two options:</Text>

                  <View style={styles.offerItem}>
                    <View style={styles.planBullet}>
                      <Text style={styles.planBulletText}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.planText}>
                        Plan A – Purchase-Based:
                      </Text>{" "}
                      Buy 9 rice bags (10 KG or 26 KG) within 3 years
                    </Text>
                  </View>

                  <View style={styles.offerItem}>
                    <View style={[styles.planBullet, styles.planBOrange]}>
                      <Text style={styles.planBulletText}>•</Text>
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.planText}>
                        Plan B – Referral-Based:
                      </Text>{" "}
                      Refer 9 new users to the ASKOXY.ai platform
                    </Text>
                  </View>
                </View>
              </View>

        
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Text style={styles.questionText}>
                    Are steel container offers applicable more than once?
                  </Text>
                </View>
                <View style={styles.faqAnswer}>
                  <View style={styles.offerItem}>
                    <View style={styles.crossBox}>
                      <Entypo name="cross" size={14} color="#F44336" />
                    </View>
                    <Text style={styles.offerDetail}>
                      <Text style={styles.redText}>No.</Text> These promotional offers are strictly limited to 
                      <Text style={styles.boldRedText}> ONE-TIME USE ONLY</Text> and 
                      <Text style={styles.boldRedText}> ONE PER ADDRESS</Text>. No exceptions will be made.
                    </Text>
                  </View>
                </View>
              </View>

         
              <View style={styles.bottomSpace} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AskoxyOffers;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: "relative",
    overflow: "hidden",
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF9800",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  offerRow: {
    flexDirection: "column",
    gap: 10,
  },
  offerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 24,
    maxWidth: "100%",
  },
  offerText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
    flexShrink: 1,
  },
  icon: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 8,
    borderRadius: 20,
  },
  rightSection: {
    flexDirection: "column",
    gap: 12,
    alignItems: "flex-end",
  },
  roundButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 100,
    justifyContent: "center",
  },
  roundButtonText: {
    color: "#7B1FA2",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  shopButton: {
    backgroundColor: "#FF9800",
    elevation: 3,
  },
  shopButtonText: {
    color: "#fff",
  },
  decorationImage: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 100,
    height: 100,
    opacity: 0.2,
    zIndex: 1,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#bc73fa',
  },
  modalContent: {
    backgroundColor: "#F8F7FC",
    borderRadius: 16,
    width: width * 0.9,
    height: height * 0.8,
    overflow: "hidden",
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  faqQuestion: {
    backgroundColor: "#F0E7F6",
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#bc73fa",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#673AB7",
  },
  faqAnswer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  offerItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 16,
    alignItems: "center",
    paddingTop: 2,
  },
  bulletIcon: {
    fontSize: 18,
    color: "#673AB7",
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  crossBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  offerDetail: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  offerHighlight: {
    fontWeight: "600",
    color: "#673AB7",
  },
  offerTag: {
    color: "#FF9800",
    fontWeight: "600",
  },
  offerWorth: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  greenText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  redText: {
    color: "#F44336",
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "700",
  },
  optionsText: {
    marginBottom: 10,
    fontSize: 14,
    color: "#666",
  },
  planBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  planBOrange: {
    backgroundColor: "#FFF3E0",
  },
  planBulletText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "bold",
  },
  planText: {
    fontWeight: "600",
    color: "#333",
  },
  bottomSpace: {
    height: 20,
  },
  showMoreButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 3,
    alignSelf:"flex-end"
  },
});
