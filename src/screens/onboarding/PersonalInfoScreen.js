import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import FaceInstructionScreen from './FaceInstructionScreen'

const PersonalInfoScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>PersonalInfoScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(FaceInstructionScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default PersonalInfoScreen