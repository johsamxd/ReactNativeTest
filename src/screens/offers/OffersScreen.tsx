import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { requestLocationPermission } from '../../libs/permissions/permissions';
import { useQuery } from '@tanstack/react-query';
import { getOffers } from '../../api/offersApi';
import OfferCard from './components/OfferCard';

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

  const { data, refetch } = useQuery({
    queryKey: ['offers', location?.coords.latitude, location?.coords.longitude],
    queryFn: () =>
      getOffers(location!.coords.latitude, location!.coords.longitude),
    enabled: !!location,
  });

  console.log(data);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (granted) {
        getCurrentLocation();
      } else {
        setError('Разрешение на геолокацию отклонено');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Home screen</Text>
      {location ? (
        <Text>
          Широта: {location.coords.latitude}, Долгота:{' '}
          {location.coords.longitude}
        </Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>Ошибка: {error}</Text>
      ) : (
        <Text>Получение координат...</Text>
      )}
      {data && data?.map(offer => <OfferCard key={offer.id} offer={offer} />)}
      <Button
        title="Get Location"
        onPress={() => {
          setLocation(null);
          getCurrentLocation();
        }}
      />
      <Button
        title="Go to offer"
        onPress={() => navigation.navigate('Offer')}
      />

      <Button
        title="Refetch"
        onPress={() => {
          console.log('refetching');
          refetch();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
