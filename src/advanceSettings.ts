import General from './general';
import Light from './basicSettings';
import Chart from 'chart.js/auto';

interface ComponentData {
  name: string;
  lightIntensity: number;
  numOfLights: number;
  isLightOn: boolean;
  autoOn: string;
  autoOff: string;
  usage: number[];
  element?: HTMLElement | null;
  [key: string]: any; // This line is correct, but you may need to ensure "noImplicitAny" is not set to true, or use a more specific type.
}

interface ChartInstance {
  destroy: () => void;
}
