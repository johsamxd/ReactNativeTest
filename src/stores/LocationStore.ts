import { makeAutoObservable, runInAction } from 'mobx';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import { requestLocationPermission } from '../libs/permissions/permissions';

class LocationStore {
  location: GeolocationResponse | null = null;
  error: string | null = null;
  isTracking = false;

  constructor() {
    makeAutoObservable(this);
  }

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        runInAction(() => {
          this.location = position;
          this.error = null;
        });
      },
      error => {
        runInAction(() => {
          this.error = error.message;
          this.location = null;
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  startTracking = async () => {
    if (this.isTracking) return;

    try {
      if (Platform.OS === 'ios') {
        this.getCurrentLocation();
      } else {
        const savedPermission = await AsyncStorage.getItem(
          'ACCESS_FINE_LOCATION',
        );
        if (savedPermission === PermissionsAndroid.RESULTS.GRANTED) {
          this.getCurrentLocation();
        } else {
          const granted = await requestLocationPermission();
          if (!granted) {
            this.error = 'Разрешение на геолокацию отклонено';
            return;
          }
          this.getCurrentLocation();
        }
      }

      this.isTracking = true;
      this.intervalId = setInterval(this.getCurrentLocation, 30000);
    } catch (error) {
      console.error('Ошибка при запуске трекинга:', error);
      this.error = 'Ошибка загрузки геолокации';
    }
  };

  stopTracking = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isTracking = false;
  };

  private intervalId: number | null = null;
}

export const locationStore = new LocationStore();
