import Light from './basicSettings';
import { WifiController } from './WifiConfig';

describe('Light', () => {
  let light: Light;
  let wifiController: WifiController;

  beforeEach(() => {
    wifiController = {
      isWifiActive: true,
      currentConnection: { name: 'Home-WiFi', signalStrength: 'Excellent', isSecured: true },
      init: jest.fn(),
      connectToNetwork: jest.fn(),
      renderConnections: jest.fn(),
    };
    light = new Light(wifiController);
    document.body.innerHTML = `
      <div class="rooms">
        <p>hall</p>
        <button class="light-switch"></button>
        <img src="light_bulb.svg" />
        <input type="range" class="intensity-slider" />
      </div>
    `;
  });

  test('toggleLightSwitch toggles light state', () => {
    const button = document.querySelector('.light-switch') as HTMLButtonElement;
    const img = document.querySelector('img') as HTMLImageElement;
    light.toggleLightSwitch(button);
    const component = light.getComponent('hall')!;
    expect(component.isLightOn).toBe(true);
    expect(img.src).toContain('light_bulb.svg');
    const roomImage = document.querySelector('.rooms img') as HTMLImageElement;
    expect(parseFloat(roomImage.style.filter.replace('brightness(', '').replace(')', ''))).toBeCloseTo(0.8, 1);
  });

  test('toggleLightSwitch fails without Wi-Fi', () => {
    wifiController.isWifiActive = false;
    const button = document.querySelector('.light-switch') as HTMLButtonElement;
    light.toggleLightSwitch(button);
    const component = light.getComponent('hall')!;
    expect(component.isLightOn).toBe(false);
  });

  test('handleLightIntensitySlider updates intensity', () => {
    const slider = document.querySelector('.intensity-slider') as HTMLInputElement;
    slider.value = '7';
    light.handleLightIntensitySlider(slider, '7');
    const component = light.getComponent('hall')!;
    expect(component.lightIntensity).toBe(7);
    const roomImage = document.querySelector('.rooms img') as HTMLImageElement;
    expect(roomImage.style.filter).toBe('brightness(1.08)');
  });
});