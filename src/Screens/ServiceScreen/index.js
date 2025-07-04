// screens/ServiceScreen/index.js
import React, { act } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  Platform,
} from "react-native";
import styles from "./styles";
import Header from "./components/Header";
import BannerCarousel from "./components/BannerCarousel";
import ServiceList from "./components/ServiceList";
import SubCategoryList from "./components/SubCategoryList";
import LoginModal from "../../Components/LoginModal";
import LottieView from "lottie-react-native";
import AskoxyOffers from "../View/Offers/AskoxyOffers";
import useServiceScreenData from "./hooks/useServiceScreenData";
import TopTapBar from "./components/TopTapBar";

const ServiceScreen = () => {
  const {
    userData,
    loginModal,
    loading,
    banners,
    bannersLoading,
    activeIndex,
    setActiveIndex,
    data,
    handleLogout,
    handleBannerPress,
    handleServicePress,
    selectedMainCategory,
    setSelectedMainCategory,
    getCategories,
    visibilityMap,
    bannerHeight,
  } = useServiceScreenData();

  const tabItems = getCategories.map((cat) => ({
  key: cat.categoryType,
  label: cat.categoryType,
  icon:
    cat.categoryType === "RICE"
      ? "shopping-bag"
      : cat.categoryType === "Grocery"
      ? "cloud-sun"
      : cat.categoryType === "GOLD"
      ? "coins"
      : "box", // fallback icon
  activeIcon:
    cat.categoryType === "RICE"
      ? "shopping-bag"
      : cat.categoryType === "Grocery"
      ? "cloud"
      : cat.categoryType === "GOLD"
      ? "coins"
      : "box", // fallback active icon
}));


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A148C" barStyle="light-content" />

      {loading ? (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("../../../assets/AnimationLoading.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : (
        <>
          <Header userData={userData} handleLogout={handleLogout} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <BannerCarousel
              banners={banners}
              loading={bannersLoading}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onBannerPress={handleBannerPress}
              bannerHeight={bannerHeight}
            />
            <ServiceList services={data} onPress={handleServicePress} />
            {visibilityMap?.show_offer_modal && <AskoxyOffers />}

           <TopTapBar
  tabs={tabItems} // [{ key: 'RICE', label: 'Rice', icon: 'shopping-bag' }, ...]
 selectedKey={selectedMainCategory?.categoryType}
  onTabPress={(key) => {
    const found = getCategories.find((cat) => cat.categoryType === key);
    if (found) setSelectedMainCategory(found);
  }}
  indicatorColor="#4A148C"
/>



            <SubCategoryList selectedCategory={selectedMainCategory} />
          </ScrollView>

          {!userData && <LoginModal visible={loginModal} onClose={() => {}} />}
        </>
      )}
    </SafeAreaView>
  );
};

export default ServiceScreen;
