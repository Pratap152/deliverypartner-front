import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;
export default function SlotHistory() {
  const navigation = useNavigation();
  return (

    <TouchableOpacity
      onPress={() => navigation.navigate('SlotHistoryScreen')}
      style={styles.slots_history} >
      <View style={styles.iconWrapper}>
        <Ionicons
          name="time-outline"
          size={isTablet ? 28 : 22}
          color="#4C4CFF"
        />
      </View>

      <Text style={styles.historyText}>
        View Slots History
      </Text>
      <Ionicons
        name='chevron-forward-outline'
        size={isTablet ? 28 : 20}
        color='#4C4CFF'
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slots_history: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',

    backgroundColor: '#FFFFFF',

    width: isTablet ? '96%' : wp(90),
    height: isTablet ? 110 : hp(10),

    borderRadius: isTablet ? 20 : wp(3),

    marginTop: hp(3),

    borderWidth: 1,
    borderColor: '#E2E8F0',

    paddingHorizontal: isTablet ? 22 : 16,
  },
  slot_img: {
    height: isTablet ? 34 : hp(3),
    width: isTablet ? 34 : wp(7),
  },
  iconWrapper: {
    borderRadius: isTablet ? 16 : wp(2),
    backgroundColor: '#F1F5F9',

    height: isTablet ? 64 : hp(5),
    width: isTablet ? 64 : wp(12),

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: isTablet ? 24 : 16,
  },
  historyText: {
    flex: 1,

    fontSize: isTablet ? 24 : wp(4),

    fontWeight: '600',

    color: 'grey',

    marginLeft: isTablet ? 4 : 0,
  },
});



