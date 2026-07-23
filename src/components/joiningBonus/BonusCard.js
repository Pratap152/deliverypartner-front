import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const BonusCard = ({ data, isTaskBased }) => {
  if (isTaskBased) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>
          Tasks
        </Text>

        {data.tasks.map(task => (
          <TaskRow
            key={task.dayNumber}
            task={task}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.fixedContainer}>
      <Text style={styles.sectionTitle}>
        Bonus Details
      </Text>

      <InfoRow
        label="Program"
        value={data.programName}
      />

      <InfoRow
        label="Target Orders"
        value={data.targetOrders}
      />

      <InfoRow
        label="Completed"
        value={data.completedOrders}
      />

      <InfoRow
        label="Pending"
        value={data.pendingOrders}
      />

      <InfoRow
        label="Reward"
        value={`₹${data.rewardAmount}`}
      />

      <InfoRow
        label="Status"
        value={data.payoutStatus}
      />
    </View>
  );
};

const TaskRow = ({ task }) => {
  const percentage = Math.round(
    (task.completedOrders / task.targetOrders) * 100,
  );

  const statusColor =
    task.status === 'COMPLETED'
      ? '#2DBE60'
      : task.status === 'RUNNING'
      ? '#1B2A5B'
      : '#8E8E8E';

  return (
    <View style={styles.card}>
      <View style={styles.dayBox}>
        <Text style={styles.dayLabel}>
          DAY
        </Text>

        <Text style={styles.dayNumber}>
          {task.dayNumber}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>
            Complete {task.targetOrders} Orders
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: statusColor,
              },
            ]}>
            <Text style={styles.badgeText}>
              {task.status}
            </Text>
          </View>
        </View>

        <Text style={styles.reward}>
          Reward ₹{task.rewardAmount}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percentage}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.percent}>
            {percentage}%
          </Text>
        </View>

        <Text style={styles.orders}>
          {task.completedOrders}/{task.targetOrders}
        </Text>
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>
      {label}
    </Text>

    <Text style={styles.infoValue}>
      {value}
    </Text>
  </View>
);

export default memo(BonusCard);

const styles = StyleSheet.create({
  scrollContent: {
    padding: isTablet ? 28 : 18,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: isTablet ? 24 : 18,
    fontWeight: '700',
    marginBottom: 18,
    color: '#111',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },

  dayBox: {
    width: isTablet ? 100 : 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8ECF7',
  },

  dayLabel: {
    fontSize: 12,
    color: '#555',
  },

  dayNumber: {
    fontSize: isTablet ? 40 : 28,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    padding: 16,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontWeight: '600',
    fontSize: isTablet ? 18 : 14,
    flex: 1,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  reward: {
    marginTop: 8,
    color: '#1B2A5B',
    fontWeight: '700',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#DDD',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1B2A5B',
  },

  percent: {
    marginLeft: 10,
    fontWeight: '700',
  },

  orders: {
    marginTop: 8,
    fontWeight: '600',
  },

  fixedContainer: {
    margin: 18,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
    elevation: 3,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  infoLabel: {
    color: '#666',
    fontSize: 15,
  },

  infoValue: {
    fontWeight: '700',
    color: '#111',
    fontSize: 15,
  },
});