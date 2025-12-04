import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import DocumentVerifyScreen from './DocumentVerifyScreen'

const AadharVerifyScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>aadharV</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(DocumentVerifyScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default AadharVerifyScreen