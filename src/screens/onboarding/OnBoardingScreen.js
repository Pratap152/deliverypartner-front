import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from 'react-native-vector-icons/Ionicons';

const slides = [
  {
    id: '1',
    title: 'Hey!',
    subtitle: 'Welcome Onboard.',
    description:
      'Lets start quickly, Its very easy to start and process. We’ll be all there to help you & guide you to start journey with us as a Delivery Agent.',
    image: require('../../assets/onboarding_1.jpg'),
  },
  {
    id: '2',
    title: 'Let’s',
    subtitle: 'Start Now',
    description:
      'Lets Start deliveries and Earn Together and Grow together for the Better Future.',
    image: require('../../assets/onboarding_2.png'),
  },
];

const OnBoardingScreen = ({ navigation }) => {

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const onViewRef = useRef(({ viewableItems }) => {
    setIndex(viewableItems[0].index);

  });

  return (
    <View style={styles.container}>

      {/* SLIDES */}
      <FlatList

        data={slides}

        horizontal

        pagingEnabled

        showsHorizontalScrollIndicator={false}

        ref={flatListRef}

        keyExtractor={(item) => item.id}

        onViewableItemsChanged={onViewRef.current}

        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}

        renderItem={({ item }) => (
          <View style={styles.slideContainer}>

            {/* IMAGE SECTION */}
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />


            </View>

            {/* CONTENT */}
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              <Text style={styles.description}>
                {item.description}
              </Text>
            </View>
          </View>
        )}

      />

      <View style={styles.bottomWrapper}>
        {index === 0 ? (
          <>
            <View style={styles.pagination}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    index === i && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() =>
                flatListRef.current.scrollToIndex({
                  index: 1,
                  animated: true,
                })
              }
            >
              <Ionicons
                name="arrow-forward"
                size={28}
                color="#1F3365"
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() =>
              navigation.navigate('LoginEntryScreen')
            }
          >
            <Text style={styles.getStartedText}>
              Get Started
            </Text>

            <Ionicons
              name="arrow-forward"
              size={22}
              color="#1F3365"
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>

  );

};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F3365',
  },

  slideContainer: {
    width: wp('100%'),
    flex: 1,
    backgroundColor: '#1F3365',
  },

  imageContainer: {
    height: hp('66%'),
    overflow: 'hidden',
    borderBottomRightRadius: wp('50%'),
  },

  image: {
    width: '100%',
    height: '100%',
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('9%'),
    paddingTop: hp('1%'),
  },

  title: {
    color: '#FFFFFF',
    fontSize: hp('3.5%'),
    fontWeight: '400',
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: hp('4%'),
    fontWeight: '700',
    marginTop: hp('0.4%'),
  },

  description: {
    color: '#D8D8D8',
    fontSize: hp('1.8%'),
    marginTop: hp('2%'),
    lineHeight: hp('2.8%'),
  },

  bottomWrapper: {
    position: 'absolute',
    bottom: hp('7%'),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pagination: {
    position: 'absolute',
    left: wp('42%'),
    flexDirection: 'row',
  },

  nextButton: {
    position: 'absolute',
    right: wp('10%'),
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#AFAFAF',
    marginRight: 8,
  },

  activeDot: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },

  getStartedButton: {
    width: wp('75%'),
    height: hp('6.5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  getStartedText: {
    color: '#1F3365',
    fontSize: 18,
    fontWeight: '600',
  },

  buttonArrow: {
    color: '#1F3365',
    fontSize: 22,
    marginLeft: 15,
    fontWeight: '700',
  },
});