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

  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);

  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const kitCompleted = riderKitData?.kitCompleted ?? false;
  const apiResponse = riderKitData?.apiResponse ?? null;
  const deliveryMode = riderKitData?.deliveryMode ?? null;

  const addressData = riderKitData?.addressData ?? null;
  const selectedZone = riderKitData?.selectedZone ?? null;
  const currentStep = riderKitData?.currentStep ?? null;

  const handleKitPress = () => {
    const firstItem = apiResponse?.data?.[0];
    const paymentStatus = firstItem?.Payment?.status ?? null;
    const kitStatus = firstItem?.status ?? null;

    const isPaid =
      kitCompleted &&
      (
        paymentStatus === 'SUCCESS' ||
        paymentStatus === 'COMPLETED' ||
        kitStatus === 'READY_FOR_DISPATCH' ||
        kitStatus === 'PAYMENT_COMPLETED'
      );

    if (isPaid || currentStep === 'SuccessScreen') {
      navigation.navigate('SuccessScreen', {
        apiResponse,
        deliveryMode,
      });
      return;
    }

    if (currentStep === 'PaymentsScreen') {
      navigation.navigate('PaymentsScreen', {
        apiResponse,
        deliveryMode,
        addressData,
        selectedZone,
      });
      return;
    }

    if (currentStep === 'KitPickupSelection') {
      navigation.navigate('KitPickupSelection', {
        apiResponse,
        deliveryMode,
        addressData,
        selectedZone,
      });
      return;
    }

    navigation.navigate('KitSelectionScreen');
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
      <Pressable
        onPress={() => handlePress(item)}
        style={[styles.banner, { backgroundColor: item.backgroundColor }]}
      >
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>{item.cta}</Text>
        </View>
      </Pressable>
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