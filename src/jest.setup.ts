import { TextEncoder, TextDecoder } from 'util';

     global.TextEncoder = TextEncoder;
     global.TextDecoder = TextDecoder as any;

     // Extend global type to include Chart
     declare global {
       // eslint-disable-next-line no-var
       var Chart: jest.Mock;
     }

     // Mock Chart.js
     global.Chart = jest.fn().mockImplementation(() => ({
       destroy: jest.fn(),
     }));