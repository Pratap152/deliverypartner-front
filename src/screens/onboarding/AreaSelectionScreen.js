import { View, Text } from 'react-native'
import React from 'react'
import PersonalInfoScreen from './PersonalInfoScreen'
import { TouchableOpacity } from 'react-native'

const AreaSelectionScreen = ({navigation}) => {
  return (
     <View style={{margin:70}}>
          <Text style={{color:'white'}}>city</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(PersonalInfoScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
    </View>
  )
}

export default AreaSelectionScreen