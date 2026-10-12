'use strict';
(() => {
  const config = window.STORE_CONFIG;
  if (!config || !config.study) return;
  const price = new Intl.NumberFormat('en-US', {style: 'currency', currency: config.currency || 'USD', maximumFractionDigits: 2}).format(config.study.price).replace(/\.00$/, '');
  document.querySelectorAll('[data-brand]').forEach(el => {el.textContent = config.brand;});
  document.querySelectorAll('[data-price]').forEach(el => {el.textContent = price;});
  document.querySelectorAll('[data-year]').forEach(el => {el.textContent = String(new Date().getFullYear());});
  let checkoutReady = false;
  try {
    const url = new URL(config.study.checkoutUrl);
    // Accept only Gumroad HTTPS checkouts. Fail closed on unconfigured or invalid URLs.
    checkoutReady = config.study.checkoutEnabled === true && url.protocol === 'https:' && (url.hostname === 'gumroad.com' || url.hostname.endsWith('.gumroad.com')) && /^\/l\/[^/]+/.test(url.pathname) && !url.username && !url.password;
  } catch (_) { /* An empty checkout URL keeps purchasing disabled. */ }
  if (checkoutReady) {
    document.querySelectorAll('[data-checkout]').forEach(el => {
      el.href = config.study.checkoutUrl;
      el.removeAttribute('aria-disabled');
      el.removeAttribute('tabindex');
      el.textContent = `Get the study — ${price} ↗`;
    });
    document.querySelectorAll('[data-checkout-note]').forEach(el => {el.textContent = 'Continue to Gumroad for delivery details, refund terms and secure checkout.';});
    document.querySelectorAll('[data-price-label]').forEach(el => {el.textContent = 'Launch price';});
    const launchNote = document.querySelector('.study-info > .small');
    if (launchNote) launchNote.textContent = 'Check the free sample before you decide.';
    const delivery = Array.from(document.querySelectorAll('.faq-list details')).find(el => el.querySelector('summary')?.textContent === 'How will I purchase and receive it?');
    if (delivery) delivery.querySelector('p').textContent = 'Purchase through Gumroad. Review the delivery format and refund terms on the product listing before you pay; Gumroad handles checkout and product delivery.';
  }
  document.querySelectorAll('[data-checkout]').forEach(el => {
    el.addEventListener('click', event => {if (!checkoutReady) event.preventDefault();});
  });
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const activateTab = (tab, focus = false) => {
    tabs.forEach(item => {const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;});
    document.querySelectorAll('[data-panel]').forEach(panel => {panel.hidden = panel.dataset.panel !== tab.dataset.tab;});
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {event.preventDefault(); activateTab(tabs[next], true);}
    });
  });
})();
