import React, { useState, useContext, useEffect } from 'react';
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

export default function DepositScreen() {
  const { members, deposits, addDeposit } = useContext(MessContext);
  const { user } = useContext(AuthContext);

  const [selectedMemberId, setSelectedMemberId] = useState(user?._id);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role !== 'manager') {
      setSelectedMemberId(user?._id);
    }
  }, [user]);

  const handleAddDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter valid deposit amount');
      return;
    }

    try {
      setSaving(true);
      await addDeposit({
        userId: user?.role === 'manager' ? selectedMemberId : user?._id,
        amount: Number(amount),
        date: new Date().toISOString().split('T')[0],
        note,
      });

      setAmount('');
      setNote('');
      Alert.alert('সফল!', 'জমা টাকা রেকর্ড করা হয়েছে');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add deposit';
      Alert.alert('ত্রুটি', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>মেম্বারদের জমা টাকা</Text>
      <Text style={styles.subTitle}>মেসের ফান্ডে নিজের টাকা জমা বা অ্যান্ট্রি দিন</Text>

      {/* Deposit Input Card */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>নতুন টাকা জমা দিন</Text>

        {/* Security Logic: Show Member Selector ONLY for Managers. For regular members, fix to their own profile! */}
        {user?.role === 'manager' ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>মেম্বার নির্বাচন করুন (ম্যানেজার এক্সেস):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        ) : (
          <View style={styles.selfMemberBox}>
            <Text style={styles.selfLabel}>জমা প্রদানকারী:</Text>
            <Text style={styles.selfName}>{user?.name} (আপনার নাম)</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>জমা টাকার পরিমাণ (৳):</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>নোট / বিবরণ (Optional):</Text>
          <TextInput
            style={styles.input}
            placeholder="যেমন: বিকাশে দেওয়া হয়েছে"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddDeposit} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>জমা কনফার্ম করুন</Text>}
        </TouchableOpacity>
      </View>

      {/* Deposit History */}
      <Text style={styles.sectionHeading}>জমা টাকার ইতিহাস</Text>

      {deposits.length === 0 ? (
        <Text style={styles.emptyText}>এখনো কোনো জমা টাকা এন্ট্রি হয়নি</Text>
      ) : (
        deposits.map(item => (
          <View key={item._id} style={styles.depositItem}>
            <View style={styles.depLeft}>
              <Text style={styles.depName}>{item.userId?.name || 'Unknown'}</Text>
              <Text style={styles.depSub}>
                {item.date} {item.note ? `| ${item.note}` : ''}
              </Text>
            </View>
            <Text style={styles.depAmount}>+ ৳ {item.amount}</Text>
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  selfMemberBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  selfLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  selfName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 2,
  },
  memberChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeMemberChip: {
    backgroundColor: '#16a34a',
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
  inputGroup: {
    marginBottom: 12,
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
  depositItem: {
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
  depLeft: {
    flex: 1,
  },
  depName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  depSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  depAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
});
