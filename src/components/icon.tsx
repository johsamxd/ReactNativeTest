import { useQuery } from '@tanstack/react-query';
import { View, StyleSheet, Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useEffect, useRef } from 'react';

/** Icon types array
 * <h1> ! DO NOT EDIT MANUALLY ! </h1>
 * */
export const IconTypes = ['star', 'clock', 'calendar', 'users'] as const;

/** Icon types */
export type IconType = (typeof IconTypes)[number];

/** Icon colors */
export type IconColor = 'white' | 'light' | 'dark' | 'main' | 'danger';

/** Icon sizes */
export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  type: IconType;
  size?: IconSize;
  color?: IconColor;
}

const iconsMap: Record<IconType, string> = {
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>`,
};

interface ColorMapping {
  color: string;
}

const colorToStyle = new Map<IconColor, ColorMapping>([
  ['white', { color: '#FFFFFF' }],
  ['light', { color: '#A1A1A1' }],
  ['main', { color: '#007AFF' }],
  ['dark', { color: '#494949' }],
  ['danger', { color: '#FF3B30' }],
]);

const sizeToStyle = new Map<IconSize, { width: number; height: number }>([
  ['sm', { width: 8, height: 8 }],
  ['md', { width: 12, height: 12 }],
  ['lg', { width: 16, height: 16 }],
]);

export function Icon({ type, size = 'md', color = 'main' }: IconProps) {
  const data = iconsMap[type];
  const isLoading = !data;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isLoading, fadeAnim]);

  if (isLoading || !data) {
    return getIconLoadPlaceholder(size, color, fadeAnim);
  }

  const modifiedSvg = data
    .replace(/<defs>[\s\S]*<\/defs>/, '')
    .replace(/fill="([^"]*)"/g, (match, p1) =>
      p1 === 'none' ? match : 'fill="currentColor"',
    )
    .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
    .replace(/\s+/g, ' ');

  const sizeStyle = sizeToStyle.get(size)!;
  const colorStyle = colorToStyle.get(color)!;

  return (
    <View style={[styles.container, sizeStyle]}>
      <SvgXml
        xml={modifiedSvg}
        width={sizeStyle.width}
        height={sizeStyle.height}
        color={colorStyle.color}
      />
    </View>
  );
}

function getIconLoadPlaceholder(
  size: IconSize,
  color: IconColor,
  fadeAnim: Animated.Value,
) {
  const sizeStyle = sizeToStyle.get(size)!;
  const colorStyle = colorToStyle.get(color)!;
  return (
    <Animated.View
      style={[
        styles.placeholder,
        sizeStyle,
        {
          backgroundColor: colorStyle.color + '20',
          opacity: fadeAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    borderRadius: 4,
  },
});
