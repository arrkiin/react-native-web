const AnimatedTracking = require('../nodes/AnimatedTracking');
const TimingAnimation = require('./TimingAnimation');
const _combineCallbacks = require('./combineCallbacks');
const maybeVectorAnim = require('./maybeVectorAnim');

import type { AnimatedValue } from '../nodes/AnimatedValue';
import type { AnimatedValueXY } from '../nodes/AnimatedValueXY';
import type { AnimationConfig, EndCallback } from './Animation';
import type { TimingAnimationConfig } from './TimingAnimation';

const timing = function(
  value: AnimatedValue | AnimatedValueXY,
  config: TimingAnimationConfig
): CompositeAnimation {
  const start = function(
    animatedValue: AnimatedValue | AnimatedValueXY,
    configuration: TimingAnimationConfig,
    callback?: ?EndCallback
  ): void {
    callback = _combineCallbacks(callback, configuration);
    const singleValue: any = animatedValue;
    const singleConfig: any = configuration;
    singleValue.stopTracking();
    if (configuration.toValue.__getAnimatedValue !== undefined) {
      singleValue.track(
        new AnimatedTracking(
          singleValue,
          configuration.toValue,
          TimingAnimation,
          singleConfig,
          callback
        )
      );
    } else {
      singleValue.animate(new TimingAnimation(singleConfig), callback);
    }
  };

  return (
    maybeVectorAnim(value, config, timing) || {
      start: function(callback?: ?EndCallback): void {
        start(value, config, callback);
      },

      stop: function(): void {
        value.stopAnimation();
      },

      reset: function(): void {
        value.resetAnimation();
      },

      _startNativeLoop: function(iterations?: number): void {
        const singleConfig = { ...config, iterations };
        start(value, singleConfig);
      },

      _isUsingNativeDriver: function(): boolean {
        return config.useNativeDriver || false;
      }
    }
  );
};

module.exports = timing;
