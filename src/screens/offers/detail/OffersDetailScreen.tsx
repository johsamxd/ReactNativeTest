import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WorkType } from '../../../api/offersApi';
import { RootStackParamList } from '../../../libs/navigator/navigator';
import { Icon } from '../../../components/icon';
import Button from '../../../components/button';

type OffersDetailScreenRouteProp = RouteProp<RootStackParamList, 'OfferDetail'>;

export default function OffersDetailScreen() {
  const route = useRoute<OffersDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { offer } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title:
        offer?.workTypes
          .map((work: WorkType) => work.name)
          .filter((v: string) => !!v)
          .join(', ') || 'Детали предложения',
    });
  }, [navigation, offer]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 10 }}>
        <View style={styles.card}>
          <Text style={{ fontSize: 20, marginBottom: 5 }}>
            {offer?.workTypes
              .map((work: WorkType) => work.name)
              .filter((v: string) => !!v)
              .join(', ')}
          </Text>

          <View style={styles.line}>
            <Icon type="wallet" color="light" />
            <Text style={{ fontWeight: 500 }}>
              {'Цена: '}
              <Text style={{ color: 'green' }}>
                {offer?.priceWorker + ' ₽'}
                {offer?.bonusPriceWorker > 0 &&
                  ' + ' + offer?.bonusPriceWorker + ' ₽ (бонус)'}
              </Text>
            </Text>
          </View>

          <View style={styles.line}>
            <Icon type="location" color="light" />
            <Text>
              <Text style={{ fontWeight: 500 }}>{'Адрес: '}</Text>
              {offer?.address}
            </Text>
          </View>

          <View style={styles.line}>
            <Icon type="clock" color="light" />
            <Text>
              <Text style={{ fontWeight: 500 }}>{'Время: '}</Text>
              {offer.timeStartByCity + ' - ' + offer.timeEndByCity}
            </Text>
          </View>

          <View style={styles.line}>
            <Icon type="calendar" color="light" />
            <Text>
              <Text style={{ fontWeight: 500 }}>{'Дата: '}</Text>
              {offer.dateStartByCity}
            </Text>
          </View>

          <View style={styles.line}>
            <Icon type="users" color="light" />
            <Text>
              <Text style={{ fontWeight: 500 }}>{'Кол-во мест: '}</Text>
              {offer.currentWorkers + '/' + offer.planWorkers}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.card,
            { flexDirection: 'row', justifyContent: 'space-between' },
          ]}
        >
          <View>
            <Image style={styles.logo} source={{ uri: offer?.logo }} />
            <Text style={{ fontSize: 12, fontWeight: 500 }}>
              {offer.companyName}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon type="star" color="yellow" />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                {offer.customerRating || 5}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 10,
                textAlign: 'center',
                color: '#A1A1A1',
              }}
            >
              {' (' + offer.customerFeedbacksCount + ')'}
            </Text>
          </View>

          <View style={{ alignSelf: 'center' }}>
            <Icon type="chevron" color="light" size="xl" />
          </View>
        </TouchableOpacity>
      </View>
      <Button
        title="Записаться"
        onPress={() => {
          Alert.alert(
            'Успешная запись',
            'Вы успешно записались на предложение!',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
          );
        }}
        disabled={offer.currentWorkers === offer.planWorkers}
        buttonStyle={{ marginBottom: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    display: 'flex',
    padding: 10,
    gap: 2,
    borderRadius: 8,
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 5,
  },
  button: {
    borderRadius: 16,
  },
});
