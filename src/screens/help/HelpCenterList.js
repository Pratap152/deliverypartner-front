import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const DEFAULT_ITEMS = [
  { id: 'order', title: 'Order earning issue', icon: 'cash-outline', bg: '#E8F4FF', iconColor: '#2F8CFF' },
  { id: 'daily', title: 'Daily incentive Issue', icon: 'star-outline', bg: '#F4E8FF', iconColor: '#A24BFF' },
  { id: 'incentives', title: 'Incentives and payout issue', icon: 'gift-outline', bg: '#FFF4E6', iconColor: '#FF8C42' },
  { id: 'payout', title: 'Incorrect payout to bank', icon: 'card-outline', bg: '#F2F8FF', iconColor: '#3B82F6' },
  { id: 'floating', title: 'Floating cash issue', icon: 'cash-outline', bg: '#E8FFF7', iconColor: '#00B388' },
  { id: 'duty', title: 'Duty related issues', icon: 'document-text-outline', bg: '#EAF6FF', iconColor: '#2E9BE6' },
  { id: 'insurance', title: 'Know about insurance benefits', icon: 'shield-checkmark-outline', bg: '#E8FAF7', iconColor: '#09B59B' },
  { id: 'update', title: 'Update personal details', icon: 'person-circle-outline', bg: '#F2F7FF', iconColor: '#6C8BFF' },
  { id: 'uniform', title: 'Request new uniform /bag/rain coat', icon: 'shirt-outline', bg: '#FFF8F3', iconColor: '#FF6B6B' },
  { id: 'rain', title: 'Activate rain mode', icon: 'rainy-outline', bg: '#F2F8FF', iconColor: '#4B9FFF' }
]
const HelpCenterList = ({ navigation, items = DEFAULT_ITEMS, headerTitle = 'Delivery Partner Help Center' }) => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.row}
        onPress={() => navigation.navigate('HelpIssueScreen', {
          issueId: item.id,
          title: item.title,
        })
        }
        accessibilityRole="button"
      >
        <View style={styles.left}>
          <View style={[styles.iconWrapper, { backgroundColor: item.bg || '#f0f0f0' }]}>
            <Ionicons name={item.icon || 'help-circle-outline'} size={20} color={item.iconColor || '#333'} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{item.title}</Text>
            {/* small badge text if present */}
            {item.badge ? <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View> : null}
          </View>
        </View>

        <View style={styles.right}>
          {item.badgeDot ? <View style={styles.badgeDot} /> : null}
          <Ionicons name="chevron-forward" size={22} color="#B6C2D9" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>

        {/* Decorative illustration area to match screenshot */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../assets/help_center.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.sectionTitle}>Raise a new issue</Text>

        <View style={styles.card}>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            scrollEnabled={false} // let outer ScrollView handle scrolling
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(HelpCenterList);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    color: '#111827', // dark text
  },
  illustrationWrap: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 8,
  },
  illustrationImage: {
    width: width * 0.8,
    height: 160,
  },

  sectionTitle: {
    marginTop: 30,
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    // subtle shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // elevation for Android
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  textWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    flexShrink: 1,
  },

  badge: {
    marginLeft: 8,
    backgroundColor: '#FEEFEF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '600',
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#FF5C5C',
    marginRight: 10,
  },

  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
});
