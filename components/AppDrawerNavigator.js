import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyExchanges from '../screens/MyExchanges';
import NotificationScreen from '../screens/NotifiactionScreen';
import { StackNavigator } from './StackNavigator';

export const AppDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppTabNavigator
  },
  Setting: {
    screen: SettingScreen
  },
  Notification: {
    screen: NotificationScreen
  },
  'My Exchanges': {
    screen: MyExchanges
  },
  'Recieved Items': {
    screen: StackNavigator
  }
},
  {
    contentComponent: CustomSideBarMenu
  },
  {
    initialRouteName: 'Home'
  })
