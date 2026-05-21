import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from './src/AppContext';
import Icon from './src/components/Icon';

import SplashScreen     from './src/screens/SplashScreen';
import LoginScreen      from './src/screens/LoginScreen';
import SignupScreen     from './src/screens/SignupScreen';
import HomeScreen       from './src/screens/HomeScreen';
import BudgetScreen     from './src/screens/BudgetScreen';
import CoachScreen      from './src/screens/CoachScreen';
import LearnScreen      from './src/screens/LearnScreen';
import ProfileScreen    from './src/screens/ProfileScreen';
import SimulatorScreen  from './src/screens/SimulatorScreen';
import ScamShieldScreen from './src/screens/ScamShieldScreen';
import LinkBankScreen   from './src/screens/LinkBankScreen';
import MealsScreen      from './src/screens/MealsScreen';
import TransportScreen  from './src/screens/TransportScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import NewsScreen       from './src/screens/NewsScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function TabIcon({ name, color, size }) {
  return <Icon name={name} size={size} color={color} />;
}


function MainTabs() {
  const { theme, t } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.surface, borderTopColor: theme.trackSoft }],
        tabBarActiveTintColor: theme.blue,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: t.home,    tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size}/> }}/>
      <Tab.Screen name="Budget"  component={BudgetScreen}  options={{ title: t.budget,  tabBarIcon: ({ color, size }) => <TabIcon name="chart" color={color} size={size}/> }}/>
      <Tab.Screen name="Coach"   component={CoachScreen}   options={{ title: t.coach,   tabBarIcon: ({ color, size }) => <TabIcon name="bot"   color={color} size={size}/> }}/>
      <Tab.Screen name="Learn"   component={LearnScreen}   options={{ title: t.learn,   tabBarIcon: ({ color, size }) => <TabIcon name="book"  color={color} size={size}/> }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t.profile, tabBarIcon: ({ color, size }) => <TabIcon name="user"  color={color} size={size}/> }}/>
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { theme, dark } = useApp();
  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="Splash"     component={SplashScreen} />
          <Stack.Screen name="Login"      component={LoginScreen}  />
          <Stack.Screen name="Signup"     component={SignupScreen} />
          <Stack.Screen name="Main"       component={MainTabs}     />
          <Stack.Screen name="Simulator"  component={SimulatorScreen}  options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="ScamShield" component={ScamShieldScreen} options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="LinkBank"   component={LinkBankScreen}   options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="Meals"      component={MealsScreen}      options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="Transport"  component={TransportScreen}  options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="News"       component={NewsScreen}       options={{ animation: 'slide_from_right' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: { height: Platform.OS === 'ios' ? 84 : 64, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 6, borderTopWidth: 1 },
  tabBarLabel: { fontSize: 11, fontWeight: '600' },
});
