import {
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
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

  const { data, isLoading } = useQuery({
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

  if (isLoading || !location) return <Text>Загрузка...</Text>;
  if (error) return <Text>{error}</Text>;

  console.log(data);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Доступные смены</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <OfferCard offer={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: '12%',
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
});
