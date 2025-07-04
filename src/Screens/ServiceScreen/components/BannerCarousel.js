// import React, { useEffect } from "react";
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   useWindowDimensions,
// } from "react-native";
// import LottieView from "lottie-react-native";
// import styles from "./styles/BannerStyles";

// const BannerCarousel = ({
//   banners = [],
//   loading = false,
//   activeIndex = 0,
//   setActiveIndex,
//   onBannerPress,
//   bannerHeight,
//   autoLoop = true,
//   interval = 3000,
// }) => {
//   const { width } = useWindowDimensions();

//   // Filter only banners with active: true
//   const activeBanners = banners.filter((banner) => banner.active === true);

//   useEffect(() => {
//     let loopInterval;
//     if (autoLoop && activeBanners.length > 1) {
//       loopInterval = setInterval(() => {
//         const nextIndex = (activeIndex + 1) % activeBanners.length;
//         setActiveIndex(nextIndex);
//       }, interval);
//     }
//     return () => {
//       if (loopInterval) clearInterval(loopInterval);
//     };
//   }, [activeIndex, activeBanners]);

//   if (loading) {
//     return (
//       <View style={[styles.bannerLoadingContainer, { height: bannerHeight }]}>
//         <LottieView
//           source={require("../../../../assets/AnimationLoading.json")}
//           autoPlay
//           loop
//           style={{ width: 80, height: 80 }}
//         />
//       </View>
//     );
//   }

//   const currentBanner = activeBanners[activeIndex];

//   return (
//     <View style={[styles.bannerContainer, { height: bannerHeight }]}>
//       {currentBanner && (
//         <TouchableOpacity
//           style={[styles.bannerImageContainer, { width }]}
//           onPress={() => onBannerPress(currentBanner)}
//           activeOpacity={0.8}
//         >
//           {currentBanner.imageUrl ? (
//             <Image
//               source={{ uri: currentBanner.imageUrl }}
//               style={[styles.bannerImage, { height: bannerHeight }]}
//               resizeMode="contain"
//               defaultSource={require("../../../../assets/Images/r1.png")}
//             />
//           ) : (
//             <Image
//               source={currentBanner.image}
//               style={[styles.bannerImage, { height: bannerHeight }]}
//               resizeMode="contain"
//             />
//           )}
//         </TouchableOpacity>
//       )}

//       {/* Dot pagination */}
//       <View style={styles.paginationContainer}>
//         {activeBanners.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.paginationDot,
//               activeIndex === index
//                 ? styles.activeDot
//                 : styles.inactiveDot,
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// export default BannerCarousel;

import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import styles from "./styles/BannerStyles";

const BannerCarousel = ({
  banners = [],
  loading = false,
  activeIndex = 0,
  setActiveIndex,
  onBannerPress,
  bannerHeight,
  autoLoop = true,
  interval = 3000,
}) => {
  const { width } = useWindowDimensions();

  // Filter banners by either .status (from API) or .active (from defaults)
  const activeBanners = banners.filter(
    (banner) => banner?.status === true || banner?.active === true
  );

  useEffect(() => {
    let loopInterval;
    if (autoLoop && activeBanners.length > 1) {
      loopInterval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % activeBanners.length;
        setActiveIndex(nextIndex);
      }, interval);
    }
    return () => {
      if (loopInterval) clearInterval(loopInterval);
    };
  }, [activeIndex, activeBanners, autoLoop, interval]);

  if (loading) {
    return (
      <View style={[styles.bannerLoadingContainer, { height: bannerHeight }]}>
        <LottieView
          source={require("../../../../assets/AnimationLoading.json")}
          autoPlay
          loop
          style={{ width: 80, height: 80 }}
        />
      </View>
    );
  }

  const currentBanner = activeBanners[activeIndex];

  return (
    <View style={[styles.bannerContainer, { height: bannerHeight }]}>
      {currentBanner && (
        <TouchableOpacity
          style={[styles.bannerImageContainer, { width }]}
          onPress={() => onBannerPress?.(currentBanner)}
          activeOpacity={0.8}
        >
          {currentBanner.imageUrl ? (
            <Image
              source={{ uri: currentBanner.imageUrl }}
              style={[styles.bannerImage, { height: bannerHeight }]}
              resizeMode="contain"
              defaultSource={require("../../../../assets/Images/r1.png")}
            />
          ) : currentBanner.image ? (
            <Image
              source={currentBanner.image}
              style={[styles.bannerImage, { height: bannerHeight }]}
              resizeMode="contain"
            />
          ) : null}
        </TouchableOpacity>
      )}

      {/* Dot pagination */}
      <View style={styles.paginationContainer}>
        {activeBanners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index
                ? styles.activeDot
                : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;

