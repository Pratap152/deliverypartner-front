import Icon from 'react-native-vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from "react-native";
const PermissionItem = ({ icon, title, desc, onPress, isTick, isEnabled }) => {

  const key = title === "Location" ? "location" : title === "Background Location" ? "backgroundLocation" : title === "Camera" ? "camera" : "notification";

  return (
    <Pressable
      disabled={!isEnabled}
      style={({ pressed }) => [
        styles.permissionItem,
        !isEnabled && {
          opacity: 0.7,
          height: '22%',
          width: '98%',
        },
        pressed && isEnabled && {
          opacity: 0.9,
        },
      ]}
      onPress={() => onPress(key)}
      android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
    >
      <Icon
        name={icon}
        size={28}
        color="#FFFFFF"
      />
      <View style={styles.permissionTextBox}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDesc}>{desc}</Text>
      </View>
      {isTick && (
        <Icon
          name="checkmark-circle"
          size={26}
          color="#FFFFFF"
        />
      )}
    </Pressable>
  )
};
export default PermissionItem;

const styles = StyleSheet.create({
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '102%',
    padding: 14,
    backgroundColor: '#1F3365',
    borderRadius: 8,
    height: '24%',
  },

  permissionTextBox: {
    marginLeft: 14,
    flex: 1,
  },

  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  permissionDesc: {
    fontSize: 13,
    color: '#D7E3FF',
    marginTop: 4,
    lineHeight: 18,
  },
});