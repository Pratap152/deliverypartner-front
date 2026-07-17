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
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {TABS} from '../../../utils/constants/slotConstants';

const {width} = Dimensions.get('window');
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
        <Text style={styles.headerTitle}>My Slots</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('SlotHistoryScreen')}
          >
            <MaterialIcons
                      name="history"
                      size={isTablet ? 30 : 24}
                      color="#FFFFFF"
                          />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('HelpCenterList')}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={isTablet ? 28 : 22}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            style={{flexGrow: 0}}
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
              This Week
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
                activeTab === TABS.UPCOMING && styles.activeTab,
                { marginRight: 0 }, // last tab
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
    paddingHorizontal: isTablet ? 28 : 16,
    paddingBottom: isTablet ? hp(2.2) : hp(1.3),
    borderBottomLeftRadius: isTablet ? 34 : 24,
    borderBottomRightRadius: isTablet ? 34 : 24,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 18 : 12,
  },

  headerTitle: {
    fontSize: isTablet ? 38 : 24,
    fontWeight: '700',
    color: '#FFF',
  },

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

 tabContainer: {
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(255,255,255,0.18)',
  borderRadius: isTablet ? 20 : 12,
  padding: isTablet ? 8 : 6,
  overflow: 'hidden',
},
  scrollContent: {
  alignItems: 'center',
  paddingRight: 0,
},

tab: {
  paddingVertical: isTablet ? 18 : 10,
  paddingHorizontal: isTablet ? 22 : 18,
  borderRadius: isTablet ? 18 : 10,
  marginRight: 8,
  },

  activeTab: {
    backgroundColor: '#FFF',
  },

  tabText: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: isTablet ? 22 : 14,
  },

  activeTabText: {
    color: '#4C4CFF',
    fontWeight: '700',
  },
});