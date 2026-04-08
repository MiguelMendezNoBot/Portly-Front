import { TextDecoder, TextEncoder } from 'node:util';
Object.assign(globalThis, { TextEncoder, TextDecoder });

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:8080',
      },
    },
  },
  writable: true,
});
