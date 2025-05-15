import Light from './basicSettings';
import { WifiController } from './types';

describe('Light', () => {
  let light: Light;
  let mockWifiController: WifiController;

  beforeEach(() => {
    mockWifiController = {
      isWifiActive: true,
      currentConnection: { name: 'Home-WiFi', signalStrength: 'Excellent', isSecured: true },
      init: jest.fn(),
      connectToNetwork: jest.fn(),
      renderConnections: jest.fn(),
    };
    light = new Light(mockWifiController);
    document.body.innerHTML = `
      <div class="rooms">
        <p>Hall</p>
        <img src="hall.jpg" alt="Hall image">
        <button class="light-switch">
          <img src="./assets/svgs/light_bulb_off.svg" data-lighton="./assets/svgs/light_bulb.svg" alt="Light switch">
        </button>
      </div>
      <input type="range" class="slider" value="5">
    `;
  });

  test('toggleLightSwitch toggles light state', () => {
    const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
    light.toggleLightSwitch(lightSwitch);
    const component = light.getComponent('hall')!;
    expect(component.isLightOn).toBe(true);
    expect(component.lightIntensity).toBe(5);
    const img = lightSwitch.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('light_bulb.svg');
    const roomImage = document.querySelector('.rooms img') as HTMLImageElement;
    expect(roomImage.style.filter).toBe('brightness(0.8)');
  });

  test('toggleLightSwitch fails without Wi-Fi', () => {
    mockWifiController.isWifiActive = false;
    mockWifiController.currentConnection = null;
    const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
    const spy = jest.spyOn(light, 'displayNotification');
    light.toggleLightSwitch(lightSwitch);
    expect(spy).toHaveBeenCalledWith('Cannot toggle light - no Wi-Fi connection', 'beforeend', document.body);
    const component = light.getComponent('hall')!;
    expect(component.isLightOn).toBe(false);
  });

  test('handleLightIntensitySlider updates intensity', () => {
    const slider = document.querySelector('.slider') as HTMLInputElement;
    light.handleLightIntensitySlider(slider, '7');
    const component = light.getComponent('hall')!;
    expect(component.lightIntensity).toBe(7);
    const roomImage = document.querySelector('.rooms img') as HTMLImageElement;
    expect(roomImage.style.filter).toBe('brightness(1.08)');
  });

  test('setupNotificationClose removes notification on click', () => {
    document.body.innerHTML += `
      <div class="notification">
        <button class="close-notification"></button>
      </div>
    `;
    light.setupNotificationClose();
    const closeButton = document.querySelector('.close-notification') as HTMLElement;
    closeButton.click();
    setTimeout(() => {
      expect(document.querySelector('.notification')).toBeNull();
    }, 300);
  });
});