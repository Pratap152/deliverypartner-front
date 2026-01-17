import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function IncentiveCard({ item }) {
  const navigation = useNavigation();
  return (

        <View style={[styles.card,{backgroundColor:item.accentColor}]}>
          <TouchableOpacity onPress={()=>navigation.navigate('IncentiveDetails', { incentiveId: item.onPress })} >
            <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            <Text style={styles.value}>{item.value}</Text>
          </TouchableOpacity>
        </View>
    
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: wp(4),
    padding: wp(5),
    marginBottom: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:wp(90),
    alignSelf:'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    
  },
  title: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#111',
  },
  subtitle: {
    fontSize: wp(3.4),
    color: '#666',
    marginTop: wp(1),
  },
  value: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#111',
  },
});
