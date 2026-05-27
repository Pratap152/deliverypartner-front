import React from 'react';
import { View, Text, TouchableOpacity,Image, StyleSheet, ScrollView } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TABS } from '../../../utils/constants/slotConstants';
import { Dimensions } from 'react-native';


 const { width } = Dimensions.get('window');
 const isTablet = width >= 768;

export default function SlotBookingHeader({ activeTab, onTabChange, navigation}) {
    return (
        <View style={styles.header}>
            {/* Header Top Row */}
            <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>My Slots</Text>
                <TouchableOpacity
                    onPress={()=>navigation.navigate('HelpCenterList')}>
                <Image
                    source={require('../../../assets/chat.png')}
                    style={styles.chat_icon}
                    resizeMode="contain"
                />
                </TouchableOpacity>
            </View>

            {/* Tab Container */}
            <View style={styles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <TouchableOpacity
                        style={[styles.tab, activeTab === TABS.CURRENT && styles.activeTab]}
                        onPress={() => onTabChange(TABS.CURRENT)}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.CURRENT && styles.activeTabText]}>
                            Current Week
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === TABS.NEXT && styles.activeTab]}
                        onPress={() => onTabChange(TABS.NEXT)}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.NEXT && styles.activeTabText]}>
                            Next Week
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === TABS.UPCOMING && styles.activeTab]}
                        onPress={() => onTabChange(TABS.UPCOMING)}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.UPCOMING && styles.activeTabText]}>
                            Upcoming Week
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
    backgroundColor: '#4C4CFF',
    paddingTop: isTablet ? hp(5) : hp(3),
    paddingBottom: isTablet ? hp(3) : hp(2),
    paddingHorizontal: isTablet ? 28 : 16,
    borderBottomLeftRadius: isTablet ? 34 : 24,
    borderBottomRightRadius: isTablet ? 34 : 24,
},
    chat_icon: {
    width: isTablet ? wp(4) : wp(6),
    height: isTablet ? wp(4) : wp(5),
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
    tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',

    borderRadius: isTablet ? 20 : 12,

    padding: isTablet ? 6 : 4,

    alignSelf: isTablet ? 'center' : 'stretch',

    width: isTablet ? '87%' : '96.5%',
},
    tab: {
    paddingVertical: isTablet ? 18 : 10,
    paddingHorizontal: isTablet ? 36 : 16,
    alignItems: 'center',
    borderRadius: isTablet ? 18 : 10,
    marginRight: 8,
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
