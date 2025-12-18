import { Text, View, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function FaceInstructionScreen({ navigation }) {

  return (
    <View style={{ flex: 1 }}>
      {/* BACK BUTTON + HEADING */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: wp('28%'),
          marginTop: hp('5%'),
          marginLeft: wp('4%'),
          position: 'relative'
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>

        <Text style={{ fontSize: wp('5%'), fontWeight: '700' }}>
          Take a Selfie
        </Text>
      </View>

      {/* INSTRUCTIONS */}
      <View
        style={{
          marginLeft: wp('8%'),
          marginTop: hp('5%'),
        }}
      >
        <Text
          style={{
            fontWeight: '500',
            fontSize: wp('5%'),
            marginLeft: wp('5%'),
          }}
        >
          Do This
        </Text>

        {/* GUIDELINES */}
        <View
          style={{
            marginLeft: wp('5%'),
            marginTop: hp('2%'),
          }}
        >
          <View style={{ flexDirection: 'row', marginBottom: hp('0.8%') }}>
            <Ionicons name="caret-forward-outline" size={18} color="black" />
            <Text style={{fontSize:wp('4%')}}> Show full face clearly</Text>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: hp('0.8%') }}>
            <Ionicons name="caret-forward-outline" size={18} color="black" />
            <Text style={{fontSize:wp('4%')}}> Use good lighting</Text>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: hp('0.8%') }}>
            <Ionicons name="caret-forward-outline" size={18} color="black" />
            <Text style={{fontSize:wp('4%')}}> Hold camera at eye level</Text>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: hp('0.8%') }}>
            <Ionicons name="caret-forward-outline" size={18} color="black" />
            <Text style={{fontSize:wp('4%')}}> Look straight</Text>
          </View>
        </View>
      </View>

      {/* IMAGE */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: hp('6%'),
        }}
      >
        <Image
          source={require('../../../src/assets/selfie.png')}
          style={{
            height: hp('30%'),
            width: wp('60%'),
            marginTop: hp('2.5%'),
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* SELFIE BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('FaceVerificationScreen')}
        style={{
          marginBottom: hp('15%'),
          alignSelf: 'center',
          backgroundColor: '#0CBACE',
          paddingVertical: hp('1.4%'),
          borderRadius: wp('6%'),
          width: wp('60%'),
        }}
      >
        <Text
          style={{
            alignSelf: 'center',
            fontSize: wp('5%'),
            color: 'white',
            fontWeight: '600',
          }}
        >
          Click a Selfie
        </Text>
      </TouchableOpacity>
    </View>

  );
}