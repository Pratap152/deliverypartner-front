import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import AppPermissionScreen from './AppPermissionScreen'

const LoginVerifyScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>LoginVerifyScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(AppPermissionScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default LoginVerifyScreen