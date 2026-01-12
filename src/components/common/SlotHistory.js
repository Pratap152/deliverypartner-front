import { useNavigation } from '@react-navigation/native';
import {View,Text,Image, TouchableOpacity,StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function SlotHistory(){
  const navigation = useNavigation();
        return(
           
               <TouchableOpacity
                       onPress={()=>navigation.navigate('SlotHistoryScreen')}
                       style={styles.slots_history} >
                  <View style={{ borderRadius:wp(2),backgroundColor:'#F1F5F9',height:hp(5),width:wp(12),alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../assets/slot.png')}
                          style={styles.slot_img}/>
                  </View>
                  
                  <Text style={{fontSize:wp(4),marginRight:wp(15)}}> View Slots History </Text>
                  <Ionicons name='chevron-forward-outline' size={20} color='#4C4CFF'/>
               </TouchableOpacity>
            
                            
    
            
        );
    }
    

const styles = StyleSheet.create({
    slots_history:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-evenly',
            alignSelf:'center',
            backgroundColor:'#FFFFFF',
            width:wp(90),
            height:hp(10),
            borderRadius:wp(3),
            marginTop:hp(3),
            borderWidth:1,
            borderColor:'#E2E8F0',
      
    },
    slot_img:{
      height:hp(3),
      width:wp(6),
     
    }


        
    });



