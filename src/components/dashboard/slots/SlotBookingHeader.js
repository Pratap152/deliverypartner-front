import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { TABS } from '../../../utils/constants/slotConstants';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SlotBookingHeader({
  activeTab,
  onTabChange,
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.header}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>
          My Slots
        </Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('HelpCenterList')}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === TABS.CURRENT && styles.activeTab,
            ]}
            onPress={() => onTabChange(TABS.CURRENT)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === TABS.CURRENT &&
                  styles.activeTabText,
              ]}
            >
              Current Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === TABS.NEXT && styles.activeTab,
            ]}
            onPress={() => onTabChange(TABS.NEXT)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === TABS.NEXT &&
                  styles.activeTabText,
              ]}
            >
              Next Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === TABS.UPCOMING &&
                styles.activeTab,
            ]}
            onPress={() => onTabChange(TABS.UPCOMING)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === TABS.UPCOMING &&
                  styles.activeTabText,
              ]}
            >
              Upcoming Week
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4C4CFF',
    paddingBottom: isTablet ? hp(3) : hp(2),
    paddingHorizontal: isTablet ? 28 : 16,
    borderBottomLeftRadius: isTablet ? 34 : 24,
    borderBottomRightRadius: isTablet ? 34 : 24,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: isTablet ? 38 : 24,
    fontWeight: '700',
    color: '#FFF',
  },

  iconBtn: {
    padding: 4,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: isTablet ? 20 : 12,
    padding: isTablet ? 8 : 6,
    alignSelf: isTablet ? 'center' : 'stretch',
    width: isTablet ? '87%' : '96.5%',
  },

  scrollContent: {
    flexGrow: 1,
  },

  tab: {
    paddingVertical: isTablet ? 18 : 10,
    paddingHorizontal: isTablet ? 36 : 16,
    borderRadius: isTablet ? 18 : 10,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#FFF',
  },

  tabText: {
    color: '#E0E0E0',
    fontWeight: '600',
    fontSize: isTablet ? 22 : 14,
  },

  activeTabText: {
    color: '#4C4CFF',
    fontWeight: '700',
  },
});