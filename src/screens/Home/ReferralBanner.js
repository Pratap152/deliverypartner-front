import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = width * 0.42;

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
    height:280,
    backgroundColor: '#0A8F4D',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  bannerTextContainer: {
    flex: 1,
  },

  bannerSmallText: {
    color: '#E6F4EC',
    fontSize: 24,
  },

  bannerAmountText: {
    color: '#E0C881',
    fontSize: 50,
    fontWeight: '700',
    marginVertical: 4,
  },

  moneyBagImage: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom:60
  },
});
    