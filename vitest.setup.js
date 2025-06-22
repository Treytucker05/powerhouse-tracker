import { vi } from 'vitest';

import { vi } from 'vitest';

// Provide jest global for legacy specs
globalThis.jest = vi;

// Optional but harmless: expose afterAll on global for parity
globalThis.afterAll = afterAll;

