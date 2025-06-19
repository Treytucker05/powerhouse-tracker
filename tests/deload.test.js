/**
 * @jest-environment jsdom
 */

import * as ts   from "../js/core/trainingState.js";

// ----- isolate global singleton so later test-suites aren't polluted -----
const snapshot = ts.trainingState ? Object.assign({}, ts.trainingState) : {};

beforeEach(() => {
  // start every test with a fresh clone of the pristine snapshot
  if (ts.trainingState) {
    Object.assign(ts.trainingState, Object.assign({}, snapshot));
  }
});

afterAll(() => {
  // restore original once the whole file is done
  if (ts.trainingState) {
    Object.assign(ts.trainingState, snapshot);
  }
});

describe('Deload Analysis', () => {
  test('placeholder test', () => {
    expect(true).toBe(true);
  });
});
