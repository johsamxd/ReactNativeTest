import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Offer } from '../../../api/offersApi';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Tag from '../../../components/tag';
import { Icon } from '../../../components/icon';

export default function OfferCard({ offer }: { offer: Offer }) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('OfferDetail', { offer })}
    >
      <View style={styles.leftContainer}>
        <Image style={styles.logo} source={{ uri: offer?.logo }} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            justifyContent: 'center',
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

      <View style={styles.rightContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
          }}
        >
          <Text style={styles.title}>
            {offer?.workTypes
              .map(work => work.name)
              .filter(v => !!v)
              .join(', ')}
          </Text>
          {offer?.isPromotionEnabled && <Tag text={'VIP'} />}
        </View>

        <View>
          <Text>{offer?.companyName}</Text>
          <Text style={styles.smallText}>{offer?.address}</Text>
        </View>

        <Text style={{ color: 'green' }}>{offer?.priceWorker + ' ₽'}</Text>

        <View style={styles.line}>
          <View style={styles.line}>
            <Icon type="clock" color="light" />
            <Text style={styles.lineText}>
              {offer.timeStartByCity + ' - ' + offer.timeEndByCity}
            </Text>
          </View>
          <View style={styles.line}>
            <Icon type="calendar" color="light" />
            <Text style={styles.lineText}>{offer.dateStartByCity}</Text>
          </View>
          <View style={styles.line}>
            <Icon type="users" color="light" />
            <Text style={styles.lineText}>
              {offer.currentWorkers + '/' + offer.planWorkers}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    padding: 10,
    marginBottom: 20,
    borderRadius: 12,
  },
  leftContainer: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    width: '80%',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 5,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
  },
  smallText: {
    fontSize: 12,
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  lineText: {
    fontSize: 12,
    color: '#A1A1A1',
  },
});
