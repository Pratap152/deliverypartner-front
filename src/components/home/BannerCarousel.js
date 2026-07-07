import React, { useRef, useEffect, useCallback } from 'react'; import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ImageBackground,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const ITEM_WIDTH = isTablet ? wp('88%') : wp('88%');
const ITEM_SPACING = isTablet ? wp('1.5%') : wp('2%');
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;

const BannerCarousel = ({ data }) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const currentIndex = useRef(data.length);
  const timerRef = useRef(null);

  const infiniteData =
    data?.length > 0
      ? [...data, ...data, ...data]
      : [];

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
  switch (item.type) {
    case 'bank':
      navigation.navigate('AddBankDetails');
      break;

    case 'kit':
      handleKitPress();
      break;

    case 'referAndEarn':
      navigation.navigate('ReferEarn');
      break;

    case 'dailyIncentive':
      navigation.navigate('IncentiveDetails');
      break;

    case 'joiningBonus':
      navigation.navigate('JoiningBonusScreen');
      break;

    case 'promotional':
      if(item.promoType==="EV"){
         navigation.navigate("EVScreen")
      }
      break;

    default:
      console.log('Banner clicked', item);
      break;
  }
};

  const startAutoScroll = useCallback(() => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      currentIndex.current += 1;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);
  }, []);

  useEffect(() => {
    if (!data?.length) return;

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: data.length,
        animated: false,
      });
    }, 100);
  }, [data]);

  useEffect(() => {
    if (!data?.length) return;

    startAutoScroll();

    return () => clearInterval(timerRef.current);
  }, [data, startAutoScroll]);

  const onScrollBeginDrag = () => {
    clearInterval(timerRef.current);
  };

  const onMomentumScrollEnd = event => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SNAP_WIDTH
    );

    currentIndex.current = index;

    const total = data.length;

    // Jump to middle copy if reached start copy
    if (index < total) {
      currentIndex.current = index + total;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: false,
      });
    }

    // Jump to middle copy if reached end copy
    if (index >= total * 2) {
      currentIndex.current = index - total;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: false,
      });
    }

    startAutoScroll();
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => handlePress(item)}
        style={styles.banner}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <Text
                style={styles.title}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Text
                style={styles.subtitle}
                numberOfLines={3}
              >
                {item.subtitle}
              </Text>
            </View>

            <View style={styles.cta}>
              <Text style={styles.ctaText}>
                {item.cta}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };
  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={infiniteData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_WIDTH}
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SNAP_WIDTH,
          offset: SNAP_WIDTH * index,
          index,
        })}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? wp('4%') : 0,
        }}
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
    height: isTablet ? hp('22%') : hp('18%'),
    marginRight: ITEM_SPACING,
    overflow: 'hidden',
  },

  imageBackground: {
    width: '100%',
    height: '100%',
  },

  imageStyle: {
    borderRadius: wp('5%'),
    width: '100%',
    height: '100%',
  },

  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: isTablet ? hp('1.5%') : hp('2.2%'),
    paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
  },

  contentContainer: {
    width: isTablet ? '30%' : '44%',
    marginTop: isTablet ? hp('4%') : 0,
  },

  title: {
    fontSize: isTablet ? wp('3%') : wp('4.2%'),
    fontWeight: '800',
    color: '#0B1F35',
    lineHeight: isTablet ? hp('2.8%') : wp('14%'),
  },

  subtitle: {
    marginTop: isTablet ? hp('0.5%') : -hp('1.5%'),
    fontSize: isTablet ? wp('2.5') : wp('2.8%'),
    lineHeight: isTablet ? hp('2.2%') : wp('3.8%'),
    color: '#28292b',
    fontWeight: '500',
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingHorizontal: isTablet ? wp('2.2%') : wp('5%'),
    paddingVertical: isTablet ? hp('0.6%') : hp('1%'),
    borderRadius: wp('10%'),
    marginBottom: isTablet ? hp('0.5%') : 0,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'),
    fontWeight: '700',
  },
});

export default BannerCarousel;