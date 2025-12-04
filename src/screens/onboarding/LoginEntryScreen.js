import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import LoginVerifyScreen from './LoginVerifyScreen'

const LoginEntryScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>LoginEntryScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(LoginVerifyScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default LoginEntryScreen