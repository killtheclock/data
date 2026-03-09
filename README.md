
# Επιστημονικές Σημειώσεις

Προσωπικό σύστημα σημειώσεων σε GitHub Pages με υποστήριξη LaTeX, ελληνικών γραμματοσειρών και κατηγοριοποίηση ανά επιστήμη.

## Δομή αρχείων

```
repo/
├── index.html          ← κεντρική σελίδα (δεν αγγίζεις)
├── pages.json          ← ΕΔΩ καταχωρείς τις σελίδες σου
├── assets/
│   ├── style.css       ← σχεδιασμός
│   └── main.js         ← λογική (φόρτωση, φιλτράρισμα, LaTeX)
├── math/
├── physics/
├── chemistry/
├── literature/
├── notes/
└── README.md
```

## Εγκατάσταση

### 1. Fork / Clone
```bash
git clone https://github.com/<USERNAME>/<REPO>.git
cd <REPO>
```

### 2. GitHub Pages
**Settings → Pages → Source → Deploy from branch → main / root**

Η σελίδα σου θα είναι στο: `https://<USERNAME>.github.io/<REPO>/`

---

## Πώς να προσθέσεις νέα σελίδα

### Βήμα 1 — Γράψε το HTML

Δημιούργησε το αρχείο στον κατάλληλο φάκελο:

```
math/my-topic.html
physics/my-topic.html
chemistry/my-topic.html
literature/my-topic.html
notes/my-topic.html
```

Για LaTeX χρησιμοποίησε:
- Inline: `$E = mc^2$` ή `\( E = mc^2 \)`
- Display: `$$\int_0^\infty e^{-x}\,dx = 1$$` ή `\[ ... \]`

Πρόσθεσε στο `<head>` του HTML σου:
```html
<script>
  window.MathJax = {
    tex: { inlineMath: [['$','$']], displayMath: [['$$','$$']] },
    startup: { typeset: true }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
```

### Βήμα 2 — Πρόσθεσε καταχώρηση στο `pages.json`

```json
{
  "title": "Τίτλος της Σελίδας",
  "description": "Σύντομη περιγραφή (1-2 προτάσεις).",
  "category": "math",
  "formula": "\\int_a^b f(x)\\,dx = F(b) - F(a)",
  "url": "math/my-topic.html",
  "date": "2025-06-15"
}
```

| Πεδίο | Απαιτείται | Περιγραφή |
|-------|-----------|-----------|
| `title` | ✓ | Τίτλος που εμφανίζεται στην κάρτα |
| `category` | ✓ | `math`, `physics`, `chemistry`, `literature`, `notes` |
| `url` | ✓ | Σχετική διαδρομή π.χ. `math/my-topic.html` |
| `description` | — | Κείμενο κάτω από τον τίτλο |
| `formula` | — | LaTeX (χωρίς `$`) — εμφανίζεται rendered στην κάρτα |
| `subcategory` | — | Ελεύθερο κείμενο π.χ. `"Ανάλυση"` — εμφανίζεται ως sub-tab αυτόματα |
| `description` | — | Κείμενο κάτω από τον τίτλο |
| `formula` | — | LaTeX (χωρίς `$`) — εμφανίζεται rendered στην κάρτα |
| `date` | — | Ημερομηνία σε μορφή `YYYY-MM-DD` |

### Βήμα 3 — Push

```bash
git add .
git commit -m "Add: τίτλος νέας σελίδας"
git push
```

---

## Προσθήκη νέας κατηγορίας

### 1. Δημιούργησε φάκελο
```bash
mkdir biology
touch biology/.gitkeep
```
Ή στο GitHub browser: **Add file → Create new file** → `biology/.gitkeep`

### 2. Πρόσθεσε tab στο `index.html`
Βρες τα υπάρχοντα tabs και πρόσθεσε:
```html
<button class="tab" data-cat="biology" aria-pressed="false">
  <span class="tab-dot"></span>
  <span class="tab-label">Βιολογία</span>
  <span class="tab-count" id="cnt-biology"></span>
</button>
```

### 3. Πρόσθεσε χρώμα στο `assets/style.css`
```css
/* στο :root */
--biology: #90e090;

/* tabs */
.tab[data-cat="biology"].active { color: var(--biology); border-bottom-color: var(--biology); }

/* cards */
.card[data-cat="biology"] { --accent: var(--biology); }
```

### 4. Πρόσθεσε label στο `assets/main.js`
```js
const CATEGORIES = {
  // ... υπάρχοντα ...
  biology: { label: 'Βιολογία', color: '#90e090' },
};
```

---

## LaTeX — Γρήγορη αναφορά

| Σύνταξη | Αποτέλεσμα |
|---------|-----------|
| `$a^2 + b^2 = c^2$` | inline τύπος |
| `$$\frac{d}{dx}e^x = e^x$$` | display τύπος |
| `\\frac{a}{b}` | κλάσμα |
| `\\sqrt{x}` | τετραγωνική ρίζα |
| `\\sum_{i=1}^{n}` | άθροισμα |
| `\\int_a^b` | ολοκλήρωμα |
| `\\infty` | άπειρο ∞ |
| `\\alpha, \\beta, \\gamma` | ελληνικά γράμματα |
| `\\mathbb{R}` | σύνολο πραγματικών |
