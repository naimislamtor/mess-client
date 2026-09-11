import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { MessContext } from '../context/MessContext';

export default function SummaryScreen() {
  const { summary, loading, refreshData, selectedMonth } = useContext(MessContext);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshData} />}
    >
      <Text style={styles.headerTitle}>মাসিক মেস ফাইনাল হিসাব</Text>
      <Text style={styles.subTitle}>মাস: {selectedMonth} | সম্পূর্ণ আর্থিক হিসাব বিবরণী</Text>

      {/* Overview Card */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>সামগ্রিক পরিসংখ্যান (Summary)</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>মোট মেম্বার:</Text>
          <Text style={styles.rowVal}>{summary?.memberCount || 0} জন</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>মোট মেস মিল:</Text>
          <Text style={styles.rowVal}>{summary?.totalMessMeals || 0} টি</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>মোট বাজার খরচ:</Text>
          <Text style={styles.rowVal}>৳ {summary?.totalBazarExpense || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>মোট ফিক্সড বিল:</Text>
          <Text style={styles.rowVal}>৳ {summary?.totalFixedExpense || 0}</Text>
        </View>

        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>চূড়ান্ত মিল রেট (Meal Rate):</Text>
          <Text style={styles.highlightVal}>৳ {summary?.mealRate || 0}</Text>
        </View>
      </View>

      {/* Member Breakdown Table */}
      <Text style={styles.sectionHeading}>মেম্বারভিত্তিক বিস্তারিত হিসাব</Text>

      {summary?.memberBreakdown?.map(item => (
        <View key={item.member._id} style={styles.memberBox}>
          <View style={styles.memberHeader}>
            <Text style={styles.memberName}>{item.member.name}</Text>
            <Text
              style={[
                styles.statusBadge,
                { color: item.netBalance >= 0 ? '#16a34a' : '#dc2626' },
              ]}
            >
              {item.netBalance >= 0 ? 'পাবেন (Refund)' : 'দিতে হবে (Due)'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>মিল সংখ্যা:</Text>
            <Text style={styles.detailVal}>{item.totalMeals} টি (৳ {item.mealCost})</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ফিক্সড বিল শেয়ার:</Text>
            <Text style={styles.detailVal}>৳ {item.fixedCostShare}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>মোট খরচ:</Text>
            <Text style={styles.detailVal}>৳ {item.totalIndividualCost}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>মোট জমা দিয়েছেন:</Text>
            <Text style={[styles.detailVal, { color: '#16a34a' }]}>৳ {item.totalDeposit}</Text>
          </View>

          <View style={styles.netRow}>
            <Text style={styles.netLabel}>নিট সমাপনী ব্যালেন্স:</Text>
            <Text
              style={[
                styles.netVal,
                { color: item.netBalance >= 0 ? '#16a34a' : '#dc2626' },
              ]}
            >
              ৳ {item.netBalance}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  rowVal: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  highlightLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  highlightVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  memberBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  netLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  netVal: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

