import WifiController from './WifiConfig';

describe('WifiController', () => {
  let wifiController: WifiController;

  beforeEach(() => {
    wifiController = new WifiController();
    document.body.innerHTML = `
      <div class="wifi-container">
        <img src="" alt="Wifi status">
      </div>
      <div class="wifi_connection_list_container"></div>
    `;
  });

  test('constructor initializes with default values', () => {
    expect(wifiController.isWifiActive).toBe(false);
    expect(wifiController.currentConnection).toBeNull();
    expect(wifiController.connectionList).toHaveLength(3);
  });



  test('connectToNetwork rejects for weak signal', async () => {
    await expect(wifiController.connectToNetwork('Neighbor-WiFi')).rejects.toBe(
      'Cannot connect to Neighbor-WiFi: Poor signal strength.'
    );
  });

  test('connectToNetwork rejects for unknown connection', async () => {
    await expect(wifiController.connectToNetwork('Unknown')).rejects.toBe('Connection not found.');
  });

  test('renderConnections generates correct HTML', () => {
    wifiController.renderConnections();
    const container = document.querySelector('.wifi_connection_list_container') as HTMLElement;
    expect(container.children).toHaveLength(3);
    expect(container.innerHTML).toContain('Home-WiFi');
    expect(container.innerHTML).toContain('wifi_signal_excellent.svg');
  });

  test('init sets up click event listener', () => {
    const spy = jest.spyOn(wifiController, 'renderConnections');
    wifiController.init();
    const wifiContainer = document.querySelector('.wifi-container') as HTMLElement;
    wifiContainer.click();
    expect(spy).toHaveBeenCalled();
  });
});