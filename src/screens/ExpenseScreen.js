import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MessContext } from '../context/MessContext';
import { AuthContext } from '../context/AuthContext';

export default function ExpenseScreen() {
  const { expenses, addExpense } = useContext(MessContext);
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('bazar'); // 'bazar' or 'fixed_bill'
  const [saving, setSaving] = useState(false);

  const handleAddExpense = async () => {
    if (!title || !amount) {
      Alert.alert('Error', 'Please enter item title and amount');
      return;
    }

    try {
      setSaving(true);
      await addExpense({
        title,
        amount: Number(amount),
        category,
        paidBy: user._id,
        date: new Date().toISOString().split('T')[0],
      });

      setTitle('');
      setAmount('');
      Alert.alert('সফল!', 'খরচ সফলভাবে যুক্ত করা হয়েছে');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add expense';
      Alert.alert('ত্রুটি', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>মেস খরচ ও বাজার</Text>
      <Text style={styles.subTitle}>বাজার খরচ ও ইউটিলিটি বিলের এন্ট্রি দিন</Text>

      {/* Expense Input Card */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>নতুন খরচ যোগ করুন</Text>

        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.catBtn, category === 'bazar' && styles.activeCatBtn]}
            onPress={() => setCategory('bazar')}
          >
            <Text style={[styles.catText, category === 'bazar' && styles.activeCatText]}>
              বাজার খরচ (Bazar)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.catBtn, category === 'fixed_bill' && styles.activeCatBtn]}
            onPress={() => setCategory('fixed_bill')}
          >
            <Text style={[styles.catText, category === 'fixed_bill' && styles.activeCatText]}>
              স্থায়ী বিল (Fixed)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>বিবরণ / খাতের নাম:</Text>
          <TextInput
            style={styles.input}
            placeholder={category === 'bazar' ? 'যেমন: চাল, তেল, মুরগি' : 'যেমন: বাসা ভাড়া, বিদ্যুৎ বিল'}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>টাকার পরিমাণ (৳):</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddExpense} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>খরচ যুক্ত করুন</Text>}
        </TouchableOpacity>
      </View>

      {/* Expense History List */}
      <Text style={styles.sectionHeading}>সাম্প্রতিক খরচের তালিকা</Text>

      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>এখনো কোনো খরচ এন্ট্রি করা হয়নি</Text>
      ) : (
        expenses.map(item => (
          <View key={item._id} style={styles.expenseItem}>
            <View style={styles.expLeft}>
              <Text style={styles.expTitle}>{item.title}</Text>
              <Text style={styles.expSub}>
                পরিশোধক: {item.paidBy?.name || 'Unknown'} | {item.date}
              </Text>
            </View>
            <View style={styles.expRight}>
              <Text style={styles.expAmount}>৳ {item.amount}</Text>
              <Text style={[styles.catTag, item.category === 'fixed_bill' ? styles.tagFixed : styles.tagBazar]}>
                {item.category === 'fixed_bill' ? 'Fixed' : 'Bazar'}
              </Text>
            </View>
          </View>
        ))
      )}
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
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  catBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  activeCatBtn: {
    backgroundColor: '#2563eb',
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeCatText: {
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
  expenseItem: {
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
  expLeft: {
    flex: 1,
  },
  expTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  expSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  expRight: {
    alignItems: 'flex-end',
  },
  expAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  catTag: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  tagBazar: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  tagFixed: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
});

