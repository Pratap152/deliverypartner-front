import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Animated,
  Alert,
  PanResponder,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeviceInfo from 'react-native-device-info';
import {
  getNotifications,
  getUnreadNotificationCount,
  deleteNotification,
  clearAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../services/NotificationService';
import { routeNotification } from '../../components/notifications/router';

dayjs.extend(relativeTime);

const isTablet = DeviceInfo.isTablet();

const PAGE_LIMIT = 20;

const SwipeableNotification = ({
  item,
  onPress,
  onDelete,
  getIconText,
}) => {
  const translateX = useRef(
    new Animated.Value(0),
  ).current;

  const isSwiping = useRef(false);

  const DELETE_WIDTH = 88;
  const MAX_SWIPE = -DELETE_WIDTH;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (
        _,
        gestureState,
      ) => {
        const { dx, dy } = gestureState;

        // Only take control for horizontal movement
        return (
          Math.abs(dx) > 10 &&
          Math.abs(dx) > Math.abs(dy)
        );
      },

      onPanResponderGrant: () => {
        isSwiping.current = false;
      },

      onPanResponderMove: (
        _,
        gestureState,
      ) => {
        const { dx } = gestureState;

        if (Math.abs(dx) > 10) {
          isSwiping.current = true;
        }

        // Only allow left swipe
        const newPosition = Math.max(
          MAX_SWIPE,
          Math.min(0, dx),
        );

        translateX.setValue(newPosition);
      },

      onPanResponderRelease: (
        _,
        gestureState,
      ) => {
        const { dx } = gestureState;

        if (dx < -40) {
          Animated.spring(translateX, {
            toValue: MAX_SWIPE,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const handlePress = () => {
    // Prevent notification click after swipe
    if (isSwiping.current) {
      isSwiping.current = false;
      return;
    }

    onPress(item);
  };

  const handleDeletePress = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start(() => {
      onDelete(item.id);
    });
  };

  return (
    <View style={styles.swipeContainer}>
      {/* Delete action behind the notification */}
      <View style={styles.deleteAction}>
        <TouchableOpacity
          style={styles.deleteActionButton}
          activeOpacity={0.7}
          onPress={handleDeletePress}
        >
          <Ionicons
            name="trash-outline"
            size={21}
            color="#EF4444"
          />

          <Text style={styles.deleteActionText}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification */}
      <Animated.View
        style={[
          styles.card,
          !item.isRead && styles.unreadCard,
          {
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          activeOpacity={0.7}
          onPress={handlePress}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              {getIconText(item.type)}
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  !item.isRead &&
                  styles.unreadTitle,
                ]}
              >
                {item.title}
              </Text>
            </View>

            <Text style={styles.body}>
              {item.body}
            </Text>

            <Text style={styles.time}>
              {dayjs(item.createdAt).fromNow()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Light separator */}
        <View style={styles.notificationDivider} />
      </Animated.View>
    </View>
  );
};

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [confirmation, setConfirmation] = useState({
    visible: false,
    type: null,
    notificationId: null,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  //   Initial API calls
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [
        notificationsResponse,
        unreadResponse,
      ] = await Promise.all([
        getNotifications({
          page: 1,
          limit: PAGE_LIMIT,
        }),

        getUnreadNotificationCount(),
      ]);

      //   Notifications
      if (notificationsResponse?.success) {
        const data =
          notificationsResponse?.data;

        setNotifications(
          data?.notifications || [],
        );

        setPagination({
          page:
            data?.pagination?.page || 1,

          limit:
            data?.pagination?.limit ||
            PAGE_LIMIT,

          total:
            data?.pagination?.total || 0,

          totalPages:
            data?.pagination?.totalPages ||
            1,
        });
      }

      //  Dedicated unread count API
      if (unreadResponse?.success) {
        setUnreadCount(
          unreadResponse?.data
            ?.unreadCount || 0,
        );
      }
    } catch (error) {
      console.log(
        'Notifications Initial Load Error:',
        error?.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  };

  //  * Load next page
  const handleLoadMore = async () => {
    if (
      loading ||
      loadingMore ||
      pagination.page >=
      pagination.totalPages
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage =
        pagination.page + 1;

      const response =
        await getNotifications({
          page: nextPage,
          limit: PAGE_LIMIT,
        });

      if (!response?.success) {
        return;
      }

      const data = response?.data;

      const newNotifications =
        data?.notifications || [];

      setNotifications(
        prevNotifications => [
          ...prevNotifications,
          ...newNotifications,
        ],
      );

      setPagination({
        page:
          data?.pagination?.page ||
          nextPage,

        limit:
          data?.pagination?.limit ||
          PAGE_LIMIT,

        total:
          data?.pagination?.total || 0,

        totalPages:
          data?.pagination?.totalPages ||
          1,
      });
    } catch (error) {
      console.log(
        'Load More Notifications Error:',
        error?.response?.data || error,
      );
    } finally {
      setLoadingMore(false);
    }
  };

  //  Get notification icon
  const getIconText = type => {
    if (type?.includes('ORDER')) {
      return '📦';
    }

    if (type?.includes('SLOT')) {
      return '🕒';
    }

    if (
      type?.includes('EARNING') ||
      type?.includes('PAY')
    ) {
      return '₹';
    }

    if (
      type?.includes('PEAK') ||
      type?.includes('INCENTIVE')
    ) {
      return '🎯';
    }

    if (
      type?.includes('KYC') ||
      type?.includes('PAN') ||
      type?.includes('DL')
    ) {
      return '📄';
    }

    return '🔔';
  };


  //   Notification press
  const handleNotificationPress = async item => {
    try {
      // Already read → just navigate
      if (item.isRead) {
        routeNotification(item);
        return;
      }

      // Mark notification as read
      const response =
        await markNotificationAsRead(item.id);

      if (response?.success) {
        // Update notification locally
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === item.id
              ? {
                ...notification,
                isRead: true,
              }
              : notification,
          ),
        );

        // Update unread count immediately
        setUnreadCount(prev =>
          Math.max(prev - 1, 0),
        );
      }

      // Navigate after marking as read
      routeNotification({
        ...item,
        isRead: true,
      });
    } catch (error) {
      console.log(
        'Mark Notification Read Error:',
        error?.response?.data || error,
      );

      // Even if mark-read fails, allow navigation
      routeNotification(item);
    }
  };


  //  notification section
  const getNotificationSection = createdAt => {
    const notificationDate =
      dayjs(createdAt);

    const today = dayjs();

    if (
      notificationDate.isSame(
        today,
        'day',
      )
    ) {
      return 'TODAY';
    }

    const yesterday =
      today.subtract(1, 'day');

    if (
      notificationDate.isSame(
        yesterday,
        'day',
      )
    ) {
      return 'YESTERDAY';
    }
    //   This week 
    if (
      notificationDate.isAfter(
        today.startOf('week'),
      )
    ) {
      return 'THIS WEEK';
    }
    //  This month  
    if (
      notificationDate.isAfter(
        today.startOf('month'),
      )
    ) {
      return 'THIS MONTH';
    }
    return null;
  };

  //   Group notifications
  const groupedNotifications =
    React.useMemo(() => {
      const groups = {
        TODAY: [],
        YESTERDAY: [],
        'THIS WEEK': [],
        'THIS MONTH': [],
      };

      notifications.forEach(
        notification => {
          const section =
            getNotificationSection(
              notification.createdAt,
            );

          if (section) {
            groups[section].push(
              notification,
            );
          }
        },
      );

      return groups;
    }, [notifications]);

  //   Convert grouped data into FlatList data
  const sectionData =
    React.useMemo(() => {
      const data = [];

      const sectionOrder = [
        'TODAY',
        'YESTERDAY',
        'THIS WEEK',
        'THIS MONTH',
      ];

      sectionOrder.forEach(section => {
        const items =
          groupedNotifications[
          section
          ];

        if (
          items &&
          items.length > 0
        ) {
          data.push({
            type: 'section',
            id: `section-${section}`,
            title: section,
          });

          items.forEach(item => {
            data.push({
              type: 'notification',
              ...item,
            });
          });
        }
      });

      return data;
    }, [groupedNotifications]);

  //  Notification item
  const renderNotification = item => {
    return (
      <SwipeableNotification
        item={item}
        onPress={handleNotificationPress}
        onDelete={handleDeleteNotification}
        getIconText={getIconText}
      />
    );
  };

  const renderItem = ({ item }) => {
    if (item.type === 'section') {
      return (
        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            {item.title}
          </Text>
        </View>
      );
    }

    return renderNotification(item);
  };

  const handleDeleteNotification = notificationId => {
    setConfirmation({
      visible: true,
      type: 'DELETE',
      notificationId,
    });
  };

  const confirmDeleteNotification = async () => {
    const notificationId = confirmation.notificationId;

    if (!notificationId) {
      return;
    }

    // Close confirmation UI immediately
    setConfirmation({
      visible: false,
      type: null,
      notificationId: null,
    });

    try {
      const response =
        await deleteNotification(notificationId);

      if (!response?.success) {
        console.log(
          'Delete notification failed:',
          response,
        );
        return;
      }

      // Remove notification from UI
      setNotifications(prev =>
        prev.filter(
          item => item.id !== notificationId,
        ),
      );

      // Update unread count
      const countResponse =
        await getUnreadNotificationCount();

      if (countResponse?.success) {
        setUnreadCount(
          countResponse?.data?.unreadCount || 0,
        );
      }

    } catch (error) {
      console.log(
        'Delete Notification Error:',
        error?.response?.data || error,
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      const response =
        await markAllNotificationsAsRead();

      if (!response?.success) {
        return;
      }

      // Make all currently loaded notifications read
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
        })),
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.log(
        'Mark All Notifications Read Error:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Error',
        'Failed to mark all notifications as read.',
      );
    }
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }

    return (
      <View
        style={styles.footerLoader}
      >
        <ActivityIndicator
          size="small"
          color="#0284C7"
        />

        <Text
          style={styles.loadingMoreText}
        >
          Loading more notifications...
        </Text>
      </View>
    );
  };

  const handleClearAllNotifications = () => {
    if (notifications.length === 0) {
      return;
    }

    setConfirmation({
      visible: true,
      type: 'CLEAR_ALL',
      notificationId: null,
    });
  };

  const confirmClearAllNotifications = async () => {
    setConfirmation({
      visible: false,
      type: null,
      notificationId: null,
    });

    try {
      const response =
        await clearAllNotifications();

      if (!response?.success) {
        console.log(
          'Clear notifications failed:',
          response,
        );
        return;
      }

      setNotifications([]);

      setPagination({
        page: 1,
        limit: PAGE_LIMIT,
        total: 0,
        totalPages: 1,
      });

      setUnreadCount(0);
    } catch (error) {
      console.log(
        'Clear Notifications Error:',
        error?.response?.data || error,
      );
    }
  };

  //  * Initial loader
  if (loading) {
    return (
      <SafeAreaView
        style={styles.loaderScreen}
      >
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
        />

        <View
          style={styles.loaderContainer}
        >
          <ActivityIndicator
            size="large"
            color="#0284C7"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <StatusBar
        backgroundColor="#0284C7"
        barStyle="light-content"
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Notifications
          </Text>

          <Text style={styles.headerSubTitle}>
            Stay updated with your delivery activities
          </Text>
        </View>

        {/* Notification actions */}
        <View style={styles.summaryContainer}>
          <View style={styles.unreadPill}>
            <Text style={styles.unreadPillText}>
              {unreadCount} Unread
            </Text>
          </View>

          <View style={styles.summaryActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Text
                style={[
                  styles.markAllText,
                  unreadCount === 0 &&
                  styles.disabledAction,
                ]}
              >
                Mark all read
              </Text>
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearAllNotifications}
              disabled={notifications.length === 0}
            >
              <Text
                style={[
                  styles.clearAllText,
                  notifications.length === 0 &&
                  styles.disabledAction,
                ]}
              >
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification list */}
        {sectionData.length === 0 ? (
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text
              style={styles.emptyTitle}
            >
              No Notifications
            </Text>

            <Text
              style={styles.emptyText}
            >
              You're all caught up.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sectionData}
            keyExtractor={item =>
              item.type === 'section'
                ? item.id
                : item.id
            }
            renderItem={renderItem}
            contentContainerStyle={
              styles.list
            }
            showsVerticalScrollIndicator={
              false
            }
            onEndReached={
              handleLoadMore
            }
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              renderFooter
            }
          />
        )}
        {confirmation.visible && (
          <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationCard}>

              <Text style={styles.confirmationTitle}>
                {confirmation.type === 'CLEAR_ALL'
                  ? 'Clear Notifications'
                  : 'Delete Notification'}
              </Text>

              <Text style={styles.confirmationMessage}>
                {confirmation.type === 'CLEAR_ALL'
                  ? 'Are you sure you want to delete all notifications?'
                  : 'Are you sure you want to delete this notification?'}
              </Text>

              <View style={styles.confirmationActions}>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.cancelButton}
                  onPress={() => {
                    setConfirmation({
                      visible: false,
                      type: null,
                      notificationId: null,
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.confirmButton}
                  onPress={
                    confirmation.type === 'CLEAR_ALL'
                      ? confirmClearAllNotifications
                      : confirmDeleteNotification
                  }
                >
                  <Text style={styles.confirmButtonText}>
                    {confirmation.type === 'CLEAR_ALL'
                      ? 'Clear All'
                      : 'Delete'}
                  </Text>

                </TouchableOpacity>

              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0284C7",
  },
  loaderScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    backgroundColor: '#0284C7',
    paddingHorizontal: isTablet
      ? wp('4%')
      : 18,
    paddingTop: isTablet
      ? hp('1%')
      : 4,
    paddingVertical: isTablet
      ? hp('2.5%')
      : 18,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: isTablet
      ? wp('3.2%')
      : 22,
    fontWeight: '700',
  },
  headerSubTitle: {
    marginTop: isTablet
      ? hp('0.6%')
      : 4,
    color: '#E0F2FE',
    fontSize: isTablet
      ? wp('2%')
      : 13,
  },
  summaryContainer: {
    minHeight: isTablet
      ? hp('6%')
      : 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet
      ? wp('4%')
      : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadPill: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    paddingHorizontal: isTablet
      ? wp('2.5%')
      : 12,
    paddingVertical: isTablet
      ? hp('0.8%')
      : 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadPillText: {
    fontSize: isTablet
      ? wp('2%')
      : 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  summaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllText: {
    fontSize: isTablet
      ? wp('2%')
      : 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  actionDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 12,
  },
  clearAllText: {
    fontSize: isTablet
      ? wp('2%')
      : 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  disabledAction: {
    color: '#D1D5DB',
  },
  list: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingTop: isTablet
      ? hp('2%')
      : 18,
    paddingBottom: isTablet
      ? hp('1%')
      : 8,
    paddingHorizontal: isTablet
      ? wp('4%')
      : 16,
  },
  sectionTitle: {
    fontSize: isTablet
      ? wp('2%')
      : 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  swipeContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  notificationDivider: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  unreadCard: {
    backgroundColor: '#ECF8FE',
  },
  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet
      ? wp('4%')
      : 16,
    paddingVertical: isTablet
      ? hp('1.8%')
      : 14,
    minHeight: isTablet
      ? hp('10%')
      : 78,
  },
  deleteAction: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 88,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteActionButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  iconContainer: {
    width: isTablet
      ? wp('6%')
      : 38,
    height: isTablet
      ? wp('6%')
      : 38,
    borderRadius: 19,
    backgroundColor:
      '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet
      ? wp('2.5%')
      : 11,
  },
  icon: {
    fontSize: isTablet
      ? wp('2.5%')
      : 17,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: isTablet
      ? wp('2.3%')
      : 14,
    fontWeight: '500',
    color: '#374151',
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  body: {
    marginTop: 3,
    fontSize: isTablet
      ? wp('1.9%')
      : 12,
    lineHeight: isTablet
      ? hp('2.3%')
      : 17,
    color: '#6B7280',
    paddingRight: 4,
  },
  time: {
    marginTop: 5,
    alignSelf: 'flex-end',
    fontSize: isTablet
      ? wp('1.7%')
      : 11,
    color: '#9CA3AF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: isTablet
      ? wp('3%')
      : 18,
    fontWeight: '600',
    color: '#111827',
  },
  emptyText: {
    marginTop: isTablet
      ? hp('0.8%')
      : 6,
    color: '#6B7280',
    fontSize: isTablet
      ? wp('2%')
      : 14,
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'transparent',

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 24,

    zIndex: 999,
    elevation: 20,
  },

  confirmationCard: {
    width: '100%',
    maxWidth: 380,

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    paddingHorizontal: 20,
    paddingVertical: 22,

    elevation: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  confirmationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  confirmationMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },

  confirmationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },

  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  confirmButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },

  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});