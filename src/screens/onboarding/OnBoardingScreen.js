import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import LoginEntryScreen from './LoginEntryScreen';
 
const slides = [
  {
    id: "1",
    title: "Hey!",
    title1: "Welcome Onboard",
    emoji: "😄",
    description:
      "Lets start quickly, Its very easy to start and process. We’ll be all there to help you & guide you to start journey with us as a Delivery Boy.",
    leaf: require("../Screens/assets/leaf.png"),
    wave: require("../Screens/assets/waves.png"),
    image: require("../Screens/assets/delivery-boy.png"),
    bg: require("../Screens/assets/Ellipse.png"),
  },
  {
    id: "2",
    title: "Let’s",
    title1: "Start Now",
    description:
      "Start your journey with us and begin accepting delivery tasks instantly",
    wave: require("../Screens/assets/waves.png"),
    image: require("../Screens/assets/delivery.png"),
    bg: require("../Screens/assets/Ellipse2.png"),
  },
];
 
const OnBoardingScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
 
  // 🔥 FIXED VIEWABILITY (smooth index updates)
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  });
 
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { viewAreaCoveragePercentThreshold: 50 },
      onViewableItemsChanged: onViewRef.current,
    },
  ]).current;
 
  // 🔁 AUTO SCROLL LOOP
  useEffect(() => {
    let interval = null;
 
    if (autoScroll) {
      interval = setInterval(() => {
        setIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
 
          const scrollTo = nextIndex < slides.length ? nextIndex : 0;
 
          flatListRef.current?.scrollToIndex({
            index: scrollTo,
            animated: true,
          });
 
          return scrollTo;
        });
      }, 2000);
    }
 
    return () => clearInterval(interval);
  }, [autoScroll]);
 
  return (
    <View style={styles.container}>
      {/* SLIDE LIST */}
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        renderItem={({ item }) => (
          <View style={{ width: wp("100%"), alignItems: "center" }}>
            <ImageBackground source={item.bg} style={styles.bgImage}>
              <View style={styles.imgWrap}>
                {item.leaf && <Image source={item.leaf} style={styles.leaf} />}
                {item.wave && <Image source={item.wave} style={styles.wave} />}
 
                <Image
                  source={item.image}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              </View>
            </ImageBackground>
 
            {/* TEXT */}
            <View style={styles.bottom}>
              <Text style={styles.title}>
                {item.title} {item.emoji}
              </Text>
              <Text style={styles.title1}>{item.title1}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
 
      {/* INDICATORS */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: index === i ? wp("7%") : wp("2%"),
                backgroundColor: index === i ? "#0AA17F" : "#999",
              },
            ]}
          />
        ))}
      </View>
 
      {/* BUTTONS */}
      {index === 0 ? (
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => flatListRef.current.scrollToIndex({ index: 1 })}
        >
          <Image
            source={require("../Screens/assets/arrow.png")}
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.getStartedBtn}
          onPress={() => {
            setAutoScroll(false);
            navigation.navigate("LoginEntryScreen");
          }}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
 
export default OnBoardingScreen;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#CDF5E7",
  },
 
  bgImage: {
    width: wp("100%"),
    height: hp("62%"),
    alignItems: "center",
  },
 
  imgWrap: {
    width: wp("100%"),
    alignItems: "center",
  },
 
  leaf: {
    position: "absolute",
    top: hp("15%"),
    left: wp("2%"),
    width: wp("20%"),
    height: hp("12%"),
  },
 
  wave: {
    position: "absolute",
    top: hp("15%"),
    right: wp("5%"),
    width: wp("14%"),
    height: hp("6%"),
  },
 
  mainImage: {
    width: wp("86%"),
    height: hp("35%"),
    marginTop: hp("18%"),
  },
 
  bottom: {
    width: "100%",
    marginTop: hp("2%"),
  },
 
  title: {
    fontSize: hp("3%"),
    fontWeight: "500",
    color: "#000",
    marginLeft: wp("6%"),
  },
 
  title1: {
    fontSize: hp("2.8%"),
    fontWeight: "700",
    color: "#000",
    marginLeft: wp("6%"),
    marginTop: hp("1%"),
  },
 
  description: {
    fontSize: hp("1.8%"),
    fontWeight: "600%",
    color: "#555",
    paddingHorizontal: wp("6%"),
    marginTop: hp("1%"),
    lineHeight: hp("3%"),
  },
 
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: hp("14%"),
  },
 
  dot: {
    height: hp("1%"),
    borderRadius: 50,
    marginHorizontal: wp("1%"),
  },
 
  arrowBtn: {
    position: "absolute",
    bottom: hp("9%"),
    right: wp("15%"),
  },
 
  arrowImage: {
    width: wp("6%"),
    height: hp("5%"),
    marginBottom: hp("3%"),
  },
 
  getStartedBtn: {
    backgroundColor: "#0AA17F",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("8%"),
    borderRadius: wp("8%"),
    position: "absolute",
    bottom: hp("5%"),
  },
 
  getStartedText: {
    color: "#fff",
    fontSize: hp("2.5%"),
    fontWeight: "700",
  },
});