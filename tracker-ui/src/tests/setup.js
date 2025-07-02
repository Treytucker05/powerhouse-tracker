// Vitest setup file
import { vi, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Make vi globally available
globalThis.vi = vi;

// Stub console.error to prevent noise in test output
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Mock DOM methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.sessionStorage = sessionStorageMock;

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
