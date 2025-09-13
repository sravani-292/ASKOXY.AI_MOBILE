
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

// Horizontal scaling based on screen width
const scale = (size) => Math.min((SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size, size * 1.5);

// Vertical scaling based on screen height
const verticalScale = (size) => Math.min((SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size, size * 1.5);

// Font scaling with PixelRatio
const scaleFont = (size) => Math.min(PixelRatio.roundToNearestPixel((SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size), size * 1.3);

export { scale, verticalScale, scaleFont };