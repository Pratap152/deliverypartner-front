import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import PersonalInfoScreen from './PersonalInfoScreen'

const VehicleSelectionScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>VehicleSelectionScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(PersonalInfoScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default VehicleSelectionScreen