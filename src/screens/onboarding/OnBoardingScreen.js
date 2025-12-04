import { View, Text ,StatusBar, TouchableOpacity} from 'react-native'
import React from 'react'
import LoginEntryScreen from './LoginEntryScreen'


const OnBoardingScreen = ({navigation}) => {
  return (
    
    <View style={{flex:1,backgroundColor:"black"}}>
      <StatusBar barStyle={'light-content'}/>
      <View style={{margin:70}}>
      <Text style={{color:'white'}}>OnBoardingScreen1</Text>
      <TouchableOpacity onPress={()=>navigation.navigate(LoginEntryScreen)}>
        <Text style={{color:"white"}}>Next</Text>
      </TouchableOpacity>
    
    </View></View>
  )
}

export default OnBoardingScreen