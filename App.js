import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { MessProvider, MessContext } from './src/context/MessContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MessSetupScreen from './src/screens/MessSetupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MealEntryScreen from './src/screens/MealEntryScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import DepositScreen from './src/screens/DepositScreen';
import SummaryScreen from './src/screens/SummaryScreen';

function MainAppContent() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { messDetails } = useContext(MessContext);
  const [authScreen, setAuthScreen] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'meals', 'expenses', 'deposits', 'summary'

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Not Logged In
  if (!user) {
    if (authScreen === 'register') {
      return <RegisterScreen navigation={{ navigate: (screen) => setAuthScreen(screen === 'Login' ? 'login' : 'register') }} />;
    }
    return <LoginScreen navigation={{ navigate: (screen) => setAuthScreen(screen === 'Register' ? 'register' : 'login') }} />;
  }

  // Logged In, but No Mess Assigned
  if (!user.messId && !messDetails) {
    return <MessSetupScreen />;
  }

  // Logged In & Has Mess: Show Bottom Tab Navigation
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Body */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'meals' && <MealEntryScreen />}
        {activeTab === 'expenses' && <ExpenseScreen />}
        {activeTab === 'deposits' && <DepositScreen />}
        {activeTab === 'summary' && <SummaryScreen />}
      </View>

      {/* Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTabItem]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.activeTabLabel]}>হোম</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'meals' && styles.activeTabItem]}
          onPress={() => setActiveTab('meals')}
        >
          <Text style={[styles.tabLabel, activeTab === 'meals' && styles.activeTabLabel]}>মিল</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'expenses' && styles.activeTabItem]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabLabel, activeTab === 'expenses' && styles.activeTabLabel]}>খরচ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'deposits' && styles.activeTabItem]}
          onPress={() => setActiveTab('deposits')}
        >
          <Text style={[styles.tabLabel, activeTab === 'deposits' && styles.activeTabLabel]}>জমা</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'summary' && styles.activeTabItem]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabLabel, activeTab === 'summary' && styles.activeTabLabel]}>হিসাব</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MessProvider>
        <MainAppContent />
      </MessProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    borderTopWidth: 3,
    borderTopColor: '#2563eb',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabLabel: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

