import General from './general';

describe('General', () => {
  let general: General;

  beforeEach(() => {
    general = new General();
    document.body.innerHTML = `
      <div class="rooms">
        <p>Hall</p>
        <button class="light-switch"></button>
      </div>
      <div class="container"></div>
    `;
  });

  test('getComponent returns correct component data', () => {
    const component = general.getComponent('hall');
    expect(component).toBeDefined();
    expect(component?.name).toBe('hall');
    expect(component?.numOfLights).toBe(6);
    expect(component?.isLightOn).toBe(false);
  });

  test('getComponent handles case-insensitive and trimmed input', () => {
    const component = general.getComponent(' HALL ');
    expect(component?.name).toBe('hall');
  });

  test('getComponent returns undefined for unknown component', () => {
    const component = general.getComponent('unknown');
    expect(component).toBeUndefined();
  });

  test('getSelectedComponentName retrieves room name', () => {
    const element = document.querySelector('.light-switch') as HTMLElement;
    const name = general.getSelectedComponentName(element);
    expect(name).toBe('hall');
  });

  test('getSelectedComponentName returns null if no ancestor found', () => {
    const element = document.createElement('button');
    const name = general.getSelectedComponentName(element);
    expect(name).toBeNull();
  });

  test('notification generates correct HTML', () => {
    const html = general.notification('Light turned on');
    expect(html).toContain('notification');
    expect(html).toContain('light_bulb.svg');
    expect(html).toContain('Light turned on');
  });

  test('displayNotification renders and removes notification', async () => {
    const container = document.querySelector('.container') as HTMLElement;
    jest.useFakeTimers();
    general.displayNotification('Test message', 'beforeend', container);
    expect(container.querySelector('.notification')).not.toBeNull();
    jest.advanceTimersByTime(5300);
    expect(container.querySelector('.notification')).toBeNull();
    jest.useRealTimers();
  });

  test('handleLightIntensity updates element brightness', () => {
    const element = document.createElement('img');
    general.handleLightIntensity(element, 5);
    expect(element.style.filter).toBe('brightness(0.7999999999999999)');
  });

});