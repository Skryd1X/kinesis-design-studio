'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {analyzeMotion, percentile} = require('../skills/kinesis-design-studio/scripts/motion-metrics.cjs');
const {makeProfiles} = require('../skills/kinesis-design-studio/scripts/profiles.cjs');
const {validateConfig} = require('../skills/kinesis-design-studio/scripts/audit-ui.cjs');

const sample = positions => ({frames: positions.map((x, i) => ({time: i * 16.7, subjects: [{selector: '#subject', x, y: 0}]}))});

test('smooth motion passes a concrete contract', () => {
  const result = analyzeMotion(sample([0, 10, 20, 30, 30, 30]), [{selector: '#subject', maxStepPx: 12, direction: 'increasing', minTravelPx: 25}], {maxFrameMs: 40});
  assert.equal(result.issues.length, 0);
});
test('teleportation and reversal are detected', () => {
  const result = analyzeMotion(sample([0, 2, 160, 20]), [{selector: '#subject', maxStepPx: 30, direction: 'increasing'}]);
  assert.ok(result.issues.some(x => x.code === 'motion-discontinuity'));
  assert.ok(result.issues.some(x => x.code === 'unexpected-motion-reversal'));
});
test('a static subject cannot satisfy required movement', () => {
  assert.ok(analyzeMotion(sample([0, 0, 0]), [{selector: '#subject', minTravelPx: 20}]).issues.length);
});
test('reduced motion catches excursions even when the subject returns to its start', () => {
  const result = analyzeMotion(sample([0, 40, 0]), [{selector: '#subject', maxTravelPx: 1}]);
  assert.ok(result.issues.some(x => x.code === 'motion-travel-exceeded'));
});
test('frame stalls are not averaged away', () => {
  const data = sample([0, 1, 2, 3]); data.frames[3].time = 250;
  assert.ok(analyzeMotion(data, [], {maxFrameMs: 100}).issues.some(x => x.code === 'frame-stall'));
});
test('empty sampling is not a pass', () => assert.ok(analyzeMotion({frames: []}).issues.length));
test('percentiles handle empty and ordered samples', () => {
  assert.equal(percentile([], .95), null); assert.equal(percentile([3, 1, 2], .5), 2);
});
test('breakpoints get both neighbors', () => {
  const profiles = makeProfiles({tier: 'quick', breakpoints: [768]});
  for (const width of [767, 768, 769]) assert.ok(profiles.some(p => p.viewport.width === width));
});
test('full tier includes descriptor registry and intermediate widths', () => {
  const profiles = makeProfiles({tier: 'full', devices: {Phone: {viewport: {width: 390, height: 844}, isMobile: true, defaultBrowserType: 'webkit'}}});
  assert.ok(profiles.some(p => p.deviceName === 'Phone'));
  assert.ok(profiles.filter(p => p.id.startsWith('sweep-')).length > 40);
});
test('invalid breakpoint/profile tiers are refused', () => {
  assert.throws(() => makeProfiles({tier: 'unknown'}));
  assert.throws(() => makeProfiles({breakpoints: [NaN]}));
});
test('remote target requires an explicit origin', () => {
  assert.throws(() => validateConfig({baseURL: 'https://example.com', routes: [{id: 'home', path: '/'}]}));
});
test('redirecting route and unsafe file IDs are refused', () => {
  assert.throws(() => validateConfig({baseURL: 'http://127.0.0.1:3000', routes: [{id: '../bad', path: '/'}]}));
  assert.throws(() => validateConfig({baseURL: 'http://127.0.0.1:3000', routes: [{id: 'home', path: 'https://example.com'}]}));
});
