import { vi } from 'vitest';

// temporary shim for legacy Jest calls
globalThis.jest = vi;

// ensure ts-node/globals parity if needed
globalThis.afterAll = afterAll;
