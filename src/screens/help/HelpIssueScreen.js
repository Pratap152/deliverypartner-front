import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ISSUE_ANSWERS = {
  order: 'If your order earnings are incorrect, please wait for 24 hours.',
  daily: 'Daily incentives are calculated at end of the day.',
  incentives: 'Incentives and payouts are processed weekly.',
  payout: 'Incorrect payout issues are resolved within 2 working days.',
  floating: 'Floating cash issues occur if orders are not closed properly.',
  duty: 'Duty-related issues include shift allocation and login problems.',
  insurance: 'Insurance benefits apply to active delivery partners only.',
  update: 'You can update personal details from your profile.',
  uniform: 'Uniform requests are processed within 7 working days.',
  rain: 'Rain mode can be activated during heavy rain.',
};

const HelpIssueScreen = ({ route }) => {
  const { issueId, title } = route.params;

  const answer =
    ISSUE_ANSWERS[issueId] || 'Information will be available soon.';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.card}>
        <Text style={styles.answer}>{answer}</Text>
      </View>
    </ScrollView>
  );
};

export default HelpIssueScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  answer: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
