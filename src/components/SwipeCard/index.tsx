import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type SwipeCardProps = {};

export const SwipeCard: React.FC<SwipeCardProps> = () => {
  const start = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const animatedButton = useAnimatedStyle(() => {
    const translateX = interpolate(
      offsetX.value,
      [0, -width],
      [0, -width],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX }],
    };
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      start.value = offsetX.value;
    })
    .onUpdate(({ translationX }) => {
      offsetX.value = start.value + translationX;
    });

  const tapGesture = Gesture.LongPress().onFinalize(() => null);

  const gesture = Gesture.Race(panGesture, tapGesture);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.root, animatedButton]}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button</Text>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: 50,
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
});
