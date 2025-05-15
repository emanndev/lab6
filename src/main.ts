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

const homepageButton = document.querySelector('.entry_point') as HTMLElement;
const homepage = document.querySelector('main') as HTMLElement;
const mainRoomsContainer = document.querySelector('.application_container') as HTMLElement;
const advanceFeaturesContainer = document.querySelector('.advanced_features_container') as HTMLElement;
const nav = document.querySelector('nav') as HTMLElement;
const loader = document.querySelector('.loader-container') as HTMLElement;
const generalLightSwitch = document.querySelector('.general_light_switch') as HTMLElement;

const wifiController = new WifiController();
console.log('wifiController instantiated:', wifiController);
if (!wifiController) {
  console.error('Failed to instantiate wifiController');
}
const lightController = new Light(wifiController);
const advancedSettings = new AdvanceSettings(wifiController);

try {
  wifiController.init();
  lightController.setupNotificationClose();
} catch (error) {
  console.error('Initialization error:', error);
}

let selectedComponent: ComponentData | null;
let isWifiActive: boolean = true;

function initializeComponentElements(): void {
  try {
    Object.values(lightController.componentsData).forEach((comp: ComponentData) => {
      advancedSettings.setComponentElement(comp);
      console.log(`Initialized element for ${comp.name}:`, comp.element);
      if (!comp.element) {
        console.warn(`Failed to set element for ${comp.name}`);
      }
    });
    updateGeneralLightSwitchIcon();
  } catch (error) {
    console.error('Error in initializeComponentElements:', error);
  }
}

function updateGeneralLightSwitchIcon(): void {
  const allLightsOn = Object.values(lightController.componentsData).every((comp: ComponentData) => comp.isLightOn);
  const generalIcon = generalLightSwitch.querySelector('img') as HTMLImageElement;
  if (generalIcon) {
    generalIcon.src = allLightsOn ? './assets/svgs/light_bulb.svg' : './assets/svgs/light_bulb_off.svg';
  }
}

if (homepageButton) {
  homepageButton.addEventListener('click', function(e: Event) {
    console.log('Homepage button clicked');
    if (!homepage || !loader || !mainRoomsContainer || !nav) {
      console.error('Missing elements:', { homepage, loader, mainRoomsContainer, nav });
      return;
    }

    try {
      homepage.style.display = 'none';
      loader.style.display = 'flex';
      console.log('Homepage hidden, loader shown');

      setTimeout(() => {
        console.log('Timeout triggered');
        loader.style.display = 'none';
        mainRoomsContainer.style.display = 'flex';
        nav.style.display = 'flex';
        mainRoomsContainer.classList.remove('hidden');
        nav.classList.remove('hidden');
        console.log('Container display:', mainRoomsContainer.style.display, 'Class:', mainRoomsContainer.classList);
        console.log('Nav display:', nav.style.display, 'Class:', nav.classList);
        initializeComponentElements();
      }, 1000);
    } catch (error) {
      console.error('Error in homepage button handler:', error);
    }
  });
} else {
  console.error('Homepage button not found');
}

if (generalLightSwitch) {
  generalLightSwitch.addEventListener('click', function(e: Event) {
    console.log('General light switch clicked, Wi-Fi status:', {
      isWifiActive: wifiController.isWifiActive,
      currentConnection: wifiController.currentConnection
    });
    if (!wifiController.isWifiActive || !wifiController.currentConnection) {
      lightController.displayNotification('Cannot control lights - no Wi-Fi connection', 'beforeend', document.body);
      return;
    }

    const generalIcon = generalLightSwitch.querySelector('img') as HTMLImageElement;
    const isTurningOn = generalIcon.src.includes('light_bulb_off.svg');

    Object.values(lightController.componentsData).forEach((comp: ComponentData) => {
      comp.isLightOn = isTurningOn;
      comp.lightIntensity = isTurningOn ? 5 : 0;
      const lightSwitch = comp.element;
      const roomContainer = lightSwitch?.closest('.rooms') as HTMLElement;
      const roomImage = roomContainer?.querySelector('img') as HTMLImageElement;
      console.log(`Updating ${comp.name}: isLightOn=${comp.isLightOn}, lightIntensity=${comp.lightIntensity}`);
      if (lightSwitch) {
        const lightImg = lightSwitch.querySelector('img') as HTMLImageElement;
        if (lightImg) {
          lightImg.src = comp.isLightOn ? lightImg.dataset.lighton || './assets/svgs/light_bulb.svg' : './assets/svgs/light_bulb_off.svg';
        } else {
          console.warn(`No image found in light switch for ${comp.name}`);
        }
      } else {
        console.warn(`No light switch element for ${comp.name}`);
      }
      if (roomImage) {
        lightController.handleLightIntensity(roomImage, comp.lightIntensity);
      } else {
        console.warn(`No room image found for ${comp.name}`);
      }
    });

    if (generalIcon) {
      generalIcon.src = isTurningOn ? './assets/svgs/light_bulb.svg' : './assets/svgs/light_bulb_off.svg';
    }

    lightController.displayNotification(
      `All lights turned ${isTurningOn ? 'on' : 'off'}`,
      'beforeend',
      document.body
    );
  });
} else {
  console.error('General light switch not found');
}

if (mainRoomsContainer) {
  mainRoomsContainer.addEventListener('click', (e: Event) => {
    const selectedElement = e.target as HTMLElement;

    if (selectedElement.closest(".light-switch")) {
      const lightSwitch = selectedElement.closest(".basic_settings_buttons")?.firstElementChild as HTMLElement;
      if (lightSwitch) {
        lightController.toggleLightSwitch(lightSwitch);
      }
      return;
    }

    if (selectedElement.closest('.advance-settings_modal')) {
      const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal') as HTMLElement;
      advancedSettings.modalPopUp(advancedSettingsBtn);
    }
  });

  mainRoomsContainer.addEventListener('change', (e: Event) => {
    const slider = e.target as HTMLInputElement;
    const value = slider.value;
    console.log('Slider changed:', slider, 'Value:', value);
    lightController.handleLightIntensitySlider(slider, value);
  });
} else {
  console.error('Main rooms container not found');
}

if (advanceFeaturesContainer) {
  advanceFeaturesContainer.addEventListener('click', (e: Event) => {
    const selectedElement = e.target as HTMLElement;

    if (selectedElement.closest('.close-btn')) {
      advancedSettings.closeModalPopUp();
    }

    if (selectedElement.closest('.customization-btn')) {
      advancedSettings.displayCustomization(selectedElement);
    }

    if (selectedElement.matches('.defaultOn-okay')) {
      advancedSettings.customizeAutomaticOnPreset(selectedElement);
    }
    
    if (selectedElement.matches('.defaultOff-okay')) {
      advancedSettings.customizeAutomaticOffPreset(selectedElement);
    }

    if (selectedElement.textContent?.includes("Cancel")) {
      if (selectedElement.matches('.defaultOn-cancel')) {
        advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
      } else if (selectedElement.matches('.defaultOff-cancel')) {
        advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
      }
    }
  });
} else {
  console.error('Advance features container not found');
}