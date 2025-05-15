import General from './general';
import Light from './basicSettings';
import Chart from 'chart.js/auto';

interface ComponentData {
  name: string;
  lightIntensity: number;
  numOfLights: number;
  isLightOn: boolean;
  autoOn: string;
  autoOff: string;
  usage: number[];
  element?: HTMLElement | null;
  [key: string]: any; // This line is correct, but you may need to ensure "noImplicitAny" is not set to true, or use a more specific type.
}

interface ChartInstance {
  destroy: () => void;
}

class AdvanceSettings extends Light {
  chartInstance: ChartInstance | null;

  constructor(wifiController: any) {
    super(wifiController);
    this.chartInstance = null;
    this.initAutoLightControl();
  }

  #markup(component: ComponentData): string {
    const { name, numOfLights, autoOn, autoOff } = component;
    return `
      <div class="advanced_features">
        <h3>Advanced features</h3>
        <section class="component_summary">
          <div>
            <p class="component_name">${this.capFirstLetter(name)}</p>
            <p class="number_of_lights">${numOfLights}</p>
          </div>
          <div>
            <p class="auto_on">
              <span>Automatic turn on:</span>
              <span>${autoOn}</span>
            </p>
            <p class="auto_off">
              <span>Automatic turn off:</span>
              <span>${autoOff}</span>
            </p>
          </div>
        </section>
        <section class="customization">
          <div class="edit">
            <p>Customize</p>
            <button class="customization-btn">
              <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
            </button>
          </div>
          <section class="customization-details hidden">
            <div>
              <h4>Automatic on/off settings</h4>
              <div class="defaultOn">
                <label for="autoOnTime">Turn on</label>
                <input type="time" name="autoOnTime" id="autoOnTime" value="${autoOn}">
                <div>
                  <button class="defaultOn-okay">Okay</button>
                  <button class="defaultOn-cancel">Cancel</button>
                </div>
              </div>
              <div class="defaultOff">
                <label for="autoOffTime">Go off</label>
                <input type="time" name="autoOffTime" id="autoOffTime" value="${autoOff}">
                <div>
                  <button class="defaultOff-okay">Okay</button>
                  <button class="defaultOff-cancel">Cancel</button>
                </div>
              </div>
            </div>
          </section>
          <section class="summary">
            <h3>Summary</h3>
            <div class="chart-container">
              <canvas id="myChart"></canvas>
            </div>
          </section>
          <button class="close-btn">
            <img src="./assets/svgs/close.svg" alt="close button svg icon">
          </button>
        </section>
      </div>
    `;
  }

  #analyticsUsage(data: number[]): void {
    const ctx = this.selector('#myChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('Chart canvas not found');
      return;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Hours of usage',
          data: data,
          borderColor: 'rgba(255, 214, 0, 1)',
          backgroundColor: 'rgba(255, 214, 0, 0.2)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day of Week'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  modalPopUp(element: HTMLElement): void {
    const selectedRoom = this.getSelectedComponentName(element);
    if (!selectedRoom) return;
    const componentData = this.getComponent(selectedRoom);
    if (!componentData) return;
    const parentElement = this.selector('.advanced_features_container');
    if (!parentElement) return;
    this.removeHidden(parentElement);

    this.renderHTML(this.#markup(componentData), 'afterbegin', parentElement);
    this.#analyticsUsage(componentData.usage);
  }

  displayCustomization(selectedElement: HTMLElement): void {
    const element = this.closestSelector(selectedElement, '.customization', '.customization-details');
    if (element) {
      this.toggleHidden(element);
    }
  }

  closeModalPopUp(): void {
    const parentElement = this.selector('.advanced_features_container');
    const childElement = this.selector('.advanced_features');
    if (childElement) {
      childElement.remove();
    }
    if (parentElement) {
      this.addHidden(parentElement);
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  customizationCancelled(selectedElement: HTMLElement, parentSelectorIdentifier: string): void {
    const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input');
    if (element) {
      (element as HTMLInputElement).value = '';
    }
    const customizationDetails = this.closestSelector(selectedElement, parentSelectorIdentifier, '.customization-details');
    if (customizationDetails) {
      this.addHidden(customizationDetails);
    }
  }

  customizeAutomaticOnPreset(selectedElement: HTMLElement): void {
    const element = this.closestSelector(selectedElement, '.defaultOn', 'input') as HTMLInputElement;
    const { value } = element;

    if (!this.#isValidTime(value)) {
      this.displayNotification('Please select a valid time.', 'beforeend', document.body);
      return;
    }

    const component = this.getComponentData(element, '.advanced_features', '.component_name');
    if (!component) return;
    component.autoOn = value;
    element.value = '';

    const parentElement = this.selector('.advanced_features_container');
    const childElement = this.selector('.advanced_features');
    if (childElement) {
      childElement.remove();
    }
    if (parentElement) {
      this.renderHTML(this.#markup(component), 'afterbegin', parentElement);
      this.#updateUsageData(component);
      this.#analyticsUsage(component.usage);
    }

    this.setComponentElement(component);
    this.displayNotification(`Automatic turn on set to ${value} for ${component.name}.`, 'beforeend', document.body);
  }

  customizeAutomaticOffPreset(selectedElement: HTMLElement): void {
    const element = this.closestSelector(selectedElement, '.defaultOff', 'input') as HTMLInputElement;
    const { value } = element;

    if (!this.#isValidTime(value)) {
      this.displayNotification('Please select a valid time.', 'beforeend', document.body);
      return;
    }

    const component = this.getComponentData(element, '.advanced_features', '.component_name');
    if (!component) return;
    component.autoOff = value;
    element.value = '';

    const parentElement = this.selector('.advanced_features_container');
    const childElement = this.selector('.advanced_features');
    if (childElement) {
      childElement.remove();
    }
    if (parentElement) {
      this.renderHTML(this.#markup(component), 'afterbegin', parentElement);
      this.#updateUsageData(component);
      this.#analyticsUsage(component.usage);
    }

    this.setComponentElement(component);
    this.displayNotification(`Automatic turn off set to ${value} for ${component.name}.`, 'beforeend', document.body);
  }

  getSelectedComponent(componentName?: string): ComponentData | { [key: string]: ComponentData } {
    if (!componentName) return this.componentsData;
    return this.componentsData[componentName.toLowerCase()];
  }

  setNewData(component: string, key: string, data: any): void {
    const selectedComponent = this.componentsData[component.toLowerCase()];
    if (selectedComponent as { [key: string]: any })[key] = data;
  }

  capFirstLetter(word: string): string {
    return word.replace(word[0], word[0].toUpperCase());
  }

  #isValidTime(time: string): boolean {
    return typeof time === 'string' && /^[0-2][0-9]:[0-5][0-9]$/.test(time);
  }

  initAutoLightControl(): void {
    setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      console.log('Checking auto times:', currentTime);

      Object.values(this.componentsData).forEach(comp => {
        if (comp.autoOn === currentTime && !comp.isLightOn) {
          this.#toggleLightAutomatically(comp, true);
        } else if (comp.autoOff === currentTime && comp.isLightOn) {
          this.#toggleLightAutomatically(comp, false);
        }
      });
    }, 60000);
  }

  #toggleLightAutomatically(component: ComponentData, isOn: boolean): void {
    if (!this.wifiController?.isWifiActive || !this.wifiController?.currentConnection) {
      this.displayNotification(`Cannot toggle ${component.name} light automatically - no Wi-Fi connection`, 'beforeend', document.body);
      return;
    }

    component.isLightOn = isOn;
    component.lightIntensity = isOn ? 5 : 0;

    const lightSwitch = component.element;
    if (lightSwitch) {
      const lightImg = lightSwitch.querySelector('img') as HTMLImageElement;
      if (lightImg) {
        lightImg.src = isOn ? lightImg.dataset.lighton || './assets/svgs/light_bulb.svg' : './assets/svgs/light_bulb_off.svg';
      } else {
        console.warn(`No image found in light switch for ${component.name}`);
      }
    } else {
      console.warn(`No light switch element for ${component.name}`);
    }

    const roomContainer = lightSwitch?.closest('.rooms') as HTMLElement;
    const roomImage = roomContainer?.querySelector('img') as HTMLImageElement;
    if (roomImage) {
      this.handleLightIntensity(roomImage, component.lightIntensity);
    } else {
      console.warn(`No room image found for ${component.name}`);
    }

    this.displayNotification(
      `${component.name} light turned ${isOn ? 'on' : 'off'} automatically`,
      'beforeend',
      document.body
    );
  }

  #updateUsageData(component: ComponentData): void {
    const autoOn = component.autoOn.split(':').map(Number);
    const autoOff = component.autoOff.split(':').map(Number);

    let hoursOn: number;
    if (autoOff[0] < autoOn[0] || (autoOff[0] === autoOn[0] && autoOff[1] < autoOn[1])) {
      hoursOn = (24 - autoOn[0] + autoOff[0]) + (autoOff[1] - autoOn[1]) / 60;
    } else {
      hoursOn = (autoOff[0] - autoOn[0]) + (autoOff[1] - autoOn[1]) / 60;
    }

    component.usage = Array(7).fill(Math.round(hoursOn));
  }
}

export default AdvanceSettings;