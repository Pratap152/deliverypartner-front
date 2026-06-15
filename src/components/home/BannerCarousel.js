import React, { useRef } from 'react';
import {
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
    height: hp('18%'),
    marginHorizontal: wp('2.5%'),
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
    paddingVertical: hp('2.2%'),
    paddingHorizontal: wp('5%'),
  },

  contentContainer: {
    width: '44%',
  },

  title: {
    fontSize: wp('4.2%'),
    fontWeight: '800',
    color: '#0B1F35',
    lineHeight: wp('14%'),
  },

  subtitle: {
    marginTop: -hp('1.5%'),
    fontSize: wp('2.8%'),
    lineHeight: wp('3.8%'),
    color: '#28292b',
    fontWeight: '500',
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('10%'),
    marginTop: hp('0.5%'),
  },

  ctaText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontWeight: '700',
  },
});

export default BannerCarousel;