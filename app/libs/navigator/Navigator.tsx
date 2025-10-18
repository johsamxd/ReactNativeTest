import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, OfferScreen } from '../../screens';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: { headerShown: false },
    },
    Offer: {
      screen: OfferScreen,
    },
  },
});

export const Navigator = createStaticNavigation(RootStack);
