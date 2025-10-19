import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function OfferCardPlaceholder() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const animatedStyle = {
    opacity: pulseAnim,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.leftContainer}>
        <View style={styles.logoPlaceholder} />

        <View style={styles.ratingPlaceholder} />

        <View style={styles.feedbackPlaceholder} />
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.titlePlaceholder} />

        <View style={styles.companyPlaceholder} />

        <View style={styles.addressPlaceholder} />

        <View style={styles.pricePlaceholder} />

        <View style={styles.line}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.lineTextPlaceholder} />
        </View>
        <View style={styles.line}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.lineTextPlaceholder} />
        </View>
        <View style={styles.line}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.lineTextPlaceholder} />
        </View>
      </View>
    </Animated.View>
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
    alignItems: 'center',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    width: '80%',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
  },
  ratingPlaceholder: {
    width: 40,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  feedbackPlaceholder: {
    width: 30,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 2,
  },
  titlePlaceholder: {
    width: '80%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  companyPlaceholder: {
    width: '60%',
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  addressPlaceholder: {
    width: '70%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  pricePlaceholder: {
    width: '40%',
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 12,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  lineTextPlaceholder: {
    width: '50%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});
