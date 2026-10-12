# Frame Notes storefront

An English-language storefront for independent video studies, built with HTML, CSS and JavaScript. No build step or application server is needed.

## Pages

- `dist/index.html`: storefront and first study.
- `dist/study.html`: product details, scope and Gumroad purchase button.
- `dist/sample.html`: three free editorial examples with accessible tabs.

The examples include original editorial adaptation notes and illustrated diagrams. The site does not contain the complete paid study, captured video assets, private Notion access links or credentials. It makes no retention or performance guarantee. The seller still needs to finalize the paid deliverable and its delivery/refund terms in Gumroad.

## Preview and check

```sh
npm run check
npm run dev
```

Open http://127.0.0.1:4173. Node.js is used for checks and Python 3 for the local static server; no npm dependencies are required. DM Sans is loaded from Google Fonts, with an Arial fallback.

## Connect Gumroad

Edit `dist/config.js`:

```js
checkoutUrl: "https://your-store.gumroad.com/l/your-product",
checkoutEnabled: true
```

Set the price in this file to match the actual Gumroad product. It is currently a planned $19 launch price, not a verified or active offer. A disabled or invalid checkout URL leaves the purchase button inactive. The URL must be a real HTTPS Gumroad `/l/` product URL. Only a public checkout URL belongs here; never put a Gumroad API key or paid Notion delivery link in browser code.

The JavaScript updates launch status, FAQ delivery text and checkout copy when a valid checkout is enabled. Without JavaScript the site remains readable and checkout remains safely disabled.

## Branding and products

`Frame Notes` is a provisional brand. Update `brand` in `dist/config.js`, then update page titles, descriptions, logo accessible labels, cover copy and social artwork to match. To add another analysis, create its product page and card with confirmed contents and its own checkout. Do not advertise undelivered bonuses or invented products.

## Deployment

The included GitHub Actions workflow validates the site and publishes `dist/` to GitHub Pages on pushes to `main`. In repository Settings → Pages, select GitHub Actions as the source. The expected project URL is:

https://doductoanftu2-dotcom.github.io/frame-notes-store/

No secrets are required. Publishing only exposes the marketing pages and free examples, not the complete research library.
