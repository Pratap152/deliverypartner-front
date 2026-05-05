import React from 'react';
import {View, Text, TextInput, TouchableOpacity,KeyboardAvoidingView, ScrollView, Keyboard,StyleSheet,} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RadioButton from '../../components/common/RadioButton';
import PrimaryButton from '../../components/common/PrimaryButton';
import useEmployeeDetails from '../../hooks/useEmployeeDetails';


export default function EmployeeDetailsScreen({navigation}) {
  const {
    formData, 
    errors, 
    submitting,
    dobPickerVisible, 
    setDobPickerVisible,
    handleChange, 
    handleDobConfirm, 
    handleSubmit,
    } = useEmployeeDetails(navigation);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <View style={{ marginTop: hp('5%'), alignItems: 'center' }}>
          <Text style={{ fontSize: wp('5%'), fontWeight: '700' }}>Employee Details</Text>
        </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('6%') }} 
                    keyboardShouldPersistTaps="handled">
        <View style={{ marginTop: hp('3%'), marginLeft: wp('5%') }}>
          <Text style={styles.field_name}>Company Name</Text>
          <TextInput value={formData.companyName} 
                    onChangeText={t => handleChange('companyName', t)} 
                    style={styles.input}
                    placeholder='Enter Company Name'
                    placeholderTextColor='darkgrey' />
          {errors.companyName && <Text style={styles.err}>{errors.companyName}</Text>}

          <Text style={styles.field_name}>Employee ID</Text>
          <TextInput value={formData.empId} 
                    onChangeText={t => handleChange('empId', t)} 
                    style={styles.input} 
                    placeholder='Enter Employee ID'
                    placeholderTextColor='darkgrey'/>
          {errors.empId && <Text style={styles.err}>{errors.empId}</Text>}

          <Text style={styles.field_name}>Full Name</Text>
          <TextInput value={formData.fullName} 
                    onChangeText={t => handleChange('fullName', t)} 
                    style={styles.input}
                    placeholder='Enter Full Name' 
                    placeholderTextColor='darkgrey'/>
          {errors.fullName && <Text style={styles.err}>{errors.fullName}</Text>}

          <Text style={styles.field_name}>Date of Birth</Text>
          <TouchableOpacity 
                    onPress={() => { Keyboard.dismiss(); setDobPickerVisible(true); }} 
                    style={styles.input}>
            <Text>{formData.dob || 'DD-MM-YYYY'}</Text>
            <Ionicons name='calendar-outline' size={17}/>
          </TouchableOpacity>
          <DateTimePickerModal 
                        isVisible={dobPickerVisible} 
                        mode="date" 
                        maximumDate={new Date()} 
                        onConfirm={handleDobConfirm} 
                        onCancel={() => setDobPickerVisible(false)} />
          {errors.dob && <Text style={styles.err}>{errors.dob}</Text>}

          <Text style={styles.field_name}>Secondary Phone Number</Text>
          <TextInput 
                    keyboardType="number-pad" 
                    value={formData.secondaryPhone} 
                    onChangeText={t => handleChange('secondaryPhone', t)} style={styles.input}
                    placeholder='Enter Secondary Phone No.' 
                    placeholderTextColor='darkgrey'
                    maxLength={10}/>
          {errors.secondaryPhone && <Text style={styles.err}>{errors.secondaryPhone}</Text>}

          <Text style={styles.field_name}>Email Address</Text>
          <TextInput value={formData.email} 
                    onChangeText={t => handleChange('email', t.toLowerCase())} 
                    style={styles.input} 
                    placeholder='Enter Email Address'
                    placeholderTextColor='darkgrey'/>
          {errors.email && <Text style={styles.err}>{errors.email}</Text>}

          <Text style={styles.field_name}>Referral Code (Optional)</Text>
          <TextInput value={formData.referralCode} 
                    onChangeText={t => handleChange('referralCode',t)} 
                    style={styles.input} 
                    placeholder='Enter Referral Code'
                    placeholderTextColor='darkgrey'/>

           <Text style={styles.field_name}>Gender</Text>
            <View style={{ flexDirection: 'row', gap: wp('12%'), marginBottom: hp('5') }}>
              <RadioButton value="male"   label="Male"   selectedValue={formData.gender} onSelect={v => handleChange('gender', v)} />
              <RadioButton value="female" label="Female" selectedValue={formData.gender} onSelect={v => handleChange('gender', v)} />
            </View>
            {errors.gender && <Text style={styles.err}>{errors.gender}</Text>}

      
        </View>
        <PrimaryButton title="Next" 
                        onPress={handleSubmit} 
                        loading={submitting}/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create ({
  input:  {
    borderWidth: 1, 
    borderColor: 'grey', 
    borderRadius: wp('2.5%'), 
    padding: hp('1.2%'), 
    marginBottom: hp('2'), 
    width: wp('90%'),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    color:'black'
    },
 field_name:{
    fontSize:wp(4),
    fontWeight:'400',
    marginBottom:hp(0.2)
    },
  err: { 
    color: 'red', 
    marginBottom: hp('2') 
    },
  btn:{
    marginRight:wp(1)
  }
});