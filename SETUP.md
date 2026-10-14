# Pharmacy website — setup guide

A small, fast website for a village pharmacy in Nepal, plus a very simple stock screen for the shop owners.

| Page | Who uses it | What it does |
|---|---|---|
| `index.html` | Customers | Shop name, open/closed now, Call and WhatsApp buttons, notice, services (BP check, first aid), licence numbers |
| `medicines.html` | Customers | Search and filter medicines, see **Available / Out of stock**, ask about any medicine on WhatsApp |
| `contact.html` | Customers | Phone, WhatsApp, address with landmark, Google Maps link, opening hours, emergency numbers |
| `admin.html` | Shop owners | Nepali-first stock screen: tap **छ / सकियो**, add or remove medicines, write a notice, mark "closed today" |

The public site is English first with a **नेपाली** button. The stock screen is Nepali first with an **English** button.

There is no online ordering or payment on purpose: Nepal's Department of Drug Administration does not permit selling medicines online. Customers check the list, then call, message on WhatsApp, or visit.

---

## 1. Try the demo

Until Firebase is connected (step 3), the site runs in **demo mode** with about 60 example medicines. Changes are saved only in the browser you are using.

```bash
npx serve site
# then open http://localhost:3000 and http://localhost:3000/admin.html
```

## 2. Fill in the shop details

Edit **`site/js/config.js`**: shop name (English and Nepali), phone, WhatsApp number, address, landmark, Google Maps link, opening hours, pharmacist name, NPC and DDA numbers, nearest hospital.

Also change `"name"` in `site/manifest.webmanifest` and `site/admin.webmanifest` to the shop name. That is the name shown under the home-screen icon.

Optional: put a small photo of the shop front (under 200 KB) in `site/images/shop.jpg` and set `photo: "images/shop.jpg"` in `config.js`.

## 3. Connect Firebase (free)

Firebase stores the stock list and handles sign-in. The free "Spark" plan is enough: the website downloads the whole list in **one** read per visit, and the free plan allows 50,000 reads per day.

1. Go to <https://console.firebase.google.com> → **Create a project** (Google Analytics is not needed).
2. **Build → Firestore Database → Create database.** Choose location **asia-south1 (Mumbai)**, the closest to Nepal, and start in **production mode**.
3. **Build → Authentication → Get started → Sign-in method → Google → Enable.**
4. **Project settings (⚙️) → Your apps → Web (`</>`)** → register an app. Copy `apiKey`, `authDomain`, `projectId` and `appId` into **`site/js/firebase-config.js`**.
   These values are meant to be public. The security rules are what protect the data.
5. Put the Gmail addresses of everyone who may change the stock (your parents and you) in **both**:
   - `firestore.rules`, the list inside `in [ ... ]`
   - `site/js/config.js`, `ADMIN_EMAILS`
6. Deploy the site and the rules:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # pick the project you created
   firebase deploy
   ```

   The site is now live at `https://<project-id>.web.app`, and the demo banner is gone.

## 4. Load the real medicine list

From the paper register, type the medicines into a Google Sheet with three columns: **name**, **group**, **available** (`yes`/`no`; empty means yes).

Then open `https://<project-id>.web.app/admin.html`, sign in, and go to the **सूचना / पसल** tab → **Setup tools** → paste the rows → **Add to list**. Names already in the list are skipped, so pasting twice is safe.

Group names you can use (English names work too):
`fever`, `cold`, `stomach`, `bp`, `diabetes`, `antibiotic`, `vitamins`, `skin`, `eye_ear`, `baby`, `women`, `firstaid`, `other`.

**Backup:** use **Download list (CSV)** in the same section every few months.

## 5. Set up your parents' phones

On each phone, in Chrome:

1. Open `https://<project-id>.web.app/admin.html`.
2. Tap **Google बाट लगइन गर्नुहोस्** and choose their Gmail account. They stay signed in, so there is no password to remember.
3. Chrome menu **⋮ → Add to Home screen / Install app**. A green ➕ icon named **स्टक** appears on the home screen.

What they need to know:
- **Search → tap the green "✓ छ" button** when a medicine is finished. It turns red "✗ सकियो". Tap again when new stock arrives.
- Every change shows a **↶ फिर्ता** (undo) button for 8 seconds.
- **सकिएका** shows only finished medicines, which is handy when ordering from the supplier.
- With no internet, changes are kept on the phone and upload by themselves later. The top line shows "✓ सबै सेभ भयो" once everything is saved.

## 6. Free `.com.np` domain (optional)

Nepali citizens and registered businesses can get a `.com.np` domain free at <https://register.com.np>. You need citizenship or business registration and PAN documents, and it is renewed yearly. Then:

1. Firebase console → **Hosting → Add custom domain**, and follow the DNS steps.
2. **Authentication → Settings → Authorized domains → Add domain** (so sign-in works on the new domain).
3. Set `authDomain` in `site/js/firebase-config.js` to the new domain and deploy again.

## 7. Outside the website

- **Google Business Profile** (Google Maps listing): free, and it is what shows up for "pharmacy near me". Link it to the website.
- **Facebook page**: post notices and link to the website. Do not sell medicines through it (DDA rules).

---

## How it is built

- Plain HTML, CSS and JavaScript with no build step and no framework, so pages stay small on slow mobile data.
- Public pages read the list with a single small request to Firestore's REST API and keep the last copy for offline use.
- The stock screen uses the Firebase SDK with an offline cache. A service worker (`site/sw.js`) lets it open without signal.
- Everything is stored in one Firestore document, `site/main`:
  `{ notice, closedDate, updatedAt, items: { <id>: { name, group, available } } }`.
- Opening hours are always worked out in Nepal time (`Asia/Kathmandu`), whatever time zone the visitor's phone is in.
