import General from './general';

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


class Light extends General {
  wifiController: any; // Temporary type; should be WifiController interface

  constructor(wifiController: any) {
    super();
    this.wifiController = wifiController;
    console.log('Light constructor - wifiController:', this.wifiController);
    this.componentsData = Object.fromEntries(
      Object.entries(this.componentsData).map(([key, comp]) => [
        key,
        { ...comp, element: null }
      ])
    );
  }

  toggleLightSwitch(lightSwitch: HTMLElement): void {
    console.log('Toggling light switch:', lightSwitch);
    console.log('wifiController in toggleLightSwitch:', this.wifiController);
    
    if (!this.wifiController?.isWifiActive || !this.wifiController?.currentConnection) {
      this.displayNotification('Cannot toggle light - no Wi-Fi connection', 'beforeend', document.body);
      return;
    }

    const componentData = this.getComponentData(lightSwitch, '.rooms', 'p');
    if (!componentData) {
      console.warn('Component data not found for light switch');
      return;
    }

    componentData.isLightOn = !componentData.isLightOn;
    const img = lightSwitch.querySelector('img') as HTMLImageElement;
    if (!img) {
      console.warn('Image not found in light switch');
      return;
    }


export default Light;