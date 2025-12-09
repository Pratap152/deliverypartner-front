import { Text, View, TouchableOpacity, Image } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FaceInstructionScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      {/* BACK BUTTON */}
      <View
        style={{
          flexDirection: 'row',
          gap: 110,
          marginTop: 55,
          marginLeft: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>
        {/* HEADING */}
        <Text style={{ fontSize: 20, fontWeight: 700 }}>Take a Selfie</Text>
      </View>
      <View style={{ marginLeft: 30, marginTop: 40 }}>
        <Text style={{ fontWeight: 500, fontSize: 20, marginLeft: 20 }}>
          Do This
        </Text>

        {/* GUIDELINES */}
        <View style={{ fontSize: 18, marginLeft: 20, marginTop: 15 }}>
          <Ionicons
            name="caret-forward-outline"
            size={18}
            color="black"
            style={{ marginBottom: 5 }}
          >
            <Text>Show full face clearly</Text>
          </Ionicons>
          <Ionicons
            name="caret-forward-outline"
            size={18}
            color="black"
            style={{ marginBottom: 5 }}
          >
            <Text>Use good lighting </Text>
          </Ionicons>
          <Ionicons
            name="caret-forward-outline"
            size={18}
            color="black"
            style={{ marginBottom: 5 }}
          >
            <Text>Hold camera at eye level</Text>
          </Ionicons>
          <Ionicons
            name="caret-forward-outline"
            size={18}
            color="black"
            style={{ marginBottom: 5 }}
          >
            <Text>Look straight</Text>
          </Ionicons>
        </View>
      </View>

      {/* IMAGE */}
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}
      >
        <Image
          source={require('../../../src/assets/selfie.png')}
          style={{ height: '60%', width: '60%', marginTop: 20 }}
        />
      </View>

      {/* CLICK A SELFIE BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('FaceVerificationScreen')}
        style={{
          marginBottom: 150,
          alignSelf: 'center',
          backgroundColor: '#0CBACE',
          paddingVertical: 10,
          borderRadius: 25,
          width: '60%',
        }}
      >
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 20,
            color: 'white',
            fontWeight: 600,
          }}
        >
          Click a Selfie
        </Text>
      </TouchableOpacity>
    </View>
  );
}
