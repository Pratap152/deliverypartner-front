import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import DocumentVerifyScreen from './DocumentVerifyScreen'

const FaceVerificationScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
              
              <View style={{margin:70}}>
              <Text style={{color:'white'}}>FaceVerificationScreen</Text>
              <TouchableOpacity onPress={()=>navigation.navigate(DocumentVerifyScreen)}>
                <Text style={{color:"white"}}>Next</Text>
              </TouchableOpacity>
            
            </View></View>
  )
}

export default FaceVerificationScreen