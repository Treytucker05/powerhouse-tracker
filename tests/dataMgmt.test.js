/**
 * @jest-environment jsdom
 */

import * as ts from "../js/core/trainingState.js";
import { exportAllData, exportChart, createBackup, autoBackup, importData, exportFeedback } from "../js/algorithms/dataExport.js";
import { mockTrainingState, resetMockTrainingState } from "../__tests__/helpers/mockState.js";
import { vi } from 'vitest';

// Mock file system operations for testing
global.URL = {
  createObjectURL: vi.fn(() => 'mock-object-url'),
  revokeObjectURL: vi.fn()
};

global.Blob = vi.fn((content, options) => ({
  content,
  options,
  size: content[0].length,
  type: options.type
}));

// Mock DOM elements
document.createElement = vi.fn((tagName) => {
  const element = {
    tagName: tagName.toUpperCase(),
    click: vi.fn(),
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
    style: {},
    href: '',
    download: ''
  };
  
  if (tagName === 'input') {
    element.type = '';
    element.files = [];
    element.onchange = null;
  }
    return element;
});

vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

// ----- isolate global singleton so later test-suites aren't polluted -----
const snapshot = ts.trainingState ? Object.assign({}, ts.trainingState) : {};

beforeEach(() => {
  // start every test with a fresh clone of the pristine snapshot
  if (ts.trainingState) {
    Object.assign(ts.trainingState, Object.assign({}, snapshot));
  }
  
  // Reset mocks
  vi.clearAllMocks();
});

afterAll(() => {
  // restore original once the whole file is done
  if (ts.trainingState) {
    Object.assign(ts.trainingState, snapshot);
  }
});

describe('Data Management Algorithm Tests', () => {
  beforeEach(() => {
    resetMockTrainingState();
  });

  describe('exportAllData', () => {
    test('should export all training data as JSON', () => {
      const result = exportAllData(mockTrainingState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('format', 'json');
      expect(result).toHaveProperty('size');
      
      expect(result.filename).toContain('powerhouse-export');
      expect(result.filename).toContain('.json');
      expect(typeof result.size).toBe('number');
    });

    test('should include all training state data', () => {
      const result = exportAllData(mockTrainingState);
      
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('currentMesocycle');
      expect(result.data).toHaveProperty('weeklyProgram');
      expect(result.data).toHaveProperty('volumeLandmarks');
      expect(result.data).toHaveProperty('exportMetadata');
    });

    test('should include export metadata', () => {
      const result = exportAllData(mockTrainingState);
      
      expect(result.data.exportMetadata).toHaveProperty('exportDate');
      expect(result.data.exportMetadata).toHaveProperty('version');
      expect(result.data.exportMetadata).toHaveProperty('dataIntegrity');
      
      expect(typeof result.data.exportMetadata.exportDate).toBe('string');
      expect(typeof result.data.exportMetadata.version).toBe('string');
    });

    test('should handle empty training state', () => {
      const emptyState = {};
      const result = exportAllData(emptyState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    test('should create downloadable file', () => {
      const result = exportAllData(mockTrainingState);
      
      expect(global.Blob).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('exportChart', () => {
    const mockChartData = {
      type: 'volume-progression',
      muscle: 'chest',
      data: [
        { week: 1, volume: 12 },
        { week: 2, volume: 14 },
        { week: 3, volume: 16 }
      ]
    };

    test('should export chart as SVG', () => {
      const result = exportChart(mockChartData, { format: 'svg' });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('format', 'svg');
      expect(result).toHaveProperty('filename');
      
      expect(result.filename).toContain('chart');
      expect(result.filename).toContain('.svg');
    });

    test('should export chart as PNG', () => {
      const result = exportChart(mockChartData, { format: 'png' });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('format', 'png');
      expect(result).toHaveProperty('filename');
      
      expect(result.filename).toContain('.png');
    });

    test('should include chart metadata', () => {
      const result = exportChart(mockChartData, { format: 'svg' });
      
      expect(result).toHaveProperty('chartInfo');
      expect(result.chartInfo).toHaveProperty('type');
      expect(result.chartInfo).toHaveProperty('dataPoints');
      expect(result.chartInfo).toHaveProperty('muscle');
      
      expect(result.chartInfo.type).toBe('volume-progression');
      expect(result.chartInfo.muscle).toBe('chest');
    });

    test('should handle invalid chart data', () => {
      const invalidData = { type: 'unknown' };
      const result = exportChart(invalidData, { format: 'svg' });
      
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('createBackup', () => {
    const mockTrainingState = {
      currentMesocycle: { currentWeek: 3, length: 6 },
      weeklyProgram: { actualVolume: { chest: [12, 14, 16] } },
      volumeLandmarks: { chest: { mv: 8, mev: 10, mav: 16, mrv: 20 } }
    };

    test('should create compressed backup', () => {
      const result = createBackup(mockTrainingState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('backupId');
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('size');
      expect(result).toHaveProperty('compression');
      
      expect(result.filename).toContain('backup');
      expect(typeof result.backupId).toBe('string');
      expect(typeof result.compression).toBe('object');
    });

    test('should include backup metadata', () => {
      const result = createBackup(mockTrainingState);
      
      expect(result).toHaveProperty('metadata');
      expect(result.metadata).toHaveProperty('created');
      expect(result.metadata).toHaveProperty('version');
      expect(result.metadata).toHaveProperty('checksum');
      
      expect(typeof result.metadata.created).toBe('string');
      expect(typeof result.metadata.checksum).toBe('string');
    });

    test('should compress data efficiently', () => {
      const result = createBackup(mockTrainingState);
      
      expect(result.compression).toHaveProperty('originalSize');
      expect(result.compression).toHaveProperty('compressedSize');
      expect(result.compression).toHaveProperty('ratio');
      
      expect(result.compression.compressedSize).toBeLessThanOrEqual(result.compression.originalSize);
      expect(result.compression.ratio).toBeGreaterThan(0);
      expect(result.compression.ratio).toBeLessThanOrEqual(1);
    });
  });

  describe('autoBackup', () => {
    const mockTrainingState = {
      currentMesocycle: { currentWeek: 3, length: 6 },
      weeklyProgram: { actualVolume: { chest: [12, 14, 16] } },
      dataManagement: {
        autoBackupEnabled: true,
        lastBackup: null
      }
    };

    test('should create automatic backup when enabled', () => {
      const result = autoBackup(mockTrainingState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('backupCreated', true);
      expect(result).toHaveProperty('nextBackup');
      
      expect(typeof result.nextBackup).toBe('string');
    });

    test('should skip backup when disabled', () => {
      const disabledState = {
        ...mockTrainingState,
        dataManagement: { autoBackupEnabled: false }
      };
      
      const result = autoBackup(disabledState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('backupCreated', false);
      expect(result).toHaveProperty('reason');
      
      expect(result.reason).toContain('disabled');
    });

    test('should respect backup frequency limits', () => {
      const recentBackupState = {
        ...mockTrainingState,
        dataManagement: {
          autoBackupEnabled: true,
          lastBackup: new Date().toISOString() // Very recent backup
        }
      };
      
      const result = autoBackup(recentBackupState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('backupCreated', false);
      expect(result).toHaveProperty('reason');
      
      expect(result.reason).toContain('recent');
    });
  });

  describe('importData', () => {
    const mockFileContent = JSON.stringify({
      currentMesocycle: { currentWeek: 2, length: 6 },
      weeklyProgram: { actualVolume: { chest: [10, 12] } },
      volumeLandmarks: { chest: { mv: 8, mev: 10, mav: 16, mrv: 20 } },
      exportMetadata: {
        version: '0.9.0-beta',
        exportDate: '2024-01-01T00:00:00.000Z'
      }
    });

    test('should import valid data successfully', () => {
      const result = importData(mockFileContent);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('importedData');
      expect(result).toHaveProperty('validation');
      
      expect(result.importedData).toHaveProperty('currentMesocycle');
      expect(result.importedData).toHaveProperty('weeklyProgram');
      expect(result.importedData).toHaveProperty('volumeLandmarks');
    });

    test('should validate imported data structure', () => {
      const result = importData(mockFileContent);
      
      expect(result.validation).toHaveProperty('isValid', true);
      expect(result.validation).toHaveProperty('version');
      expect(result.validation).toHaveProperty('compatibility');
      
      expect(typeof result.validation.compatibility).toBe('string');
    });

    test('should handle invalid JSON', () => {
      const invalidJson = '{ invalid json content';
      const result = importData(invalidJson);
      
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
      expect(result.error).toContain('JSON');
    });

    test('should handle version incompatibility', () => {
      const oldVersionData = JSON.stringify({
        exportMetadata: { version: '0.1.0' },
        someOldData: 'value'
      });
      
      const result = importData(oldVersionData);
      
      expect(result).toHaveProperty('validation');
      expect(result.validation).toHaveProperty('compatibility');
    });

    test('should provide data transformation warnings', () => {
      const partialData = JSON.stringify({
        currentMesocycle: { currentWeek: 1 },
        // Missing other required fields
        exportMetadata: { version: '0.9.0-beta' }
      });
      
      const result = importData(partialData);
      
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('exportFeedback', () => {
    const mockTrainingState = {
      currentMesocycle: { currentWeek: 3, length: 6 },
      weeklyProgram: {
        actualVolume: { chest: [12, 14, 16] },
        sessions: [
          {
            date: '2024-01-01',
            exercises: ['Bench Press', 'Incline Press'],
            feedback: { difficulty: 8, satisfaction: 7 }
          }
        ]
      }
    };

    test('should export feedback data as CSV', () => {
      const result = exportFeedback(mockTrainingState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('format', 'csv');
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('rows');
      
      expect(result.filename).toContain('feedback');
      expect(result.filename).toContain('.csv');
      expect(typeof result.rows).toBe('number');
    });

    test('should include session feedback metrics', () => {
      const result = exportFeedback(mockTrainingState);
      
      expect(result).toHaveProperty('data');
      expect(typeof result.data).toBe('string');
      expect(result.data).toContain('date');
      expect(result.data).toContain('difficulty');
      expect(result.data).toContain('satisfaction');
    });

    test('should handle missing feedback data', () => {
      const noFeedbackState = {
        currentMesocycle: { currentWeek: 1 },
        weeklyProgram: { actualVolume: {} }
      };
      
      const result = exportFeedback(noFeedbackState);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('warnings');
      expect(result.warnings).toContain('No feedback data found');
    });
  });

  describe('Integration Tests', () => {
    test('should support complete data lifecycle', () => {
      const originalState = {
        currentMesocycle: { currentWeek: 3, length: 6 },
        weeklyProgram: { actualVolume: { chest: [12, 14, 16] } },
        volumeLandmarks: { chest: { mv: 8, mev: 10, mav: 16, mrv: 20 } }
      };
      
      // 1. Export data
      const exportResult = exportAllData(originalState);
      expect(exportResult.success).toBe(true);
      
      // 2. Create backup
      const backupResult = createBackup(originalState);
      expect(backupResult.success).toBe(true);
      
      // 3. Import the exported data
      const importResult = importData(JSON.stringify(exportResult.data));
      expect(importResult.success).toBe(true);
      
      // 4. Verify data integrity
      expect(importResult.importedData.currentMesocycle.currentWeek).toBe(3);
      expect(importResult.importedData.volumeLandmarks.chest.mv).toBe(8);
    });

    test('should handle auto-backup workflow', () => {
      const state = {
        currentMesocycle: { currentWeek: 1, length: 6 },
        dataManagement: { autoBackupEnabled: true, lastBackup: null }
      };
      
      // Enable auto-backup
      const autoResult = autoBackup(state);
      expect(autoResult.success).toBe(true);
      expect(autoResult.backupCreated).toBe(true);
      
      // Subsequent call should respect frequency limits
      const updatedState = {
        ...state,
        dataManagement: {
          autoBackupEnabled: true,
          lastBackup: new Date().toISOString()
        }
      };
      
      const secondResult = autoBackup(updatedState);
      expect(secondResult.success).toBe(true);
      expect(secondResult.backupCreated).toBe(false);
    });
  });
});
