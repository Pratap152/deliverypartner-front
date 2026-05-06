
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = wp('90%');

const BannerCarousel = ({ data}) => {
    const navigation = useNavigation();
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    if (!data || data.length <= 1) return;

    const interval = setInterval(() => {
      currentIndex.current =
        (currentIndex.current + 1) % data.length;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data || data.length === 0) return null;

 const renderItem = ({ item }) => {
  const handlePress = () => {
  switch (item.id) {
    case 'bank':
      navigation.navigate('AddBankDetails');
      break;

    case 'kit':
      navigation.navigate('KitSelectionScreen');
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

  return (
    <View style={[styles.banner, { backgroundColor: item.backgroundColor }]}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      <Pressable onPress={handlePress} style={styles.cta}>
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
  },
  subtitle: {
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
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
  },
});

export default React.memo(BannerCarousel);

