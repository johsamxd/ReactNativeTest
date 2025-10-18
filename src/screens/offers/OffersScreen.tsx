import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { requestLocationPermission } from '../../libs/permissions/permissions';
import { useQuery } from '@tanstack/react-query';
import { getOffers } from '../../api/offersApi';
import OfferCard from './components/OfferCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OffersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
      },
      error => {
        setError(error.message);
        Alert.alert('Ошибка', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['offers', location?.coords.latitude, location?.coords.longitude],
    queryFn: () =>
      getOffers(location!.coords.latitude, location!.coords.longitude),
    enabled: !!location,
  });

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'ios') {
          getCurrentLocation();
          return;
        }

        const savedPermission = await AsyncStorage.getItem(
          'ACCESS_FINE_LOCATION',
        );
        if (savedPermission === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
          return;
        }

        const granted = await requestLocationPermission();
        if (granted) {
          getCurrentLocation();
        } else {
          setError('Разрешение на геолокацию отклонено');
        }
      } catch (error) {
        console.error('Ошибка при загрузке:', error);
        setError('Ошибка загрузки геолокации');
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {(isLoading || !location) && <Text>Загрузка...</Text>}
      {data && data?.map(offer => <OfferCard key={offer.id} offer={offer} />)}
      <Button
        title="Go to offer"
        onPress={() => navigation.navigate('Offer')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
