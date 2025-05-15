import AdvanceSettings from './advanceSettings';
import { WifiController } from './types';

describe('AdvanceSettings', () => {
  let advanceSettings: AdvanceSettings;
  let mockWifiController: WifiController;

  beforeEach(() => {
    mockWifiController = {
      isWifiActive: true,
      currentConnection: { name: 'Home-WiFi', signalStrength: 'Excellent', isSecured: true },
      init: jest.fn(),
      connectToNetwork: jest.fn(),
      renderConnections: jest.fn(),
    };
    advanceSettings = new AdvanceSettings(mockWifiController);
    document.body.innerHTML = `
      <div class="rooms">
        <p>Hall</p>
        <button class="light-switch"></button>
      </div>
      <div class="advanced_features_container"></div>
      <canvas id="myChart"></canvas>
    `;
  });

  test('modalPopUp renders advanced settings modal', () => {
    const element = document.querySelector('.rooms') as HTMLElement;
    advanceSettings.modalPopUp(element);
    const modal = document.querySelector('.advanced_features');
    expect(modal).not.toBeNull();
    expect(modal?.innerHTML).toContain('Hall');
    expect(modal?.innerHTML).toContain('Automatic turn on:');
  });

  test('customizeAutomaticOnPreset updates autoOn time', () => {
    document.body.innerHTML += `
      <div class="advanced_features">
        <div class="defaultOn">
          <input type="time" value="07:00">
          <button class="defaultOn-okay"></button>
        </div>
        <p class="component_name">Hall</p>
      </div>
    `;
    const button = document.querySelector('.defaultOn-okay') as HTMLElement;
    advanceSettings.customizeAutomaticOnPreset(button);
    const component = advanceSettings.getComponent('hall')!;
    expect(component.autoOn).toBe('07:00');
  });

  test('customizeAutomaticOnPreset rejects invalid time', () => {
    document.body.innerHTML += `
      <div class="advanced_features">
        <div class="defaultOn">
          <input type="time" value="">
          <button class="defaultOn-okay"></button>
        </div>
        <p class="component_name">Hall</p>
      </div>
    `;
    const button = document.querySelector('.defaultOn-okay') as HTMLElement;
    const spy = jest.spyOn(advanceSettings, 'displayNotification');
    advanceSettings.customizeAutomaticOnPreset(button);
    expect(spy).toHaveBeenCalledWith('Please select a valid time.', 'beforeend', document.body);
  });

  test('initAutoLightControl toggles light at correct time', () => {
    jest.useFakeTimers();
    const component = advanceSettings.getComponent('hall')!;
    component.autoOn = '10:00';
    component.element = document.querySelector('.light-switch') as HTMLElement;
    advanceSettings.initAutoLightControl();
    jest.setSystemTime(new Date('2025-05-15T10:00:00Z'));
    jest.advanceTimersByTime(60000);
    expect(component.isLightOn).toBe(true);
    expect(component.lightIntensity).toBe(5);
    jest.useRealTimers();
  });
});