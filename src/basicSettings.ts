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

    const src = componentData.isLightOn ? img.dataset.lighton : './assets/svgs/light_bulb_off.svg';
    img.src = src || './assets/svgs/light_bulb_off.svg';

    const roomContainer = lightSwitch.closest('.rooms') as HTMLElement;
    const roomImage = roomContainer ? roomContainer.querySelector('img') as HTMLImageElement : null;
    if (roomImage) {
      if (componentData.isLightOn && componentData.lightIntensity === 0) {
        componentData.lightIntensity = 5;
      } else if (!componentData.isLightOn) {
        componentData.lightIntensity = 0;
      }
      this.handleLightIntensity(roomImage, componentData.lightIntensity);
    } else {
      console.warn('Room image not found for brightness adjustment');
    }

    this.displayNotification(
      `${componentData.name} light turned ${componentData.isLightOn ? 'on' : 'off'}`,
      'beforeend',
      document.body
    );
  }

  handleLightIntensitySlider(slider: HTMLInputElement, value: string): void {
    const componentData = this.getComponentData(slider, '.rooms', 'p');
    if (!componentData) {
      console.warn('Component data not found for slider');
      return;
    }

    componentData.lightIntensity = Number(value);
    const roomContainer = slider.closest('.rooms') as HTMLElement;
    const roomImage = roomContainer ? roomContainer.querySelector('img') as HTMLImageElement : null;
    if (!roomImage) {
      console.warn('Room image not found for brightness adjustment');
      return;
    }

    this.handleLightIntensity(roomImage, componentData.lightIntensity);
    this.displayNotification(
      `${componentData.name} light intensity set to ${value}`,
      'beforeend',
      document.body
    );
  }

  setupNotificationClose(): void {
    document.addEventListener('click', (e: Event) => {
      if ((e.target as HTMLElement).closest('.close-notification')) {
        const notification = (e.target as HTMLElement).closest('.notification') as HTMLElement;
        if (notification) {
          notification.style.animation = 'fadeOut 0.3s ease-out';
          setTimeout(() => notification.remove(), 300);
        }
      }
    });
  }
}

export default Light;