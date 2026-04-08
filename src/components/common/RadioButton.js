import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function RadioButton({ value, label, selectedValue, onSelect }) {
  const selected = selectedValue === value;
  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: hp('0.8%') }}
    >
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? 'black' : 'grey'}
      />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}