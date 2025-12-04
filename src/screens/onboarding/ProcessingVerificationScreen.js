import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import OnBoardingScreen1 from './OnBoardingScreen1'

const ProcessingVerificationScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>ProcessingVerificationScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(OnBoardingScreen1)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default ProcessingVerificationScreen