import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import faceVerificationScreen from './faceVerificationScreen'

const faceInstructionScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>faceInstructionScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(faceVerificationScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default faceInstructionScreen