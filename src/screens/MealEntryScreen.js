import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MessContext } from '../context/MessContext';
import { AuthContext } from '../context/AuthContext';

export default function MealEntryScreen() {
  const { members, meals, logMeal } = useContext(MessContext);
  const { user } = useContext(AuthContext);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMemberId, setSelectedMemberId] = useState(user?._id);

  const [breakfast, setBreakfast] = useState(0);
  const [lunch, setLunch] = useState(1);
  const [dinner, setDinner] = useState(1);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existingMeal = meals.find(
      m => (m.userId._id === selectedMemberId || m.userId === selectedMemberId) && m.date === selectedDate
    );

    if (existingMeal) {
      setBreakfast(existingMeal.breakfast || 0);
      setLunch(existingMeal.lunch || 0);
      setDinner(existingMeal.dinner || 0);
      setNote(existingMeal.note || '');
    } else {
      setBreakfast(0);
      setLunch(1);
      setDinner(1);
      setNote('');
    }
  }, [selectedDate, selectedMemberId, meals]);

  const handleDateShift = (days) => {
    try {
      const baseDate = new Date(selectedDate || new Date());
      if (isNaN(baseDate.getTime())) return;
      baseDate.setDate(baseDate.getDate() + days);
      const formatted = baseDate.toISOString().split('T')[0];
      setSelectedDate(formatted);
    } catch (e) {
      console.log('Date shift error', e);
    }
  };

  const handleSetToday = () => {
    setSelectedDate(todayStr);
  };

  const handleSaveMeal = async () => {
    try {
      setSaving(true);
      await logMeal({
        userId: selectedMemberId,
        date: selectedDate,
        breakfast: Number(breakfast),
        lunch: Number(lunch),
        dinner: Number(dinner),
        note,
      });
      Alert.alert('সফল!', `${selectedDate} তারিখের মিল সফলভাবে সেভ হয়েছে`);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save meal';
      Alert.alert('ত্রুটি', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>দৈনিক মিল এন্ট্রি</Text>
      <Text style={styles.subTitle}>আজকের বা যেকোনো তারিখের মিল রিকোয়েস্ট সেভ করুন</Text>

      {/* Date Finder Control Box */}
      <View style={styles.card}>
        <Text style={styles.label}>তারিখ নির্বাচন করুন:</Text>
        
        <View style={styles.dateControlBar}>
          <TouchableOpacity style={styles.dateArrowBtn} onPress={() => handleDateShift(-1)}>
            <Text style={styles.arrowText}>◀ আগের দিন</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.todayBtn} onPress={handleSetToday}>
            <Text style={styles.todayBtnText}>আজকে</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateArrowBtn} onPress={() => handleDateShift(1)}>
            <Text style={styles.arrowText}>পরের দিন ▶</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.dateInput}
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {/* Member Selector (Managers can edit for all, Members edit their own) */}
      {user?.role === 'manager' && (
        <View style={styles.card}>
          <Text style={styles.label}>মেম্বার নির্বাচন করুন:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {members.map(m => (
              <TouchableOpacity
                key={m._id}
                style={[
                  styles.memberChip,
                  selectedMemberId === m._id && styles.activeMemberChip,
                ]}
                onPress={() => setSelectedMemberId(m._id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedMemberId === m._id && styles.activeChipText,
                  ]}
                >
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Meal Entry Form */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>
          {selectedDate} তারিখের মিলের সংখ্যা দিন
        </Text>

        <View style={styles.mealRow}>
          <Text style={styles.mealName}>সকালের নাস্তা (Breakfast):</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.btnCount} onPress={() => setBreakfast(Math.max(0, breakfast - 0.5))}>
              <Text style={styles.btnCountText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countValue}>{breakfast}</Text>
            <TouchableOpacity style={styles.btnCount} onPress={() => setBreakfast(breakfast + 0.5)}>
              <Text style={styles.btnCountText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mealRow}>
          <Text style={styles.mealName}>দুপুরের খাবার (Lunch):</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.btnCount} onPress={() => setLunch(Math.max(0, lunch - 0.5))}>
              <Text style={styles.btnCountText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countValue}>{lunch}</Text>
            <TouchableOpacity style={styles.btnCount} onPress={() => setLunch(lunch + 0.5)}>
              <Text style={styles.btnCountText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mealRow}>
          <Text style={styles.mealName}>রাতের খাবার (Dinner):</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.btnCount} onPress={() => setDinner(Math.max(0, dinner - 0.5))}>
              <Text style={styles.btnCountText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countValue}>{dinner}</Text>
            <TouchableOpacity style={styles.btnCount} onPress={() => setDinner(dinner + 0.5)}>
              <Text style={styles.btnCountText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>মোট মিল:</Text>
          <Text style={styles.totalVal}>{breakfast + lunch + dinner} টি</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMeal} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>মিল সেভ করুন</Text>}
        </TouchableOpacity>
      </View>
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  dateControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },
  dateArrowBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  arrowText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  todayBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateInput: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
  },
  memberChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeMemberChip: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 14,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  mealName: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnCount: {
    backgroundColor: '#e2e8f0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  countValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    width: 30,
    textAlign: 'center',
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
