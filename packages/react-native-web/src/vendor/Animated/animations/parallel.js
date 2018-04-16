import type { EndCallback } from './Animation';

type ParallelConfig = {
  stopTogether?: boolean // If one is stopped, stop all.  default: true
};

const parallel = function(
  animations: Array<CompositeAnimation>,
  config?: ?ParallelConfig
): CompositeAnimation {
  let doneCount = 0;
  // Make sure we only call stop() at most once for each animation
  const hasEnded = {};
  const stopTogether = !(config && config.stopTogether === false);

  const result = {
    start: function(callback?: ?EndCallback) {
      if (doneCount === animations.length) {
        callback && callback({ finished: true });
        return;
      }

      animations.forEach((animation, idx) => {
        const cb = function(endResult) {
          hasEnded[idx] = true;
          doneCount++;
          if (doneCount === animations.length) {
            doneCount = 0;
            callback && callback(endResult);
            return;
          }

          if (!endResult.finished && stopTogether) {
            result.stop();
          }
        };

        if (!animation) {
          cb({ finished: true });
        } else {
          animation.start(cb);
        }
      });
    },

    stop: function(): void {
      animations.forEach((animation, idx) => {
        !hasEnded[idx] && animation.stop();
        hasEnded[idx] = true;
      });
    },

    reset: function(): void {
      animations.forEach((animation, idx) => {
        animation.reset();
        hasEnded[idx] = false;
        doneCount = 0;
      });
    },

    _startNativeLoop: function() {
      throw new Error(
        'Loops run using the native driver cannot contain Animated.parallel animations'
      );
    },

    _isUsingNativeDriver: function(): boolean {
      return false;
    }
  };

  return result;
};

module.exports = parallel;
