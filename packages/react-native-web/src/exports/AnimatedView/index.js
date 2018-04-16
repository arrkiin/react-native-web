/**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule AnimatedView
 * @flow
 */
import createAnimatedComponent from '../../vendor/Animated/createAnimatedComponent';
import View from '../View';

const AnimatedView = createAnimatedComponent(View);

export default AnimatedView;
