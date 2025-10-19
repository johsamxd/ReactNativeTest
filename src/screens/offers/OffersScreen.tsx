import {
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { useCallback, useEffect, useState } from 'react';
import { requestLocationPermission } from '../../libs/permissions/permissions';
import { useQuery } from '@tanstack/react-query';
import { getOffers } from '../../api/offersApi';
import OfferCard from './components/OfferCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OffersScreen() {
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
        data={data || []}
        renderItem={({ item }) => <OfferCard offer={item} />}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              К сожалению, рядом нет доступных смен
            </Text>
          </View>
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: '12%',
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
  },
});
