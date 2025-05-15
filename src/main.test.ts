// import Light from './basicSettings';
// import AdvanceSettings from './advanceSettings';
// import WifiController from './WifiConfig';

// jest.mock('./basicSettings');
// jest.mock('./advanceSettings');
// jest.mock('./WifiConfig');

// describe('Main', () => {
//   let wifiController: WifiController;
//   let lightController: Light;
//   let advanceSettings: AdvanceSettings;

//   beforeEach(() => {
//     wifiController = new WifiController();
//     lightController = new Light(wifiController);
//     advanceSettings = new AdvanceSettings(wifiController);
//     document.body.innerHTML = `
//       <button class="entry_point"></button>
//       <main></main>
//       <nav class="hidden"></nav>
//       <div class="application_container hidden"></div>
//       <div class="loader-container hidden"></div>
//       <button class="general_light_switch">
//         <img src="./assets/svgs/light_bulb_off.svg" alt="General light switch">
//       </button>
//       <div class="rooms">
//         <p>Hall</p>
//         <button class="light-switch"></button>
//         <button class="advance-settings_modal"></button>
//       </div>
//       <div class="advanced_features_container"></div>
//     `;
//     jest.useFakeTimers();
//   });

//   afterEach(() => {
//     jest.useRealTimers();
//   });

//   test('homepage button shows application container', () => {
//     const homepageButton = document.querySelector('.entry_point') as HTMLElement;
//     homepageButton.click();
//     expect(document.querySelector('main')?.style.display).toBe('none');
//     expect((document.querySelector('.loader-container') as HTMLElement)?.style.display).toBe('flex');
//     jest.advanceTimersByTime(1000);
//     expect((document.querySelector('.application_container') as HTMLElement)?.style.display).toBe('flex');
//     expect(document.querySelector('nav')?.style.display).toBe('flex');
//   });

//   test('general light switch toggles all lights', () => {
//     wifiController.isWifiActive = true;
//     wifiController.currentConnection = { name: 'Home-WiFi', signalStrength: 'Excellent', isSecured: true };
//     const generalSwitch = document.querySelector('.general_light_switch') as HTMLElement;
//     const spy = jest.spyOn(lightController, 'displayNotification');
//     generalSwitch.click();
//     const component = lightController.getComponent('hall')!;
//     expect(component.isLightOn).toBe(true);
//     expect(spy).toHaveBeenCalledWith('All lights turned on', 'beforeend', document.body);
//   });

//   test('room light switch triggers toggleLightSwitch', () => {
//     const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
//     const spy = jest.spyOn(lightController, 'toggleLightSwitch');
//     lightSwitch.click();
//     expect(spy).toHaveBeenCalledWith(lightSwitch);
//   });

//   test('advanced settings button triggers modalPopUp', () => {
//     const modalButton = document.querySelector('.advance-settings_modal') as HTMLElement;
//     const spy = jest.spyOn(advanceSettings, 'modalPopUp');
//     modalButton.click();
//     expect(spy).toHaveBeenCalledWith(modalButton);
//   });
// });