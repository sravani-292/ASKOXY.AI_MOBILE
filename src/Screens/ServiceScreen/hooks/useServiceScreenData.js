// hooks/useServiceScreenData.js
import { useState, useEffect, useCallback } from "react";
import { Alert, BackHandler, Dimensions } from "react-native";
import { useFocusEffect, useNavigation, useNavigationState } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import BASE_URL from "../../../../Config";
import { AccessToken } from "../../../../Redux/action/index";
import { registerAndSaveTokenToSupabase } from "../../../Config/notificationService";
import { useUIVisibility } from "../../../../until/useUIVisibility";
import { getActivePriorityRules } from "../constants/ActivePriorityRules";
import GoogleAnalyticsService from "../../../Components/GoogleAnalytic";
import defaultBanners from "../constants/defaultBanners";
import { services as defaultServices } from "../constants/services";

const useServiceScreenData = () => {
  const { width, height } = Dimensions.get("window");
  const bannerHeight = height * 0.1;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.counter);
  const { visibilityMap } = useUIVisibility();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loginModal, setLoginModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [data, setData] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentScreen = useNavigationState((state) => state.routes[state.index]?.name);

  const handleLogout = async () => {
    Alert.alert("Confirmation", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("userData");
          navigation.navigate("Login");
        },
      },
    ]);
  };

  const handleServicePress = (item) => {
    try {
      if (item.screen !== "Crypto Currency") {
        if (item.screen) {
          navigation.navigate(item.screen, { campaigns: item.campaigns });
        } else if (item.campaignType) {
          navigation.navigate("Campaign", { campaignType: item.campaignType });
        }
      } else if (!userData) {
        Alert.alert("Login Required", "Please login to continue", [
          { text: "Login", onPress: () => navigation.navigate("Login") },
          { text: "Cancel" },
        ]);
      } else if (item.screen) {
        navigation.navigate(item.screen);
      } else if (item.campaignType) {
        navigation.navigate("Campaign", { campaignType: item.campaignType });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const handleBannerPress = (banner) => {
    console.log("Banner Pressed:", banner);
    if (banner.navigationTarget) {
      navigation.navigate(banner.navigationTarget, banner.params || {});
    }
  };

  const getAllCampaign = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
      .then((response) => {
        const allCampaigns = response.data;

        const studyAbroadCampaigns = allCampaigns.filter(
          (item) =>
            item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION") &&
            item.campaignStatus
        );

        const activeCampaigns = allCampaigns.filter((item) => item.campaignStatus);

        const updatedServices = defaultServices.map((service) => {
          if (service.screen === "STUDY ABROAD") {
            return {
              ...service,
              previewCampaign: studyAbroadCampaigns[0],
              campaigns: studyAbroadCampaigns,
            };
          }
          return service;
        });

        const filteredCampaigns = activeCampaigns.filter(
          (item) => !item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION")
        );

        const mergedData = [...updatedServices, ...filteredCampaigns];
        setData(mergedData);
      })
      .catch((error) => {
        console.error("Error fetching campaigns", error);
        setData(defaultServices);
      });
  };


const getRiceCategories = async () => {
  setLoading(true);

  const priorityRules = await getActivePriorityRules("RICE");

  axios
    .get(BASE_URL + "product-service/showGroupItemsForCustomrs")
    .then((response) => {
      setLoading(false);

      const allCategories = response.data || [];
      const orderedCategories = ["RICE", "Grocery", "GOLD"];
      const filteredCategories = orderedCategories
        .map((type) => allCategories.find((cat) => cat.categoryType === type))
        .filter(Boolean);

      const riceCategoryIndex = filteredCategories.findIndex(
        (cat) => cat.categoryType === "RICE"
      );

      if (riceCategoryIndex !== -1) {
        const riceCategory = filteredCategories[riceCategoryIndex];

        // 🟡 1. Prioritize sub-categories like "Combo Offers"
        if (riceCategory.categories && Array.isArray(riceCategory.categories)) {
          riceCategory.categories.sort((a, b) => {
            const getPriority = (name) => {
              const rule = priorityRules.find(
                (r) => r.match_scope === "category" &&
                       name?.toLowerCase().includes(r.match_text.toLowerCase())
              );
              return rule ? rule.priority_order : 999;
            };
            return getPriority(a.categoryName) - getPriority(b.categoryName);
          });
        }

        // 🟢 2. Prioritize items (inside each subcategory)
        riceCategory.categories.forEach((sub) => {
          if (Array.isArray(sub.itemsResponseDtoList)) {
            sub.itemsResponseDtoList.sort((a, b) => {
              const getPriority = (name) => {
                const rule = priorityRules.find(
                  (r) => r.match_scope === "item" &&
                         name?.toLowerCase().includes(r.match_text.toLowerCase())
                );
                return rule ? rule.priority_order : 999;
              };
              return getPriority(a.name) - getPriority(b.name);
            });
          }
        });

        filteredCategories[riceCategoryIndex] = riceCategory;
      }

      setGetCategories(filteredCategories);
      if (filteredCategories[0]) setSelectedMainCategory(filteredCategories[0]);
    })
    .catch((error) => {
      setLoading(false);
      console.error("Error fetching rice categories:", error);
    });
};

  const fetchDynamicBanners = async () => {
  setBannersLoading(true);
  try {
    const response = await axios.get(`${BASE_URL}product-service/getOfferImages`);
    console.log("Banners response:", response.data);

    if (Array.isArray(response.data)) {
      const activeBanners = response.data
        .filter((banner) => banner.status)
        .map((item) => ({
          id: item.id,
          imageUrl: item.imageUrl,
          name: "Promotional Banner", // Or use item.title if available in future
          navigationTarget: null, // Fill this if your backend adds screen info
          params: {}, // Fill this if your backend adds navigation parameters
          active: item.status, // Assuming 'status' indicates if the banner is active
        }));
      
      // If no active banners, fallback to default
      setBanners(activeBanners.length ? activeBanners : defaultBanners);
    } else {
      setBanners(defaultBanners);
    }
  } catch (error) {
    console.error("Error fetching banners:", error);
    setBanners(defaultBanners);
  } finally {
    setBannersLoading(false);
  }
};


  const checkLoginData = async () => {
    if (userData?.accessToken) {
      setLoginModal(false);
      navigation.navigate("Home");
    } else {
      try {
        const loginData = await AsyncStorage.getItem("userData");
        if (loginData) {
          const user = JSON.parse(loginData);
          if (user.accessToken) {
            dispatch(AccessToken(user));
            setLoginModal(false);
            navigation.navigate("Home");
          }
        } else {
          navigation.navigate("Service Screen");
        }
      } catch (error) {
        console.error("Error fetching login data", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        Alert.alert("Exit", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      });

      return () => backHandler.remove();
    }, [currentScreen])
  );

  useFocusEffect(
    useCallback(() => {
      checkLoginData();
      getAllCampaign();
      getRiceCategories();
      fetchDynamicBanners();
    }, [currentScreen])
  );

  useEffect(() => {
    if (userData) {
      registerAndSaveTokenToSupabase(userData.userId);
    }
    GoogleAnalyticsService.screenView("Service Screen");
    GoogleAnalyticsService.sendEvent("Service Screen", {
      modal_type: "Service Screen",
    });
    setLoginModal(true);
  }, [userData]);

  return {
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
  };
};

export default useServiceScreenData;
