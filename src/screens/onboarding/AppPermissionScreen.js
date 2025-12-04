import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import LocationSelectionScreen from './LocationSelectionScreen'

const AppPermissionScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>AppPermissionScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(LocationSelectionScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        
        </View></View>
  )
}

export default AppPermissionScreen