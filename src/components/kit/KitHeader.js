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

  // Responsive image size
  const imageSize = width * 0.28; // 28% of screen width

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>ONBOARDING KIT</Text>

      <View style={styles.kitBox}>
        <View style={styles.imagesRow}>
          {/* Bag */}
          <View
            style={[
              styles.imageContainer,
              { width: imageSize+20, height: imageSize+40 },
            ]}
          >
            <Image
              source={require("../../assets/kitSelectionBag.jpg")}
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
              { width: imageSize, height: imageSize },
            ]}
          >
            <Image
              source={require("../../assets/kitSelectionTshirt.png")}
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

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  kitBox: {
    borderWidth: 1,
    borderColor: "#00BCD4",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
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
    fontSize: 28,
    fontWeight: "500",
    color: "#00BCD4",
  },
});
