import type { AnimationConfig, EndCallback } from './animations/Animation';

const combineCallbacks = function(callback: ?EndCallback, config: AnimationConfig) {
  if (callback && config.onComplete) {
    return (...args) => {
      config.onComplete && config.onComplete(...args);
      callback && callback(...args);
    };
  } else {
    return callback || config.onComplete;
  }
};

module.exports = combineCallbacks;
