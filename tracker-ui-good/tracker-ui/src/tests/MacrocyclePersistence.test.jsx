import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveMacrocycle, loadMacrocycle, loadAllMacrocycles, deleteMacrocycle } from '../lib/storage';

// Mock localStorage for testing
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: vi.fn(() => 'test-uuid-123'),
    },
});

describe('Macrocycle Persistence', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('saveMacrocycle', () => {
        it('should save macrocycle to localStorage and return ID', async () => {
            const macrocycleData = {
                name: 'Test Macrocycle',
                blocks: [{ id: 1, name: 'Block 1' }],
                selectedTemplate: 'hypertrophy_12',
            };

            const savedId = await saveMacrocycle(macrocycleData);

            expect(savedId).toBe('test-uuid-123');
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'macro_test-uuid-123',
                expect.stringContaining('"name":"Test Macrocycle"')
            );
        });

        it('should use existing ID if provided', async () => {
            const macrocycleData = {
                id: 'existing-id',
                name: 'Test Macrocycle',
                blocks: [],
            };

            const savedId = await saveMacrocycle(macrocycleData);

            expect(savedId).toBe('existing-id');
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'macro_existing-id',
                expect.stringContaining('"id":"existing-id"')
            );
        });
    });

    describe('loadMacrocycle', () => {
        it('should load macrocycle from localStorage', async () => {
            const mockData = {
                id: 'test-id',
                name: 'Test Macrocycle',
                blocks: [{ id: 1, name: 'Block 1' }],
            };

            localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

            const result = await loadMacrocycle('test-id');

            expect(localStorageMock.getItem).toHaveBeenCalledWith('macro_test-id');
            expect(result).toEqual(mockData);
        });

        it('should return null if macrocycle not found', async () => {
            localStorageMock.getItem.mockReturnValue(null);

            const result = await loadMacrocycle('non-existent-id');

            expect(result).toBeNull();
        });
    });

    describe('loadAllMacrocycles', () => {
        it('should load all macrocycles from localStorage', async () => {
            const mockKeys = ['macro_id1', 'macro_id2', 'other_key', 'macro_id3'];
            const mockMacrocycles = [
                { id: 'id1', name: 'Macro 1', updatedAt: 3 },
                { id: 'id2', name: 'Macro 2', updatedAt: 2 },
                { id: 'id3', name: 'Macro 3', updatedAt: 1 },
            ];

            // Provide localStorage length/key iteration
            localStorageMock.length = mockKeys.length;
            localStorageMock.key = vi.fn(i => mockKeys[i] || null);

            // Map each macro key to its JSON; non-macro returns null
            localStorageMock.getItem.mockImplementation((k) => {
                const idx = mockKeys.indexOf(k);
                if (k.startsWith('macro_')) {
                    if (k.endsWith('id1')) return JSON.stringify(mockMacrocycles[0]);
                    if (k.endsWith('id2')) return JSON.stringify(mockMacrocycles[1]);
                    if (k.endsWith('id3')) return JSON.stringify(mockMacrocycles[2]);
                }
                return null;
            });

            const result = await loadAllMacrocycles();
            expect(result.map(r => r.id)).toEqual(['id1', 'id2', 'id3']);
        });
    });

    describe('deleteMacrocycle', () => {
        it('should remove macrocycle from localStorage', async () => {
            await deleteMacrocycle('test-id');

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('macro_test-id');
        });
    });
});
