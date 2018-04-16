import type { AnimatedValue } from '../nodes/AnimatedValue';
import type { AnimatedValueXY } from '../nodes/AnimatedValueXY';
import type { CompositeAnimation } from './CompositeAnimation';

const maybeVectorAnim = function(
  value: AnimatedValue | AnimatedValueXY,
  config: Object,
  anim: (value: AnimatedValue, config: Object) => CompositeAnimation
): ?CompositeAnimation {
  if (value.x !== undefined && value.y !== undefined) {
    const configX = { ...config };
    const configY = { ...config };
    for (const key in config) {
      const { x, y } = config[key];
      if (x !== undefined && y !== undefined) {
        configX[key] = x;
        configY[key] = y;
      }
    }
    const aX = anim((value: AnimatedValueXY).x, configX);
    const aY = anim((value: AnimatedValueXY).y, configY);
    // We use `stopTogether: false` here because otherwise tracking will break
    // because the second animation will get stopped before it can update.
    return parallel([aX, aY], { stopTogether: false });
  }
  return null;
};

module.exports = maybeVectorAnim;
