import {View,Text,Image, TouchableOpacity,StyleSheet, ScrollView,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import SlotHistory from '../../components/common/SlotHistory';


export default function SlotBookingScreen({navigation}){


    return(    
                 <TouchableOpacity
                       onPress={()=>navigation.navigate('SlotHistoryScreen')}>
                    <SlotHistory/>
                </TouchableOpacity>

    );
}



