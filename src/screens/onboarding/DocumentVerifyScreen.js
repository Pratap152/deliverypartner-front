import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import AadharEntryScreen from './AadharEntryScreen'
import ProcessingVerificationScreen from './ProcessingVerificationScreen'
import PanUploadScreen from './PanUploadScreen'
import LicenseUploadScreen from './LicenseUploadScreen'

const DocumentVerifyScreen = ({navigation}) => {
  return (
    <View style={{flex:1,backgroundColor:"black"}}>
          
          <View style={{margin:70}}>
          <Text style={{color:'white'}}>DocumentVerifyScreen</Text>
          <TouchableOpacity onPress={()=>navigation.navigate(AadharEntryScreen)}>
            <Text style={{color:"white"}}>A</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate(PanUploadScreen)}>
            <Text style={{color:"white"}}>P</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate(LicenseUploadScreen)}>
            <Text style={{color:"white"}}>L</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate(ProcessingVerificationScreen)}>
            <Text style={{color:"white"}}>Next</Text>
          </TouchableOpacity>
        </View></View>
  )
}

export default DocumentVerifyScreen