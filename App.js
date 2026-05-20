import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from './src/AppContext';
import Icon from './src/components/Icon';

import SplashScreen  from './src/screens/SplashScreen';
import LoginScreen   from './src/screens/LoginScreen';
import SignupScreen  from './src/screens/SignupScreen';
import HomeScreen    from './src/screens/HomeScreen';
import BudgetScreen  from './src/screens/BudgetScreen';
import CoachScreen   from './src/screens/CoachScreen';
import LearnScreen   from './src/screens/LearnScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.trackSoft,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.blue,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: t.home,    tabBarIcon: ({ color, size }) => <TabIcon name="home"  color={color} size={size}/> }}/>
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
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="Splash"  component={SplashScreen} />
          <Stack.Screen name="Login"   component={LoginScreen}  />
          <Stack.Screen name="Signup"  component={SignupScreen} />
          <Stack.Screen name="Main"    component={MainTabs}     />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
