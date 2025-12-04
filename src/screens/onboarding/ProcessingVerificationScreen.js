import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import OnBoardingScreen from './OnBoardingScreen'

const ProcessingVerificationScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>ProcessingVerificationScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(OnBoardingScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default ProcessingVerificationScreen