'use strict';
const assert = require('node:assert/strict');
const http = require('node:http');
const {fixture} = require('./browser-regression.cjs');
const {inspectDOM} = require('../skills/kinesis-design-studio/scripts/dom-probe.cjs');

(async () => {
  const {chromium, devices} = require('playwright');
  const server = http.createServer((request, response) => response.end(fixture('fixed')));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  try {
    for (const name of ['iPhone 12 Pro Max landscape', 'iPhone 14 Plus landscape']) {
      const {defaultBrowserType, ...options} = devices[name];
      const context = await browser.newContext(options);
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(inspectDOM, {controls: [{selector: '#cta'}]});
      assert.ok(!result.issues.some(issue => issue.code === 'occluded-control'), name);
      await context.close();
    }
    console.log('Fractional viewport-edge hit-test regression passed for both landscape profiles.');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
