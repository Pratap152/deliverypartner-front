import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useGetMonthQuery, useGetWeekQuery, useGetDayQuery } from './earnings.api';
import { EarningsCard } from './components/EarningsCard';
import { ListRow } from './components/ListRow';
import { LedgerRow } from './components/LedgerRow';
import { EmptyState } from './components/EmptyState';
import { spacing } from '../../theme';

export function EarningsHistory() {
  const [level, setLevel] = useState('MONTH');
  const [payload, setPayload] = useState(null);

  const month = useGetMonthQuery('jan', { skip: level !== 'MONTH' });
  const week = useGetWeekQuery(payload || {}, { skip: level !== 'WEEK' });
  const day = useGetDayQuery(payload, { skip: level !== 'DAY' });

  if (month.isLoading || week.isLoading || day.isLoading)
    return <ActivityIndicator style={{ marginTop: 50 }} />;

  if (level === 'MONTH')
    return (
      <View style={{ padding: spacing.lg }}>
        <EarningsCard title="This Month" amount={month.data.totalEarnings} />
        <FlatList
          data={month.data.weeks}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <ListRow
              title={`${item.from} – ${item.to}`}
              amount={item.orders.reduce((s, o) => s + o.earnings.total, 0)}
              onPress={() => {
                setPayload({ start: item.from, end: item.to });
                setLevel('WEEK');
              }}
            />
          )}
        />
      </View>
    );

  if (level === 'WEEK')
    return (
      <View style={{ padding: spacing.lg }}>
        <EarningsCard title="This Week" amount={week.data.totalEarnings} />
        <FlatList
          data={week.data.days}
          keyExtractor={i => i.date}
          renderItem={({ item }) => (
            <ListRow
              title={item.date}
              amount={item.orders.reduce((s, o) => s + o.earnings.total, 0)}
              onPress={() => {
                setPayload(item.date);
                setLevel('DAY');
              }}
            />
          )}
        />
      </View>
    );

  if (!day.data.orders.length) return <EmptyState />;

  return (
    <View style={{ padding: spacing.lg }}>
      <EarningsCard title="Total Earnings" amount={
        day.data.orders.reduce((s, o) => s + o.earnings.total, 0)
      } />
      {day.data.orders.map(o => (
        <LedgerRow
          key={o.orderId}
          title={`Delivery ${o.orderId}`}
          subtitle={o.completedAt}
          amount={o.earnings.total}
        />
      ))}
    </View>
  );
}
