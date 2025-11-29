import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import AadharVerifyScreen from './AadharVerifyScreen'

const AadharEntryScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>aadharE</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(AadharVerifyScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default AadharEntryScreen