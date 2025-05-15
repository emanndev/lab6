import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;

declare global {
  var Chart: jest.Mock;
}

global.Chart = jest.fn().mockImplementation((ctx, config) => ({
  destroy: jest.fn(),
  update: jest.fn(),
  data: config.data,
}));