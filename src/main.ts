import Light from './basicSettings';
import AdvanceSettings from './advanceSettings';
import WifiController from './WifiConfig';

interface ComponentData {
  name: string;
  lightIntensity: number;
  numOfLights: number;
  isLightOn: boolean;
  autoOn: string;
  autoOff: string;
  usage: number[];
  element?: HTMLElement | null;
}
