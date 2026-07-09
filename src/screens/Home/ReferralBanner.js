 import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ReferralBanner = React.memo(() => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerSmallText}>Earn upto</Text>
        <Text style={styles.bannerAmountText}>₹1000</Text>
        <Text style={styles.bannerSmallText}>For every referral</Text>
      </View>

      <Image
        source={require('../../assets/earn.png')}
        style={styles.moneyBagImage}
        resizeMode="contain"
      />
    </View>
  );
});

export default ReferralBanner;

const styles = StyleSheet.create({
  bannerContainer: {
    // borderWidth:1,
    margin:15,
    height: hp("22%"),
    backgroundColor: '#b5dfeb',
    borderRadius:28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp("4%"),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },

  bannerTextContainer: {
    flex: 1,
  },

  bannerSmallText: {
    color: '#151313',
    fontSize: wp("5%"),
  },

  bannerAmountText: {
    color: '#241f0f',
    fontSize: wp("8%"),
    fontWeight: '700',
    marginVertical: hp("0.8%"),
  },

  moneyBagImage: {
    width: wp("40%"),
    height: wp("45%"),
  },
});
