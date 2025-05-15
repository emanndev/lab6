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

interface WifiConnection {
  id: number;
  wifiName: string;
  signal: 'excellent' | 'good' | 'poor';
}
