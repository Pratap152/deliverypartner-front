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
    height: hp("32%"),
    backgroundColor: '#0A8F4D',
    borderBottomLeftRadius: wp("12%"),
    borderBottomRightRadius: wp("12%"),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp("4%"),
  },

  bannerTextContainer: {
    flex: 1,
  },

  bannerSmallText: {
    color: '#E6F4EC',
    fontSize: wp("5.5%"),
  },

  bannerAmountText: {
    color: '#E0C881',
    fontSize: wp("12%"),
    fontWeight: '700',
    marginVertical: hp("0.8%"),
  },

  moneyBagImage: {
    width: wp("45%"),
    height: wp("45%"),
    marginBottom: hp("6%"),
  },
});
