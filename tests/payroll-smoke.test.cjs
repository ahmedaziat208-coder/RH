const test = require('node:test');
const assert = require('node:assert/strict');

test('payroll month format is valid', () => {
  assert.match('2026-10', /^\d{4}-(0[1-9]|1[0-2])$/);
});
