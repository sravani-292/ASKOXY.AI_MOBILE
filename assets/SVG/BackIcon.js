import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const BackIcon = props => (
  <Svg width={25} height={25} viewBox="0 0 512 512" {...props}>
    <Path
      fill="none"
      stroke="#323232"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={48}
      d="M328 112 184 256l144 144"
    />
  </Svg>
);
export default BackIcon;
