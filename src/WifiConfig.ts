import General from './general';

interface WifiConnection {
  name: string;
  signalStrength: 'Excellent' | 'Strong' | 'Weak';
  isSecured: boolean;
}

class WifiController extends General {
  isWifiActive: boolean;
  currentConnection: WifiConnection | null;
  connectionList: WifiConnection[];

  constructor() {
    super();
    this.isWifiActive = false;
    this.currentConnection = null;
    this.connectionList = [
      { name: 'Home-WiFi', signalStrength: 'Excellent', isSecured: true },
      { name: 'Guest-WiFi', signalStrength: 'Strong', isSecured: false },
      { name: 'Neighbor-WiFi', signalStrength: 'Weak', isSecured: true }
    ];
    this.initAutoNetworkSwitch();
  }

  init(): void {
    const wifiContainer = this.selector('.wifi-container');
    wifiContainer?.addEventListener('click', (e: Event) => {
      const selectedConnection = (e.target as HTMLElement).closest('.wifi_connections_list');
      if (!selectedConnection) {
        const connectionListContainer = this.selector('.wifi_connection_list_container');
        if (connectionListContainer) {
          this.toggleHidden(connectionListContainer);
          this.renderConnections();
        }
      } else {
        const connectionName = selectedConnection.querySelector('.network-name')?.textContent || '';
        this.connectToNetwork(connectionName).catch((error: string) => {
          this.displayNotification(error, 'beforeend', document.body);
        });
      }
    });
  }

  async connectToNetwork(connectionName: string): Promise<WifiConnection> {
    return new Promise((resolve, reject) => {
      const connection = this.connectionList.find(conn => conn.name === connectionName);
      if (!connection) {
        reject('Connection not found.');
        return;
      }

      if (connection.signalStrength === 'Weak') {
        reject(`Cannot connect to ${connectionName}: Poor signal strength.`);
        return;
      }

      setTimeout(() => {
        this.currentConnection = connection;
        this.isWifiActive = true;
        const wifiImg = this.selector('.wifi-container img') as HTMLImageElement;
        wifiImg.src = './assets/svgs/wifi.svg';
        this.displayNotification(`Connected to Wi-Fi: ${connectionName}`, 'beforeend', document.body);
        const connectionListContainer = this.selector('.wifi_connection_list_container');
        if (connectionListContainer) {
          this.addHidden(connectionListContainer);
        }
        resolve(connection);
      }, 2000);
    });
  }

  initAutoNetworkSwitch(): void {
    setInterval(async () => {
      console.log('Attempting to randomize Wi-Fi connection');
      const strongNetworks = this.connectionList.filter(
        conn => conn.signalStrength === 'Excellent' || conn.signalStrength === 'Strong'
      );
      if (strongNetworks.length === 0) {
        this.displayNotification('No strong or excellent Wi-Fi networks available.', 'beforeend', document.body);
        return;
      }

      const randomIndex = Math.floor(Math.random() * strongNetworks.length);
      const selectedNetwork = strongNetworks[randomIndex].name;
      try {
        await this.connectToNetwork(selectedNetwork);
        console.log(`Switched to network: ${selectedNetwork}`);
      } catch (error) {
        console.log(`Failed to switch to ${selectedNetwork}: ${error}`);
      }
    }, 300000); // Every 5 minutes
  }

  renderConnections(): void {
    const container = this.selector('.wifi_connection_list_container');
    if (!container) {
      console.warn('Wi-Fi connection list container not found');
      return;
    }

    container.innerHTML = '';

    const signalIcons: { [key: string]: string } = {
      'Excellent': 'wifi_signal_excellent.svg',
      'Strong': 'wifi_signal_good.svg',
      'Weak': 'wifi_signal_poor.svg'
    };

    const html = this.connectionList.reduce((acc, curr) => {
      return acc + `
        <div class="wifi_connections_list">
          <p class="network-name">${curr.name}</p>
          <img src="./assets/svgs/${signalIcons[curr.signalStrength]}" alt="${curr.signalStrength} signal">
          <img src="./assets/svgs/${curr.isSecured ? 'wifi_protected' : 'unlock'}.svg" alt="${curr.isSecured ? 'secured' : 'unsecured'} connection">
        </div>`;
    }, '');
    this.renderHTML(html, 'beforeend', container);
  }
}

export default WifiController;