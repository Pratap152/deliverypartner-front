// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from 'react-native';


// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';


// import { COLORS } from '../../utils/colors';
// import apiClient from '../../services/ApiClient';


// import Svg, { Path } from 'react-native-svg';


// const RiderTypeScreen = ({ navigation }) => {
//   const [selectedType, setSelectedType] = useState(null);
//   const [loading, setLoading] = useState(false);


//   const riderTypes = [
//     {
//       id: 'INDIVIDUAL_EMPLOYEE',
//       label: 'Individual',
//       description:
//         'Work independently, manage your own schedule, and earn directly per delivery.',
//     },
//     {
//       id: 'COMPANY_EMPLOYEE',
//       label: 'Company Employee',
//       description:
//         'Join as part of a registered delivery company with fixed benefits and structured shifts.',
//     },
//   ];


//   const handleContinue = async () => {
//     if (!selectedType) return;


//     try {
//       setLoading(true);
//       await apiClient.post('/api/company/rider/type', {
//         riderType: selectedType,
//       });


//       if (selectedType === 'INDIVIDUAL_EMPLOYEE') {
//         navigation.navigate('SelectCityScreen');
//       } else if (selectedType === 'COMPANY_EMPLOYEE') {
//         navigation.navigate('EmployeeDetailsScreen');
//       }


//     } catch (err) {
//       console.log(err?.response?.data || err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const renderOption = item => {
//     const isSelected = selectedType === item.id;


//     return (
//       <TouchableOpacity
//         key={item.id}
//         style={[
//           styles.card,
//           isSelected && styles.cardSelected,
//         ]}
//         onPress={() => setSelectedType(item.id)}
//         activeOpacity={0.8}
//       >
//         <View style={{ flex: 1 }}>
//           <Text style={styles.cardTitle}>{item.label}</Text>
//           <Text style={styles.cardDescription}>
//             {item.description}
//           </Text>
//         </View>


//         <View
//           style={[
//             styles.radioOuter,
//             isSelected && { borderColor: COLORS.primary },
//           ]}
//         >
//           {isSelected && <View style={styles.radioInner} />}
//         </View>
//       </TouchableOpacity>
//     );
//   };


//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../../assets/RiderType.png')}
//         style={styles.image}
//         resizeMode="contain"
//       />


//       <View style={styles.waveContainer}>


//         <Svg
//           height={rh(90)}
//           width="100%"
//           viewBox="0 50 130 240"
//         >
//           <Path
//             fill="#e0f9f8"
//             d="M0,150C200,80,900,220,720,170C1040,140,1240,200,1440,180V320H0Z"
//           />
//         </Svg>


//       </View>
//       <View style={styles.bottomContent}>
//         <Text style={styles.title}>Select your rider type</Text>


//         <View style={styles.optionsWrapper}>
//           {riderTypes.map(renderOption)}
//         </View>
//       </View>


//       {/* BUTTON */}
//       <TouchableOpacity
//         style={[
//           styles.button,
//           { opacity: selectedType ? 1 : 0.5 },
//         ]}
//         disabled={!selectedType || loading}
//         onPress={handleContinue}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? 'Please wait...' : 'Continue'}
//         </Text>
//       </TouchableOpacity>


//     </View>
//   );
// };


// export default RiderTypeScreen;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },


//   image: {
//     width: rw(95),
//     height: rh(40),
//     alignSelf: 'center',
//     marginTop: rh(6),
//   },


//   waveContainer: {
//     position: 'absolute',
//     top: rh(13),
//     width: '100%',
//   },


//   bottomContent: {
//     marginTop: rh(2),
//     paddingHorizontal: rw(5),
//   },


//   title: {
//     fontSize: rf(2.5),
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     marginVertical: rh(3),
//   },


//   optionsWrapper: {
//     marginTop: rh(1),
//   },


//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: rw(4),
//     borderRadius: rw(4),
//     backgroundColor: COLORS.white,
//     marginBottom: rh(2),
//   },


//   cardSelected: {
//     backgroundColor: '#DFF5F8',
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },


//   cardTitle: {
//     fontSize: rf(2.1),
//     fontWeight: '600',
//     color: COLORS.textPrimary,
//   },


//   cardDescription: {
//     fontSize: rf(1.8),
//     color: COLORS.textSecondary,
//     marginTop: rh(0.5),
//   },


//   radioOuter: {
//     width: rw(5),
//     height: rw(5),
//     borderRadius: rw(5),
//     borderWidth: 2,
//     borderColor: COLORS.border,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },


//   radioInner: {
//     width: rw(2.5),
//     height: rw(2.5),
//     borderRadius: rw(2.5),
//     backgroundColor: COLORS.primary,
//   },


//   button: {
//     position: 'absolute',
//     bottom: rh(5),
//     left: rw(5),
//     right: rw(5),
//     backgroundColor: COLORS.primary,
//     paddingVertical: rh(2),
//     borderRadius: rw(8),
//     alignItems: 'center',
//   },


//   buttonText: {
//     color: COLORS.white,
//     fontSize: rf(2.2),
//     fontWeight: '600',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf } from 'react-native-responsive-dimensions';
import { COLORS } from '../../utils/colors';
import apiClient from '../../services/ApiClient';

const RiderTypeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  const riderTypes = [
    {
      id: 'INDIVIDUAL_EMPLOYEE',
      label: 'Individual',
      description:
        'Work independently, manage your own schedule, and earn directly per delivery.',
    },
    {
      id: 'COMPANY_EMPLOYEE',
      label: 'Company Employee',
      description:
        'Join as part of a registered delivery company with fixed benefits and structured shifts.',
    },
  ];

  const handleContinue = async () => {
    if (!selectedType) return;
    try {
      setLoading(true);
      await apiClient.post('/api/company/rider/type', {
        riderType: selectedType,
      });

      if (selectedType === 'INDIVIDUAL_EMPLOYEE') {
        navigation.navigate('SelectCityScreen');
      } else {
        navigation.navigate('EmployeeDetailsScreen');
      }
    } catch (err) {
      console.log(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const renderOption = item => {
    const isSelected = selectedType === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
            styles.card,
            isTablet && styles.cardTablet,
            isSelected && styles.cardSelected,
          ]}
        onPress={() => setSelectedType(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardTextWrap}>
          <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
            {item.label}
          </Text>
          <Text
            style={[
              styles.cardDescription,
              isTablet && styles.cardDescriptionTablet,
            ]}
          >
            {item.description}
          </Text>
        </View>

        <View
          style={[
            styles.radioOuter,
            isTablet && styles.radioOuterTablet,
            isSelected && { borderColor: COLORS.primary },
          ]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
  <View style={styles.container}>
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        isTablet && styles.scrollContentTablet,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.content, isTablet && styles.contentTablet]}>
        <Image
          source={require('../../assets/RiderType.png')}
          style={[styles.image, isTablet && styles.imageTablet]}
          resizeMode="contain"
        />

        <View
          style={[
            styles.waveContainer,
            isTablet && styles.waveContainerTablet,
          ]}
        >
          {isTablet ? (
            <Svg
              width="100%"
              height={rh(115)}
              viewBox="0 100 220 150"
            >
              <Path
                fill="#E0F9F8"
                d="M0,150C200,80,900,220,720,170C1040,140,1240,200,1440,180V320H0Z"
              />
            </Svg>
          ) : (
            <Svg
              width="100%"
              height={rh(90)}
              viewBox="0 50 130 240"
            >
              <Path
                fill="#E0F9F8"
                d="M0,150C200,80,900,220,720,170C1040,140,1240,200,1440,180V320H0Z"
              />
            </Svg>
          )}
        </View>

        <View
          style={[
            styles.bottomContent,
            isTablet && styles.bottomContentTablet,
          ]}
        >
          <Text
            style={[
              styles.title,
              isTablet && styles.titleTablet,
            ]}
          >
            Select your rider type
          </Text>

          <View
            style={[
              styles.optionsWrapper,
              isTablet && styles.optionsWrapperTablet,
            ]}
          >
            {riderTypes.map(renderOption)}
          </View>

          {isTablet ? (
            <TouchableOpacity
              style={[
                styles.buttonTablet,
                { opacity: selectedType ? 1 : 0.5 },
              ]}
              disabled={!selectedType || loading}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                { opacity: selectedType ? 1 : 0.5 },
              ]}
              disabled={!selectedType || loading}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  </View>
);
};

export default RiderTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
scrollContent: {
  flexGrow: 1,
},

scrollContentTablet: {
  paddingBottom:10,
},
  content: {
    flex: 1,
  },

  contentTablet: {
  flex: 1,
},

  image: {
    width: rw(95),
    height: rh(40),
    alignSelf: 'center',
    marginTop: rh(6),
  },

 imageTablet: {
  width: 420,
  height: 290,
  marginTop: 20,
  alignSelf: 'center',
},

 waveContainer: {
  position: 'absolute',
  top: rh(13),
  width: '100%',
},

waveContainerTablet: {
  top: 120,
  height: rh(100),
},
  bottomContent: {
    marginTop: rh(2),
    paddingHorizontal: rw(5),
  },

  bottomContentTablet: {
  marginTop: 20,
  paddingHorizontal: 80,
},
  title: {
    fontSize: rf(2.5),
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginVertical: rh(3),
  },

  titleTablet: {
  fontSize: 34,
  marginBottom: 28,
},
optionsWrapper: {
  marginTop: rh(1),
  paddingBottom: rh(10),
},
optionsWrapperTablet: {
  paddingBottom:20,
},
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: rh(2),
    paddingHorizontal: rw(4),
    borderRadius: rw(4),
    backgroundColor: COLORS.white,
    marginBottom: rh(2),
  },

  cardTablet: {
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 28,
},
  cardSelected: {
    backgroundColor: '#DFF5F8',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
cardTextWrap: {
  flex: 1,
  marginRight: 20,
},

  cardTitle: {
    fontSize: rf(2.1),
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: rf(2.8),
  },

  cardTitleTablet: {
    fontSize: rf(2.2),
    lineHeight: rf(2.9),
  },

  cardDescription: {
    fontSize: rf(1.8),
    color: COLORS.textSecondary,
    marginTop: rh(0.5),
    lineHeight: rf(2.4),
  },
cardDescriptionTablet: {
  fontSize: 20,
  lineHeight: 28,
},

  radioOuter: {
    width: rw(5),
    height: rw(5),
    borderRadius: rw(5),
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(0.5),
  },

  radioOuterTablet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
},

radioInner: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: COLORS.primary,
},

  button: {
    position: 'absolute',
    bottom: rh(0),
    left: rw(5),
    right: rw(5),
    backgroundColor: COLORS.primary,
    paddingVertical: rh(2),
    borderRadius: rw(8),
    alignItems: 'center',
},
buttonTablet: {
  backgroundColor: COLORS.primary,
  paddingVertical: 20,
  borderRadius: rw(8),
  alignItems: 'center',
  marginBottom: 40,
},

  buttonText: {
    color: COLORS.white,
    fontSize: rf(2.2),
    fontWeight: '600',
  },
});