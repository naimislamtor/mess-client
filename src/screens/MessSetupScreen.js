import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { MessContext } from '../context/MessContext';
import { AuthContext } from '../context/AuthContext';

export default function MessSetupScreen() {
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  const [joinCode, setJoinCode] = useState('');
  const [messName, setMessName] = useState('');
  const [messAddress, setMessAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const { createMess, joinMess } = useContext(MessContext);
  const { user, updateUserData } = useContext(AuthContext);

  const handleJoin = async () => {
    if (!joinCode) {
      Alert.alert('Error', 'Please enter Join Code');
      return;
    }
    try {
      setLoading(true);
      const res = await joinMess(joinCode);
      if (res.user) {
        await updateUserData(res.user);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to join mess';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!messName) {
      Alert.alert('Error', 'Please enter Mess Name');
      return;
    }
    try {
      setLoading(true);
      const res = await createMess(messName, messAddress);
      if (res.user) {
        await updateUserData(res.user);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create mess';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>হ্যালো, {user?.name}!</Text>
        <Text style={styles.subText}>মেস হিসাব শুরু করতে যেকোনো একটি পছন্দ করুন</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'join' && styles.activeTab]}
          onPress={() => setActiveTab('join')}
        >
          <Text style={[styles.tabText, activeTab === 'join' && styles.activeTabText]}>
            মেসে জয়েন করুন
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            নতুন মেস খুলুন
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {activeTab === 'join' ? (
          <View>
            <Text style={styles.cardTitle}>জয়েন কোড দিয়ে যুক্ত হন</Text>
            <Text style={styles.cardSub}>আপনার মেস ম্যানেজারের কাছ থেকে ৬ ডিজিটের কোড নিন</Text>

            <TextInput
              style={styles.codeInput}
              placeholder="e.g. A1B2C3"
              value={joinCode}
              onChangeText={setJoinCode}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleJoin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>মেসে যুক্ত হন</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.cardTitle}>নতুন মেস খুলুন (ম্যানেজার)</Text>
            <Text style={styles.cardSub}>মেসের নাম ও ঠিকানা দিয়ে নতুন মেস চালু করুন</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>মেসের নাম (Mess Name)</Text>
              <TextInput
                style={styles.input}
                placeholder="যেমন: সোনার বাংলা মেস"
                value={messName}
                onChangeText={setMessName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ঠিকানা (Address - Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="যেমন: ধানমন্ডি 32, ঢাকা"
                value={messAddress}
                onChangeText={setMessAddress}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: '#16a34a' }]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>মেস তৈরি করুন</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#2563eb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 4,
    paddingVertical: 12,
    marginBottom: 20,
    color: '#0f172a',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

