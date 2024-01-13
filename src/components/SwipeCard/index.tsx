import React from 'react';
import { Text, StyleSheet, Dimensions, View, Alert } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SVG } from '../SVG';
import minus from '../../assets/icons/minus.svg';

const { width } = Dimensions.get('window');

const BUTTON_WIDTH = width;
const BUTTON_HEIGHT = 50;

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

  const deleteButtonAnimation = useAnimatedStyle(() => {
    const deleteWidth = interpolate(
      offsetX.value,
      [-width, -BUTTON_HEIGHT, 0],
      [width, BUTTON_HEIGHT, 0],
      Extrapolation.CLAMP,
    );

    const borderRadius = interpolate(
      offsetX.value,
      [-BUTTON_HEIGHT, -BUTTON_HEIGHT * 2],
      [BUTTON_HEIGHT / 2, 0],
      Extrapolation.CLAMP,
    );

    const deleteHeight = interpolate(
      offsetX.value,
      [-BUTTON_HEIGHT, 0],
      [BUTTON_HEIGHT, 0],
      Extrapolation.CLAMP,
    );

    return {
      borderRadius,
      height: deleteHeight,
      width: deleteWidth,
    };
  }, []);

  const minusAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      offsetX.value,
      [-(3 * BUTTON_HEIGHT) / 2, -BUTTON_HEIGHT, 0],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  const deleteTextAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      offsetX.value,
      [(-3 * BUTTON_HEIGHT) / 2, -BUTTON_HEIGHT],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  const confirmDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => (offsetX.value = withSpring(0)),
      },
      { text: 'Delete', style: 'destructive' },
    ]);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      start.value = offsetX.value;
    })
    .onUpdate(({ translationX }) => {
      const offset = start.value + translationX;
      if (offset < -width / 2) {
        offsetX.value = withSpring(-width);
      } else if (offset > -width / 2 && offset <= (-3 * BUTTON_HEIGHT) / 2) {
        offsetX.value = withSpring(start.value + translationX);
      } else {
        offsetX.value = start.value + translationX;
      }
    })
    .onEnd(({ velocityX }) => {
      if (offsetX.value > -BUTTON_HEIGHT / 2) {
        offsetX.value = withSpring(0);
      } else if (
        offsetX.value <= -BUTTON_HEIGHT / 2 &&
        offsetX.value > (-3 * BUTTON_HEIGHT) / 2
      ) {
        offsetX.value = withSpring(-BUTTON_HEIGHT, { velocity: velocityX });
      } else if (
        offsetX.value <= (-3 * BUTTON_HEIGHT) / 2 &&
        offsetX.value > -width / 2
      ) {
        offsetX.value = withSpring(-2 * BUTTON_HEIGHT, { velocity: velocityX });
      } else {
        offsetX.value = withSpring(-width);
        runOnJS(confirmDelete)();
      }
    });

  const tapGesture = Gesture.LongPress().onFinalize(() => null);

  const gesture = Gesture.Race(panGesture, tapGesture);

  return (
    <View style={styles.root}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.button, animatedButton]}>
          <Text style={styles.buttonText}>Button</Text>
        </Animated.View>
      </GestureDetector>
      <Animated.View style={[styles.deleteButton, deleteButtonAnimation]}>
        <Animated.View style={minusAnimation}>
          <SVG xml={minus} width={24} height={24} color="white" />
        </Animated.View>
        <Animated.View
          style={[styles.deleteButtonContainer, deleteTextAnimation]}>
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,

    flexDirection: 'row',
    overflow: 'hidden',
  },
  button: {
    width: BUTTON_WIDTH,
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },

  deleteButton: {
    backgroundColor: 'coral',
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonContainer: {
    position: 'absolute',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 0,
    textAlignVertical: 'center',
    textTransform: 'uppercase',
  },
});
