import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import FaceVerificationScreen from './FaceVerificationScreen'

const FaceInstructionScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>FaceInstructionScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(FaceVerificationScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default FaceInstructionScreen