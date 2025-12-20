import { View, Text, Image, TextInput,ScrollView,KeyboardAvoidingView, TouchableWithoutFeedback,Keyboard } from 'react-native';
import React, {useState} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import PrimaryButton from '../../components/common/PrimaryButton';


export default function ReferralScreen(){
  
  const[name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [city, setCity] = useState('');

  const [errors, setErrors] = useState({});
  
  const validate = () => {
    let newErrors = {};

    if (!name.trim()) {
        newErrors.name='Name is required';
    } else if (name.length < 3) {
        newErrors.name= 'Name must contain atleast 3 characters';
    } else if (name.length > 50){
        newErrors.name = 'Name cannot exceed 50 characters';
        }

    if (!phone.trim()){
       newErrors.phone='Phone number is required';
    } else if (phone.length !== 10) {
        newErrors.phone = 'Phone number must be 10 digits';
    } else if (!/^[6-9]/.test(phone)) {
        newErrors.phone = "Mobile number should start with 6, 7, 8, or 9";
    }

    if (!city.trim()){
        newErrors.city='City is required';
    } else if (city.length < 3) {
        newErrors.city= 'City name must contain atleast 3 characters';
    } else if (city.length > 20){
        newErrors.city = 'City name cannot exceed 20 characters';
        }

    setErrors(newErrors);
    return (Object.keys(newErrors).length) == 0;
  }


  const handleSubmit =() => {
    if (validate()){
      console.log('refer success');
    }
  }

  const isFormValid =
            name.trim().length > 0 &&
            phone.length>0 &&
            city.trim().length > 0 &&
            !errors.name &&
            !errors.phone &&
            !errors.city;

  
  return(
    <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="height">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              contentContainerStyle={{
                      flexGrow:1,
                      paddingBottom: hp("6%"),
                        }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none">
      
        <View>
          <Image source = {require('../../assets/referal.png')}
                style = {{width:wp('100%'), height:hp('36%'),resizeMode:'stretch'}} />
          <Image source = {require('../../assets/referal_1.png')}
                style={{position:'absolute',height:hp('20%'),width:wp('38%'),right:wp('4%'),marginTop:hp('5%'),resizeMode:'cover'}}/>
        </View>
        <View>
          <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',paddingTop:hp('3%'),}}>
            <Image source={require('../../assets/line.png')}
                  style={{width:wp('25%')}} />
            <Text style={{fontWeight:'400',fontSize:wp('4%'),marginLeft:wp('5%'),marginRight:wp('5%')}}>Refer & Earn</Text>
            <Image source={require('../../assets/line.png')}
                   style={{width:wp('25%')}} />
          </View>
          
            <Text style={{fontSize:wp('4%'),fontWeight:400,paddingLeft:wp('8%'),paddingRight:wp('8%'),paddingTop:hp('3%')}} >
              Enter the details below so we can get to know about your Refer.
            </Text>
          <View style={{paddingLeft:wp('7%'),paddingRight:wp('7%'),paddingBottom:hp('4%')}}>
            <Text style={{marginTop:hp('2.5%'),marginBottom:hp('0.6%')}}>Friend's Name</Text>
            <TextInput 
                  placeholder='enter the name'
                  placeholderTextColor={"#888"}
                  value={name}
                  onChangeText = {(text) => {
                    if (/^[A-Za-z\s]*$/.test(text)){
                      setName(text);
                      setErrors(prev => ({...prev, name:''}))
                    }
                    else{
                      setErrors(prev => ({...prev, name:'only alphabets are allowed!'}))
                    }
                    
                  }}
                  style={{borderWidth:1,borderRadius:wp('3%'),borderColor:'grey',padding:hp('1.8%')}}/>
            {errors.name && <Text style={{color:'red'}}>{errors.name}</Text> }
          

            <Text style={{marginTop:hp('2%'),marginBottom:hp('0.6%')}}>Friend's Phone Number</Text>
            <TextInput 
                  placeholder='enter phone number'
                  placeholderTextColor={"#888"}
                  value={phone}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text)){
                      setPhone(text);
                      setErrors(prev => ({...prev, phone:''}))
                    }
                    else{
                      setErrors(prev => ({...prev, phone:'only numbers are allowed!'}))
                    }
                  }}
                  keyboardType='number-pad'
                  style={{borderWidth:1,borderRadius:wp('3%'),borderColor:'grey',padding:hp('1.8%')}}/>
            {errors.phone && <Text style={{color:'red'}}>{errors.phone}</Text>}
          

            <Text style={{marginTop:hp('2%'),marginBottom:hp('0.6%')}}>Friend's City Name</Text>
            <TextInput 
                  placeholder='enter city name'
                  placeholderTextColor={"#888"}
                  value={city}
                  onChangeText={(text) => {
                    if (/^[A-Za-z\s]*$/.test(text)){
                        setCity(text);
                        setErrors(prev => ({...prev, city:''}))
                    }
                    else{
                      setErrors(prev => ({...prev, city:'only alphabets are allowed!'}))
                    }
                  }}
                  style={{borderWidth:1,borderRadius:wp('3%'),borderColor:'grey',paddingVertical:hp('1.8%'),paddingHorizontal:wp('4%')}}/>
            {errors.city && <Text style={{color:'red',marginBottom:hp('2%')}}>{errors.city}</Text>}
          </View>

          <PrimaryButton
              title='Confirm'
              textColor='white'
              bgColor= '#378E57'
              disabled={!isFormValid}
              opacity={isFormValid? 1 : 0.5}
              onPress={handleSubmit} />

        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  
  );
}
