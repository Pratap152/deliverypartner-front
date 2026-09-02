import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

const KitHeader = () => {
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  const bagSize = isTablet ? 240 : width * 0.28;
  const tshirtSize = isTablet ? 200 : width * 0.28;
const styles = getStyles(isTablet);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>ONBOARDING KIT</Text>

      <View style={styles.kitBox}>
        <View style={styles.imagesRow}>
          {/* Bag */}
          <View
            style={[
              styles.imageContainer,
              {
              width: isTablet ? 260 : bagSize + 20,
              height: isTablet ? 280 : bagSize + 40,
            }
            ]}
          >
            <Image
              source={require("../../assets/new_bag.jpeg")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Plus */}
          <Text style={styles.plus}>+</Text>

          {/* T-shirt */}
          <View
            style={[
              styles.imageContainer,
              {
                width: tshirtSize,
                height: tshirtSize,
              }
            ]}
          >
            <Image
              source={require("../../assets/new_kit.jpeg")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default KitHeader;

const getStyles = (isTablet) =>
  StyleSheet.create({
  wrapper: {
    marginBottom: isTablet ? 32 : 20,
  },

  heading: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  kitBox: {
    borderWidth: 1,
    borderColor: "#00BCD4",
    paddingVertical: isTablet ? 28 : 16,
    paddingHorizontal: isTablet ? 24 : 12,
    borderRadius: isTablet ? 18 : 10,
  },

  imagesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", 
  },

  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  plus: {
    fontSize: isTablet ? 44 : 28,
    fontWeight: "500",
    color: "#00BCD4",
  },
});
