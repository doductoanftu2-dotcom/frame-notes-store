import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'config.js'), 'utf8'), context);
const config = context.window.STORE_CONFIG;
assert.ok(config.brand && config.study.title, 'Store identity must be configured.');
assert.ok(Number.isFinite(config.study.price) && config.study.price > 0, 'Price must be a positive number.');
assert.doesNotThrow(() => new Intl.NumberFormat('en-US', {style: 'currency', currency: config.currency}));
if (config.study.checkoutEnabled) {
  const url = new URL(config.study.checkoutUrl);
  assert.equal(url.protocol, 'https:');
  assert.ok(url.hostname === 'gumroad.com' || url.hostname.endsWith('.gumroad.com'), 'Use a real Gumroad checkout domain.');
  assert.ok(/^\/l\/[^/]+/.test(url.pathname) && !url.username && !url.password, 'Use the public Gumroad product checkout URL.');
}
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith('.html'));
assert.equal(htmlFiles.length, 3);
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
    const [filePart, fragment] = href.split('#');
    const targetFile = filePart === './' ? 'index.html' : filePart || file;
    const target = path.resolve(root, targetFile);
    assert.ok(target.startsWith(root + path.sep), `Link escapes the site in ${file}`);
    assert.ok(fs.existsSync(target), `Missing ${href} in ${file}`);
    if (fragment) assert.ok(fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`), `Missing anchor ${href} in ${file}`);
  }
  assert.ok(!html.includes('Visual-Hooks-David-Mansilla-3f5b0fc61b1d81b6bb56d2411b708585'), 'Do not expose the full paid source library.');
}
new vm.Script(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
const sample = fs.readFileSync(path.join(root, 'sample.html'), 'utf8');
const controls = [...sample.matchAll(/aria-controls="([^"]+)"/g)].map(match => match[1]);
assert.equal(controls.length, 3);
for (const id of controls) assert.ok(sample.includes(`id="${id}" role="tabpanel"`));
console.log('Passed: 3 pages, local links and anchors, sample tab wiring, configuration, script syntax and paid-library exclusion.');
