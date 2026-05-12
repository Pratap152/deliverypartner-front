import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ITEM_WIDTH = wp('90%');

const BannerCarousel = ({ data }) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  const kitCompleted = useSelector(state => state.kit?.kitCompleted ?? false);
  const apiResponse = useSelector(state => state.kit?.apiResponse ?? null);
  const deliveryMode = useSelector(state => state.kit?.deliveryMode ?? null);

  const handleKitPress = () => {
    const firstItem = apiResponse?.data?.[0];
    const paymentStatus = firstItem?.Payment?.status ?? null;
    const kitStatus = firstItem?.status ?? null;

    const isPaid =
      kitCompleted ||
      paymentStatus === 'COMPLETED' ||
      paymentStatus === 'SUCCESS' ||
      kitStatus === 'PAYMENT_COMPLETED';

    if (isPaid && apiResponse) {
      navigation.navigate('SuccessScreen', {
        apiResponse,
        deliveryMode,
      });
      return;
    }

    navigation.navigate('KitSelectionScreen');

    console.log('kitCompleted =>', kitCompleted);
    console.log('apiResponse =>', apiResponse);
    console.log('paymentStatus =>', paymentStatus);
    console.log('kitStatus =>', kitStatus);
  };

  const handlePress = item => {
    switch (item.id) {
      case 'bank':
        navigation.navigate('AddBankDetails');
        break;
      case 'kit':
        handleKitPress();
        break;
      case 'refer':
        navigation.navigate('ReferEarn');
        break;
      case 'incentives':
        navigation.navigate('IncentiveDetails');
        break;
      case 'joining':
        navigation.navigate('JoiningBonusScreen');
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.banner, { backgroundColor: item.backgroundColor }]}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <Pressable onPress={() => handlePress(item)} style={styles.cta}>
          <Text style={styles.ctaText}>{item.cta}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: hp('2%'),
  },
  banner: {
    width: ITEM_WIDTH,
    height: hp('16%'),
    marginHorizontal: wp('2.5%'),
    borderRadius: wp('4%'),
    padding: wp('4%'),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
    color: '#000',
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('5%'),
  },
  ctaText: {
    color: '#fff',
    fontSize: wp('3.2%'),
    fontWeight: '600',
  },
});

export default BannerCarousel;