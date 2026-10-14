'use strict';
/** End-to-end synthetic defect injection and repaired-variant verification. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const {runAudit} = require('../skills/kinesis-design-studio/scripts/audit-ui.cjs');
const {makeProfiles} = require('../skills/kinesis-design-studio/scripts/profiles.cjs');

function fixture(mode) {
  const brokenLayout = mode === 'layout', brokenMotion = mode === 'motion';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Kinesis Motion Lab</title>
  <style>*{box-sizing:border-box}body{margin:0;background:#f4f1eb;color:#24241f;font-family:Arial,sans-serif}header{padding:24px 6%;display:flex;justify-content:space-between;border-bottom:1px solid #c9c7bf}.brand{letter-spacing:.14em;font-size:13px}main{width:min(88%,1000px);margin:0 auto;padding:44px 0}h1{font:clamp(44px,7vw,88px)/.98 Georgia,serif;letter-spacing:-.045em;margin:24px 0}p{line-height:1.65;max-width:540px;color:#62625b}.hero{text-align:center}.hero p{margin:20px auto}.cta{display:block;position:relative;margin:28px auto;width:180px;height:48px;background:rgb(36,36,31);color:white;border:0;border-radius:0;cursor:pointer}.cta:focus-visible,#play:focus-visible{outline:3px solid #9c6f3d;outline-offset:4px}.lab{margin-top:42px;border-top:1px solid #c9c7bf;padding-top:24px}#play{padding:12px 20px;background:transparent;border:1px solid #777;cursor:pointer;min-height:44px}.track{height:76px;position:relative;margin-top:20px;border-bottom:1px solid #c9c7bf}#subject{width:36px;height:36px;background:#9c6f3d;transform:translateX(0)}.decoration{pointer-events:none;position:fixed;inset:0;z-index:-1}.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}.tile{padding:18px 0;border-top:1px solid #c9c7bf}small{display:block;margin-top:8px;color:#62625b}.footer{margin-top:44px;font-size:12px;color:#62625b}@media(max-width:600px){main{padding-top:30px}.tiles{grid-template-columns:1fr}.hero{text-align:left}.hero p{margin-left:0}.hero .cta{margin-left:0}}@media(prefers-color-scheme:dark){body{background:#151612;color:#edece5}p,small,.footer{color:#bdbcb3}.cta{background:rgb(36,36,31);border:1px solid #aaa}}${brokenLayout ? '.secondary .cta{background:rgb(255,0,0);margin-left:0;width:260px}.hero{width:1200px}.decoration{z-index:999;pointer-events:auto;background:rgba(0,0,0,.02)}' : ''}</style></head>
  <body class="secondary"><header><span class="brand">KINESIS</span><span>Motion Lab</span></header><div class="decoration" data-design-decoration></div><main><section class="hero" id="hero"><h1>Craft in<br>motion.</h1><p>Expressive design. Precise movement. Every action stays clear, responsive and within reach.</p><button class="cta" id="cta" data-design-critical>Explore collection</button></section><section class="lab"><button id="play">Play motion</button><div class="track"><div id="subject" data-design-motion></div></div><div class="tiles"><div class="tile">Composition<small>Purposeful hierarchy</small></div><div class="tile">Movement<small>Continuity and rhythm</small></div><div class="tile">Verification<small>Evidence before acceptance</small></div></div></section><div class="footer" id="feedback">Ready for interaction.</div></main>
  <script>document.querySelector('#cta').onclick=()=>document.querySelector('#feedback').textContent='Collection opened.';document.querySelector('#play').onclick=()=>{const n=document.querySelector('#subject');n.style.transform='translateX(0)';if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;${brokenMotion ? "setTimeout(()=>n.style.transform='translateX(160px)',150);setTimeout(()=>{const start=performance.now();while(performance.now()-start<170){}},320);" : "n.animate([{transform:'translateX(0)'},{transform:'translateX(100px)'}],{duration:250,easing:'ease-out',fill:'forwards'});"}};</script></body></html>`;
}

async function main() {
  const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(fixture(request.url.slice(1)));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseURL = `http://127.0.0.1:${server.address().port}`;
  const output = process.env.KINESIS_TEST_OUTPUT ? path.resolve(process.env.KINESIS_TEST_OUTPUT) : fs.mkdtempSync(path.join(os.tmpdir(), 'kinesis-browser-'));
  fs.mkdirSync(output, {recursive: true});
  const contracts = {controls: [{selector: '#cta', required: true, minTargetSize: 44}],
    styles: [{selector: '#cta', properties: {'background-color': 'rgb(36, 36, 31)'}}],
    alignment: [{selector: '#cta', reference: '#hero', mode: 'center-x', tolerancePx: 2, minWidth: 601}]};
  const motion = {durationMs: 800, startActions: [{action: 'click', selector: '#play'}],
    contracts: [{selector: '#subject', maxStepPx: 45, direction: 'increasing', minTravelPx: 60}],
    reducedContracts: [{selector: '#subject', maxTravelPx: 1}], budgets: {maxFrameMs: 120, maxLongTaskMs: 120}};
  try {
    const playwright = require('playwright');
    const bad = await runAudit({baseURL, outputDir: path.join(output, 'injected-defects'),
      profiles: [{id: 'desktop', viewport: {width: 1440, height: 900}}], contracts,
      routes: [{id: 'layout', path: '/layout'}, {id: 'motion', path: '/motion', motion}], recordVideo: true}, playwright);
    const codes = bad.runs.flatMap(run => run.issues.map(issue => issue.code));
    for (const code of ['style-override', 'occluded-control', 'alignment-drift', 'motion-discontinuity', 'frame-stall']) assert.ok(codes.includes(code), `Did not detect ${code}`);
    assert.equal(bad.status, 'failed');
    const overflow = await runAudit({baseURL, outputDir: path.join(output, 'narrow-defect'),
      profiles: [{id: 'phone', viewport: {width: 320, height: 568}}], contracts,
      routes: [{id: 'layout', path: '/layout'}]}, playwright);
    assert.ok(overflow.runs.some(run => run.issues.some(issue => issue.code === 'horizontal-overflow')));
    const profiles = makeProfiles({tier: 'quick', breakpoints: [600, 768, 1024]});
    const fixed = await runAudit({baseURL, outputDir: path.join(output, 'repaired'), profiles, contracts,
      variants: [{id: 'light', colorScheme: 'light'}, {id: 'dark', colorScheme: 'dark'}, {id: 'reduced', reducedMotion: 'reduce'}],
      routes: [{id: 'fixed', path: '/fixed', motion, states: [{id: 'initial', actions: []},
        {id: 'action', actions: [{action: 'click', selector: '#cta'}, {action: 'assert-text', selector: '#feedback', value: 'Collection opened.'}], motion: {...motion, durationMs: 350, contracts: [{selector: '#subject', maxStepPx: 45}], reducedContracts: [{selector: '#subject', maxTravelPx: 1}]}}]}],
      recordVideo: true}, playwright);
    fs.writeFileSync(path.join(output, 'regression-summary.json'), JSON.stringify({detectedCodes: [...new Set(codes)], repairedRuns: fixed.runs.length, repairedStatus: fixed.status}, null, 2));
    assert.equal(fixed.status, 'passed', JSON.stringify(fixed.runs.filter(run => run.status !== 'passed').map(run => ({id:run.id, issues:run.issues})), null, 2));
    if (process.env.KINESIS_FULL_MATRIX === '1') {
      const broadProfiles = makeProfiles({tier: 'full', breakpoints: [600, 768, 1024], devices: playwright.devices});
      const broad = await runAudit({baseURL, outputDir: path.join(output, 'full-screen-matrix'), profiles: broadProfiles,
        contracts, routes: [{id: 'fixed', path: '/fixed', states: [{id:'initial',actions:[]}]}]}, playwright);
      fs.writeFileSync(path.join(output, 'full-matrix-summary.json'), JSON.stringify({profiles: broad.runs.length, status: broad.status}, null, 2));
      assert.equal(broad.status, 'passed', JSON.stringify(broad.runs.filter(run => run.status !== 'passed').map(run => ({id:run.id,issues:run.issues})), null, 2));
      console.log(`Full screen matrix passed: ${broad.runs.length} Chromium-emulated profiles; layout/hit/style checks only.`);
    }
    if (process.env.KINESIS_CROSS_BROWSER === '1') {
      const cross = await runAudit({baseURL, outputDir: path.join(output, 'cross-browser'),
        browsers: ['firefox','webkit'], profiles: [{id:'phone',viewport:{width:390,height:844}},{id:'desktop',viewport:{width:1440,height:900}}],
        contracts, routes:[{id:'fixed',path:'/fixed',motion}]}, playwright);
      assert.equal(cross.status,'passed',JSON.stringify(cross.runs.filter(run=>run.status!=='passed')));
      console.log(`Cross-browser motion checks passed: ${cross.runs.length} runs.`);
    }
    console.log(`Browser regression passed: injected defects detected; ${fixed.runs.length} repaired profile/variant runs passed. Evidence: ${output}`);
  } finally { await new Promise(resolve => server.close(resolve)); }
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = {fixture};
