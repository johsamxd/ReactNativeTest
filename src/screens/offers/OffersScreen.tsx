import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOffers } from '../../api/offersApi';
import OfferCard from './components/OfferCard';
import OfferCardPlaceholder from './components/OfferCardPlaceholder';
import { observer } from 'mobx-react-lite';
import { locationStore } from '../../stores/LocationStore';

const OffersScreen = observer(() => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'offers',
      locationStore.location?.coords.latitude,
      locationStore.location?.coords.longitude,
    ],
    queryFn: () =>
      getOffers(
        locationStore.location!.coords.latitude,
        locationStore.location!.coords.longitude,
      ),
    enabled: !!locationStore.location,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    locationStore.getCurrentLocation();
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    locationStore.startTracking();

    return () => {
      locationStore.stopTracking();
    };
  }, []);

  if (locationStore.error)
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Произошла ошибка: {locationStore.error}
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Доступные смены</Text>
      {isLoading || !locationStore.location ? (
        new Array(8).fill(0).map((_, i) => <OfferCardPlaceholder key={i} />)
      ) : (
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
      )}
    </View>
  );
});

export default OffersScreen;

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
