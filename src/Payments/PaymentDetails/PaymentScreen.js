import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Platform,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { usePaymentDetails } from "./hooks/usePaymentDetails";
import { useSelector } from "react-redux";
import { COLORS } from "../../../../../Redux/constants/theme";
import { getFinalDeliveryFee } from "../PaymentDetails/Components/DeliveryFeeCalculator";
import { useFocusEffect } from "@react-navigation/native";

// Import your existing components
import CouponList from "./Components/CouponList";
import ApplyCoupon from "./Components/ApplyCoupon";
import WalletToggle from "./Components/WalletToggle";
import DateTimeSelector from "./Components/DateTimeSelector";
import PaymentModeSelector from "./Components/PaymentModeSelector";
import BillSummary from "./Components/BillSummary";
import ConfirmButton from "./Components/ConfirmButton";
import DeliveryTimelineModal from "./Components/DeliveryModal";
import TimeSlotModal from "./Components/TimeSlotModal";
import ConfirmationModal from "./Components/ConfirmationModal";
import CustomModal from "../../../../../until/CustomModal";
import PaymentCartCard from "./Components/PaymentCartCard";
import EmptyCartComponent from "../../ShoppingCart/Cart/EmptyCartComponent";

export default function PaymentDetails({ navigation, route }) {
  const {
    coupons,
    couponCode,
    coupenApplied,
    walletAmount,
    useWallet,
    message,
    days,
    timeSlots,
    selectedDay,
    selectedTimeSlot,
    updatedDate,
    modalVisible,
    selectedPaymentMode,
    subTotal,
    freeItemsDiscount,
    coupenDetails,
    usedWalletAmount,
    deliveryBoyFee,
    totalGstSum,
    grandTotalAmount,
    handlingFees,
    distance,
    loading,
    setLoading,
    showModal,
    showConfirmModal,
    modalVissible,
    type,
    title,
    messageModal,
    primaryButtonText,
    secondaryButtonText,
    cartData,
    cartItems,
    isLimitedStock,
    loadingItems,
    removalLoading,
    styles,
    status,
    Icon,
    containerDecision,
    containerItemIds,
    appliedCouponSuccessMsg,
    showSuccess,
    setWaitingLoader,
    setHandlingFees,
    setAppliedCouponSuccessMsg,
    setShowSuccess,
    setCouponCode,
    setSelectedPaymentMode,
    setModalVisible,
    setShowModal,
    setShowConfirmModal,
    setModalVissible,
    setCartItems,
    setAddressList,
    setLocationData,
    addressList,
    locationData,
    setAddressData,
    setStatus,
    setAddressDetails,
    setDeliveryBoyFee,
    setDistance,
    copyToClipboard,
    handleApplyCoupon,
    deleteCoupen,
    handleCheckboxToggle,
    handleDayChange,
    handleTimeSlotChange,
    handleExchangePolicyChange,
    confirmPayment,
    handleOrderConfirmation,
    applyCouponDirectly,
    processThePayment,
    handleIncrease,
    handleDecrease,
    handleRemove,
    addressDetails,
    paymentMethod,
    walletBalance,
    changeLocation,
    fetchOrderAddress,
    waitingLoader,
  } = usePaymentDetails(navigation, route);

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [isCartReady, setIsCartReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCartReady(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [cartData]);

  const updateFeeFromNewAddress = async (location) => {
    const { fee, distance, note, handlingFee, grandTotal } =
      await getFinalDeliveryFee(location.latitude, location.longitude, subTotal);
    setDeliveryBoyFee(fee);
    setDistance(distance);
    setHandlingFees(handlingFee);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.locationdata.status == true) {
        setStatus(route.params.locationdata.status);
        setAddressDetails(route.params.locationdata);
        setAddressData(route.params.locationdata);
        const location = route.params.locationdata;
        setLocationData({
          customerId: customerId,
          flatNo: route.params.locationdata?.flatNo,
          landMark: route.params.locationdata?.landMark,
          pincode: route.params.locationdata?.pincode,
          address: route.params.locationdata?.address,
          addressType: route.params.locationdata?.addressType,
          latitude: route.params.locationdata?.latitude,
          longitude: route.params.locationdata?.longitude,
          area: route.params.locationdata?.area || "",
          houseType: route.params.locationdata?.houseType || "",
          residenceName: route.params.locationdata?.residenceName || "",
        });
        updateFeeFromNewAddress(location);
      } else {
        fetchOrderAddress();
        if (addressList && addressList.length > 0) {
          const lastAddress = addressList[addressList.length - 1];
          setAddressDetails(lastAddress);
        }
      }
    }, [grandTotalAmount, route.params.locationdata, deliveryBoyFee])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        translucent={false}
      />
      {!isCartReady ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#4B0082" />
          <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
            Loading your cart...
          </Text>
        </View>
      ) : cartData.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Integrated Header Content */}
            <View style={headerStyles.headerContainer}>
              <View style={headerStyles.headerContent}>
              
                <View style={headerStyles.addressContainer}>
                  {status ||
                    (addressDetails && (
                      <Text style={headerStyles.deliverToText}>Deliver to</Text>
                    ))}
                  {status ? (
                    <TouchableOpacity
                      style={headerStyles.addressTouchable}
                      onPress={changeLocation}
                      activeOpacity={0.7}
                    >
                      <View style={headerStyles.addressRow}>
                        
                     <Icon name="map-marker" size={25} color="#000" style={{ marginRight: 8 }} />

                        <Text style={headerStyles.addressText} numberOfLines={2}>
                          {locationData.flatNo}, {locationData.landMark},{" "}
                          {locationData.address},{locationData.pincode}
                        </Text>
                        <Icon
                          name="chevron-down"
                          size={14}
                          color="#000"
                          style={headerStyles.chevronIcon}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : addressDetails ? (
                    <TouchableOpacity
                      style={headerStyles.addressTouchable}
                      onPress={changeLocation}
                      activeOpacity={0.7}
                    >
                      <View style={headerStyles.addressRow}>
                     <Icon name="map-marker" size={25} color="#000" style={{ marginRight: 8 }} />

                        <Text style={headerStyles.addressText} numberOfLines={2}>
                          {addressDetails.flatNo}, {addressDetails.landMark},{" "}
                          {addressDetails.pincode},{addressDetails.address}
                        </Text>
                        <Icon
                          name="chevron-down"
                          size={14}
                          color="#000"
                          style={headerStyles.chevronIcon}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={headerStyles.addressTouchable}
                      onPress={changeLocation}
                      activeOpacity={0.7}
                    >
                      <View style={headerStyles.addressRow}>
                        {/* <Text style={headerStyles.noAddressText}>
                          📍 Add delivery address
                        </Text> */}
               <Icon name="map-marker" size={25} color="#000" style={{ marginRight: 8 }} />
              <Text style={headerStyles.noAddressText}>
                Add delivery address
              </Text>
                        <Icon
                          name="plus"
                          size={16}
                          color="#4B0082"
                          style={headerStyles.addIcon}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Coupon List */}
            {coupenApplied==false &&(
            <CouponList
              coupons={coupons}
              onCopy={copyToClipboard}
              onUse={applyCouponDirectly}
            />)}

            {/* Apply Coupon */}
            {/* {coupenApplied &&( */}
            <ApplyCoupon
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              coupenApplied={coupenApplied}
              onApply={(code)=>handleApplyCoupon(code)}
              onRemove={deleteCoupen}
              showSuccess={showSuccess}
              appliedCouponSuccessMsg={appliedCouponSuccessMsg}
              onClose={() => setShowSuccess(false)}
            />
            {/* )} */}

            <View style={styles.container}>
              <View style={styles.cartContainer}>
                <Text style={styles.headerText1}>🛒 My Cart</Text>
                {cartData?.length > 0 && (
                  <Text
                    style={{
                      color: "#007bff",
                      marginTop: 8,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                    onPress={() => {
                      navigation.navigate("Rice Products", {
                        categoryType: "RICE",
                        category: "All CATEGORIES",
                      });
                    }}
                  >
                    Add More
                  </Text>
                )}
              </View>

              <FlatList
                data={cartData}
                keyExtractor={(item) => item.itemId.toString()}
                renderItem={({ item }) => (
                  <View style={styles.cartItemContainer}>
                    <PaymentCartCard
                      item={item}
                      isLimitedStock={isLimitedStock}
                      loadingItems={loadingItems}
                      removalLoading={removalLoading}
                      cartItems={cartItems}
                      containerDecision={containerDecision}
                      containerItemIds={containerItemIds}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                contentContainerStyle={styles.flatListContent}
              />
            </View>

            {/* Wallet Toggle */}
            {walletAmount>0 &&(
            <WalletToggle
              walletAmount={walletAmount}
              useWallet={useWallet}
              message={message}
              onToggle={handleCheckboxToggle}
            />)}

            {/* Date & Time Selector */}
            <DateTimeSelector
              days={days}
              timeSlots={timeSlots}
              selectedDay={selectedDay}
              selectedTimeSlot={selectedTimeSlot}
              updatedDate={updatedDate}
              modalVisible={modalVisible}
              onOpenModal={() => setModalVisible(true)}
              onCloseModal={() => setModalVisible(false)}
              onDayChange={handleDayChange}
              onTimeSlotChange={handleTimeSlotChange}
            />

            {/* Bill Summary */}
            {subTotal > 0 && (
              <BillSummary
                subTotal={subTotal}
                grandTotalAmount={grandTotalAmount}
                handlingFee={handlingFees}
                shippingFee={deliveryBoyFee}
                freeItemsDiscount={freeItemsDiscount}
                coupenApplied={coupenApplied}
                coupenDetails={coupenDetails}
                useWallet={useWallet}
                usedWalletAmount={usedWalletAmount}
                deliveryBoyFee={deliveryBoyFee}
                totalGstSum={Number((totalGstSum || 0.0).toFixed(2))}
                distance={distance}
                onExchangePolicyChange={handleExchangePolicyChange}
              />
            )}
          </ScrollView>

          {/* Fixed Bottom Container and Modals */}
          <View style={styles.fixedBottomContainer}>
            <PaymentModeSelector
              selectedPaymentMode={selectedPaymentMode}
              setSelectedPaymentMode={setSelectedPaymentMode}
              grandTotalAmount={grandTotalAmount}
              confirmPayment={confirmPayment}
              loading={loading}
            />
            <View style={bottomStyles.placeOrderSection}>
              <View style={bottomStyles.totalSection}>
                <Text style={bottomStyles.totalLabel}>Total</Text>
                <Text style={bottomStyles.totalAmount}>
                  ₹{grandTotalAmount.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={bottomStyles.placeOrderButton}
                onPress={confirmPayment}
                disabled={loading}
              >
                <Text style={bottomStyles.placeOrderText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {/* <TimeSlotModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              days={days}
              timeSlots={timeSlots}
              selectedDay={selectedDay}
              selectedTimeSlot={selectedTimeSlot}
              onDayChange={handleDayChange}
              onTimeSlotChange={handleTimeSlotChange}
              onConfirm={() => setModalVisible(false)}
            /> */}
            {/* <DeliveryTimelineModal
              visible={showModal}
              onClose={() => setShowModal(false)}
            /> */}
            <ConfirmationModal
              visible={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={handleOrderConfirmation}
              subTotal={subTotal}
              deliveryFee={deliveryBoyFee}
              handlingFee={handlingFees}
              deliveryAddress={addressDetails}
              paymentMethod={selectedPaymentMode}
              loading={waitingLoader}
              setLoading={setWaitingLoader}
              walletBalance={useWallet ? walletAmount : 0}
              walletAmountUsed={usedWalletAmount}
              isWalletEnabled={useWallet}
              onWalletToggle={handleCheckboxToggle}
              couponApplied={{
                code: couponCode,
                discount: coupenDetails,
                type: "fixed",
              }}
            />
            <CustomModal
              visible={modalVissible}
              type={type}
              title={title}
              message={messageModal}
              primaryButtonText={primaryButtonText}
              secondaryButtonText={secondaryButtonText}
              onClose={() => setModalVissible(false)}
              onPrimaryPress={() => {
                setModalVissible(false);
                if (primaryButtonText === "Pay Now") processThePayment();
              }}
              onSecondaryPress={() => {
                setModalVissible(false);
                if (secondaryButtonText === "Cancel") {
                  // Handle cancel logic here
                }
              }}
            />
          </View>
        </View>
      ) : (
        <EmptyCartComponent />
      )}
    </SafeAreaView>
  );
}


const headerStyles = {
  headerContainer: {
    backgroundColor: "#fff", 
    marginHorizontal: -16, 
    marginTop: -16, 
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    minHeight: 60,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  addressContainer: {
    flex: 1,
    paddingTop: 0,
  },
  deliverToText: {
    fontSize: 11,
    color: "#000",
    fontWeight: "500",
    marginBottom: 6,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  addressTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 36,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
    paddingRight: 8,
  },
  noAddressText: {
    fontSize: 17,
    color: "#000",
    fontWeight: "600",
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 6,
    opacity: 0.8,
  },
  addIcon: {
    marginLeft: 6,
    opacity: 0.9,
  },
};

// Bottom section styles
const bottomStyles = {
  paymentMethodSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  paymentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 8,
    marginRight: 8,
  },
  placeOrderSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  totalSection: {
    flex: 1,
    paddingRight: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    marginTop: 2,
  },
  placeOrderButton: {
    backgroundColor: COLORS.services,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
};