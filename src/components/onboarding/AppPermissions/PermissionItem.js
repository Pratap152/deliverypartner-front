import Icon from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from "react-native";
 const  PermissionItem = ({ icon, title, desc,onPress,isTick,isEnabled}) =>{
  
  const key=title==="Location"?"location":title==="Background Location"?"backgroundLocation":title==="Camera"?"camera":"notification";

   return(
  <Pressable disabled={!isEnabled} style={({pressed})=>[styles.permissionItem,(!isEnabled)&&{opacity:0.5,height:"22%",width:"98%"}]} onPress={()=>onPress(key)} android_ripple={{color:"#0e0c0c"}}>
    <Icon name={icon} size={28} color="#000000" />
    <View style={styles.permissionTextBox}>
      <Text style={styles.permissionTitle}>{title}</Text>
      <Text style={styles.permissionDesc}>{desc}</Text>
    </View>
    {isTick && (   
    <Icon
      name="checkmark-circle"
      size={26}
      color="#24cc15ff"
    />
  )}
  </Pressable>
)};
const styles=StyleSheet.create({
    permissionItem: {
    flexDirection: 'row',
    marginTop: 20,
    width: '102%',
    padding:12,
    backgroundColor:"#0CBACE",
    borderRadius:5,
    height:"24%",
    
  },
  permissionTextBox: {
    marginLeft: 12,
    flex: 1
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  permissionDesc: {
    color: '#000000',
    marginTop: 4
  },
})
export default PermissionItem;