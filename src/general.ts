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

class General {
  componentsData: { [key: string]: ComponentData } = {
    hall: { name: 'hall', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [22, 11, 12, 10, 12, 17, 22] }, 
    bedroom: { name: 'bedroom', lightIntensity: 5, numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [18, 5, 7, 5, 6, 6, 18] },
    bathroom: { name: 'bathroom', lightIntensity: 5, numOfLights: 1, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [2, 1, 1, 1, 1, 3, 3] },
    'outdoor lights': { name: 'outdoor lights', lightIntensity: 5, numOfLights: 6, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [15, 12, 13, 9, 12, 13, 18] },
    'guest room': { name: 'guest room', lightIntensity: 5, numOfLights: 4, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 10, 3, 9, 5, 5, 18] },
    kitchen: { name: 'kitchen', lightIntensity: 5, numOfLights: 3, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 11, 12, 13, 18] },
    'walkway & corridor': { name: 'walkway & corridor', lightIntensity: 5, numOfLights: 8, isLightOn: false, autoOn: '06:30', autoOff: '22:00', usage: [12, 19, 13, 15, 22, 23, 18] },
  };

  wifiConnections: WifiConnection[] = [
    { id: 0, wifiName: 'Inet service', signal: 'excellent' },
    { id: 1, wifiName: 'Kojo_kwame121', signal: 'poor' },
    { id: 2, wifiName: 'spicyalice', signal: 'good' },
    { id: 3, wifiName: 'virus', signal: 'good' },
  ];

  constructor() {
    this.isLightOn = false;
    this.lightIntensity = 5;
  }

  protected isLightOn: boolean;
  protected lightIntensity: number;

  getComponent(name: string): ComponentData | undefined {
    console.log('Looking up component:', name);
    const normalizedName = name.toLowerCase().replace(/\s+/g, ' ').trim();
    if (this.componentsData[name]) {
      return this.componentsData[name];
    }
    const foundKey = Object.keys(this.componentsData).find(key =>
      key === name || this.componentsData[key].name.toLowerCase() === normalizedName
    );
    return foundKey ? this.componentsData[foundKey] : undefined;
  }

  getWifi(): WifiConnection[] {
    return this.wifiConnections;
  }

  getSelectedComponentName(element: HTMLElement, ancestorIdentifier: string = '.rooms', elementSelector: string = 'p'): string | null {
    const closestAncestor = element.closest(ancestorIdentifier);
    if (!closestAncestor) {
      console.warn('No .rooms ancestor found for element:', element);
      return null;
    }
    const pElement = closestAncestor.querySelector(elementSelector) as HTMLElement;
    if (!pElement) {
      console.warn('No <p> element found in .rooms:', closestAncestor);
      return null;
    }
    const name = pElement.textContent?.toLowerCase().replace(/\s+/g, ' ').trim() || '';
    console.log('Retrieved room name:', name);
    return name;
  }

  getComponentData(element: HTMLElement, ancestorIdentifier: string, childElement: string): ComponentData | null {
    const room = this.getSelectedComponentName(element, ancestorIdentifier, childElement);
    if (!room) {
      console.warn('Room name not retrieved');
      return null;
    }
    const data = this.getComponent(room);
    if (!data) {
      console.warn('Component data not found for room:', room);
    }
    return data || null;
  }

  renderHTML(element: string, position: InsertPosition, container: HTMLElement): void {
    container.insertAdjacentHTML(position, element);
  }

  getNotificationIcon(message: string): string {
    if (message.toLowerCase().includes('light')) {
      return './assets/svgs/light_bulb.svg';
    } else if (message.toLowerCase().includes('wi-fi') || message.toLowerCase().includes('network')) {
      return './assets/svgs/wifi.svg';
    } else {
      return './assets/svgs/info.svg';
    }
  }

  notification(message: string): string {
    const iconSrc = this.getNotificationIcon(message);
    return `
      <div class="notification">
        <div class="notification-content">
          <div class="notification-icon">
            <img src="${iconSrc}" alt="Notification icon">
          </div>
          <p>${message}</p>
        </div>
        <button class="close-notification">
          <img src="./assets/svgs/close.svg" alt="Close notification">
        </button>
      </div>
    `;
  }

  displayNotification(message: string, position: InsertPosition, container: HTMLElement): void {
    const html = this.notification(message);
    this.renderHTML(html, position, container);
    const notification = container.querySelector('.notification:last-child') as HTMLElement;
    if (notification) {
      setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }
  }

  selector(identifier: string): HTMLElement | null {
    return document.querySelector(identifier);
  }

  closestSelector(selectedElement: HTMLElement, ancestorIdentifier: string, childSelector: string): HTMLElement | null {
    const closestAncestor = selectedElement.closest(ancestorIdentifier);
    return closestAncestor ? (closestAncestor.querySelector(childSelector) as HTMLElement) : null;
  }

  handleLightIntensity(element: HTMLElement, lightIntensity: number): void {
    const brightness = 0.1 + (lightIntensity / 10) * 1.4;
    element.style.filter = `brightness(${brightness})`;
  }

  updateComponentData(data: ComponentData): void {
    this.componentsData[data.name] = data;
  }

  updateMarkupValue(element: HTMLElement, value: string): void {
    element.textContent = value;
  }

  toggleHidden(element: HTMLElement): void {
    element.classList.toggle('hidden');
  }

  removeHidden(element: HTMLElement): void {
    element.classList.remove('hidden');
  }

  addHidden(element: HTMLElement): void {
    element.classList.add('hidden');
  }

  setComponentElement(roomData: ComponentData): void {
    let parent: HTMLElement | null;
    if (roomData.name === 'walkway & corridor') {
      parent = this.selector('.corridor');
    } else if (roomData.name === 'guest room') {
      const elementClassName = this.formatTextToClassName(roomData.name);
      parent = this.selector(`.${elementClassName}`);
    } else if (roomData.name === 'outdoor lights') {
      parent = this.selector('.outside_lights');
    } else {
      parent = this.selector(`.${roomData.name}`);
    }
    
    if (!parent) {
      console.warn(`Parent element not found for ${roomData.name}`);
      return;
    }

    const buttonElement = parent.querySelector('.light-switch') as HTMLElement;
    if (!buttonElement) {
      console.warn(`Light switch not found for ${roomData.name}`);
      return;
    }

    if (roomData.element) {
      console.log(`Element already set for ${roomData.name}`);
      return;
    }
    
    roomData.element = buttonElement;
    console.log(`Set element for ${roomData.name}:`, buttonElement);
  }

  formatTextToClassName(name: string): string {
    const words = name.split(' ');
    const newWord = words.join('_');
    return newWord;
  }
}

export default General;