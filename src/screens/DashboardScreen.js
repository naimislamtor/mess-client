import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { MessContext } from '../context/MessContext';
import { AuthContext } from '../context/AuthContext';

export default function DashboardScreen() {
  const {
    summary,
    messDetails,
    members,
    dailyMealSummary,
    fetchDailyMealSummary,
    loading,
    refreshData,
    selectedMonth,
    selectedDate,
    setSelectedDate,
  } = useContext(MessContext);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (selectedDate) {
      fetchDailyMealSummary(selectedDate);
    }
  }, [selectedDate]);

  const mySummary = summary?.memberBreakdown?.find(
    (m) => m.member._id.toString() === user._id.toString()
  );

  // Quick Date Navigation Helper
  const handleDateShift = (days) => {
    try {
      const parts = selectedDate.split('-');
      let baseDate = new Date();
      if (parts.length === 3) {
        baseDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      baseDate.setDate(baseDate.getDate() + days);

      const year = baseDate.getFullYear();
      const month = String(baseDate.getMonth() + 1).padStart(2, '0');
      const day = String(baseDate.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      setSelectedDate(formatted);
    } catch (e) {
      console.log('Date shift error', e);
    }
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshData} />}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.messTitle}>{messDetails?.name || 'মেস ড্যাশবোর্ড'}</Text>
          <Text style={styles.joinCodeText}>
            জয়েন কোড: <Text style={styles.codeHighlight}>{messDetails?.joinCode}</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>লগআউট</Text>
        </TouchableOpacity>
      </View>

      {/* Month Badge */}
      <View style={styles.monthBadge}>
        <Text style={styles.monthText}>মাস: {selectedMonth}</Text>
      </View>

      {/* Primary Highlights Card */}
      <View style={styles.highlightCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>বর্তমান মিল রেট</Text>
          <Text style={styles.mealRateValue}>৳ {summary?.mealRate || 0}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>মাসের মোট মিল</Text>
          <Text style={styles.statValue}>{summary?.totalMessMeals || 0}</Text>
        </View>
      </View>

      {/* PROMINENT INTERACTIVE DATE FINDER & DAILY MEAL OVERVIEW */}
      <View style={styles.dailyMealCard}>
        <Text style={styles.cardHeaderTitle}>📅 দৈনিক মিল হিসাবের বিবরণী</Text>
        
        {/* Interactive Date Controls Bar */}
        <View style={styles.dateControlBar}>
          <TouchableOpacity
            style={styles.dateArrowBtn}
            onPress={() => handleDateShift(-1)}
          >
            <Text style={styles.arrowText}>◀ আগের দিন</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.todayBtn} onPress={handleSetToday}>
            <Text style={styles.todayBtnText}>আজকে</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateArrowBtn}
            onPress={() => handleDateShift(1)}
          >
            <Text style={styles.arrowText}>পরের দিন ▶</Text>
          </TouchableOpacity>
        </View>

        {/* Date Input Box */}
        <View style={styles.dateInputWrapper}>
          <Text style={styles.dateLabel}>নির্বাচিত তারিখ:</Text>
          <TextInput
            style={styles.dateInputLarge}
            value={selectedDate}
            onChangeText={(text) => setSelectedDate(text)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* 3 Meal Time Badges */}
        <View style={styles.mealTimeGrid}>
          <View style={[styles.timeBox, { backgroundColor: '#fef3c7' }]}>
            <Text style={styles.timeIcon}>🌅 নাস্তা</Text>
            <Text style={[styles.timeCount, { color: '#d97706' }]}>
              {dailyMealSummary?.totalBreakfast || 0} টি
            </Text>
          </View>

          <View style={[styles.timeBox, { backgroundColor: '#e0f2fe' }]}>
            <Text style={styles.timeIcon}>☀️ দুপুর</Text>
            <Text style={[styles.timeCount, { color: '#0284c7' }]}>
              {dailyMealSummary?.totalLunch || 0} টি
            </Text>
          </View>

          <View style={[styles.timeBox, { backgroundColor: '#f3e8ff' }]}>
            <Text style={styles.timeIcon}>🌙 রাত</Text>
            <Text style={[styles.timeCount, { color: '#9333ea' }]}>
              {dailyMealSummary?.totalDinner || 0} টি
            </Text>
          </View>
        </View>

        {/* Total Meals for Selected Date */}
        <View style={styles.dailyTotalRow}>
          <Text style={styles.dailyTotalLabel}>
            ({selectedDate}) তারিখের মোট খাদক/মিল:
          </Text>
          <Text style={styles.dailyTotalVal}>
            {dailyMealSummary?.totalMealsToday || 0} টি
          </Text>
        </View>

        {/* Member-by-Member Daily Meal List */}
        <Text style={styles.subHeadingText}>মেম্বারদের মিলের বিস্তারিত তালিকা:</Text>

        {(!dailyMealSummary?.memberBreakdown || dailyMealSummary?.memberBreakdown?.length === 0) ? (
          <Text style={styles.emptyText}>কোনো মেম্বার ডাটা পাওয়া যায়নি</Text>
        ) : (
          dailyMealSummary?.memberBreakdown?.map((m) => (
            <View key={m.member._id} style={styles.dailyMemberRow}>
              <View style={styles.nameCol}>
                <Text style={styles.dailyMemberName}>
                  {m.member.name}
                </Text>
                {m.member.role === 'manager' && (
                  <Text style={styles.roleTag}>ম্যানেজার</Text>
                )}
              </View>

              <View style={styles.mealPillsRow}>
                <View style={styles.pillB}>
                  <Text style={styles.pillText}>সকাল: {m.breakfast}</Text>
                </View>
                <View style={styles.pillL}>
                  <Text style={styles.pillText}>দুপুর: {m.lunch}</Text>
                </View>
                <View style={styles.pillD}>
                  <Text style={styles.pillText}>রাত: {m.dinner}</Text>
                </View>
              </View>

              <View style={styles.totalCol}>
                {m.totalMeals > 0 ? (
                  <Text style={styles.activeMealTag}>{m.totalMeals} টি মিল</Text>
                ) : (
                  <Text style={styles.offMealTag}>মিল বন্ধ</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Expenses Overview Row */}
      <View style={styles.statsRow}>
        <View style={[styles.miniCard, { backgroundColor: '#eff6ff' }]}>
          <Text style={styles.miniLabel}>মোট বাজার খরচ</Text>
          <Text style={[styles.miniValue, { color: '#2563eb' }]}>
            ৳ {summary?.totalBazarExpense || 0}
          </Text>
        </View>

        <View style={[styles.miniCard, { backgroundColor: '#f0fdf4' }]}>
          <Text style={styles.miniLabel}>স্থায়ী খরচ (Fixed)</Text>
          <Text style={[styles.miniValue, { color: '#16a34a' }]}>
            ৳ {summary?.totalFixedExpense || 0}
          </Text>
        </View>
      </View>

      {/* My Individual Balance Card */}
      {mySummary && (
        <View style={styles.myCard}>
          <Text style={styles.sectionTitle}>আমার হিসাব সংক্ষেপ ({user?.name})</Text>
          <View style={styles.rowItem}>
            <Text style={styles.itemLabel}>আমার মোট মিল:</Text>
            <Text style={styles.itemVal}>{mySummary.totalMeals} টি</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.itemLabel}>আমার মিল খরচ:</Text>
            <Text style={styles.itemVal}>৳ {mySummary.mealCost}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.itemLabel}>আমার জমা টাকা:</Text>
            <Text style={[styles.itemVal, { color: '#16a34a' }]}>
              ৳ {mySummary.totalDeposit}
            </Text>
          </View>
          <View style={styles.rowItemBold}>
            <Text style={styles.boldLabel}>অবশিষ্ট (পাওনা/দেনা):</Text>
            <Text
              style={[
                styles.boldVal,
                { color: mySummary.netBalance >= 0 ? '#16a34a' : '#dc2626' },
              ]}
            >
              ৳ {mySummary.netBalance} ({mySummary.netBalance >= 0 ? 'পাবেন' : 'দিতে হবে'})
            </Text>
          </View>
        </View>
      )}

      {/* Member List Preview */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>মেস মেম্বারগণ ({members.length} জন)</Text>
      </View>

      {members.map((member) => {
        const mSum = summary?.memberBreakdown?.find(
          (b) => b.member._id.toString() === member._id.toString()
        );
        return (
          <View key={member._id} style={styles.memberCard}>
            <View>
              <Text style={styles.memberName}>
                {member.name} {member.role === 'manager' && '(ম্যানেজার)'}
              </Text>
              <Text style={styles.memberSub}>
                মাসের মিল: {mSum?.totalMeals || 0} | জমা: ৳ {mSum?.totalDeposit || 0}
              </Text>
            </View>
            <Text
              style={[
                styles.balanceBadge,
                { color: (mSum?.netBalance || 0) >= 0 ? '#16a34a' : '#dc2626' },
              ]}
            >
              ৳ {mSum?.netBalance || 0}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  joinCodeText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  codeHighlight: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
  monthBadge: {
    backgroundColor: '#e2e8f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 14,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  highlightCard: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statLabel: {
    color: '#93c5fd',
    fontSize: 13,
    marginBottom: 4,
  },
  mealRateValue: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  /* Enhanced Daily Meal Card */
  dailyMealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    elevation: 3,
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
    textAlign: 'center',
  },
  dateControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dateArrowBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  arrowText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  todayBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  todayBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  dateInputLarge: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    width: 130,
  },
  mealTimeGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  timeBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  timeCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dailyTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  dailyTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  dailyTotalVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  subHeadingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 13,
  },
  dailyMemberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  nameCol: {
    width: 95,
  },
  dailyMemberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  roleTag: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  mealPillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  pillB: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pillL: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pillD: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  totalCol: {
    width: 65,
    alignItems: 'flex-end',
  },
  activeMealTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offMealTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  miniCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  miniLabel: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  myCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  itemVal: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  rowItemBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  boldLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  boldVal: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginVertical: 8,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  memberSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  balanceBadge: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
