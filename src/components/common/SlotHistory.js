import {View,Text,Image, TouchableOpacity,StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';



export default function SlotHistory(){
        return(
           
               <TouchableOpacity
                       onPress={()=>navigation.navigate('SlotHistoryScreen')}
                       style={styles.slots_history} >
                  <View style={{ borderRadius:wp(2),backgroundColor:'#F1F5F9',height:hp(5),width:wp(12),alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../assets/slot.png')}
                          style={styles.slot_img}/>
                  </View>
                  
                  <Text style={{fontSize:wp(4),marginRight:wp(15)}}> View Slots History </Text>
                  <Ionicons name='chevron-forward-outline' size={20} color='#90A1B9'/>
               </TouchableOpacity>
            
                            
    
            
        );
    }
    

const styles = StyleSheet.create({
    slots_history:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-around',
            alignSelf:'center',
            backgroundColor:'#FFFFFF',
            marginLeft:wp(5),
            width:wp(80),
            height:hp(8),
            borderRadius:wp(3),
            marginTop:hp(30)
      
    },
    slot_img:{
      height:hp(3),
      width:wp(7),
     
    }


        
    });







