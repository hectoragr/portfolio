# Playbook: Add or change a user-visible string

Every string the user can see must exist in **both** English and Spanish. This is the single most
common way a change ships half-broken.

---

## The files

- `src/i18n/en.json` — English
- `src/i18n/es.json` — Spanish
- `src/i18n/index.ts` — i18next setup; language read from `localStorage['i18nextLng']`, `fallbackLng: 'en'`

Both files currently hold **32 keys** under these top-level groups: `welcome`, `homepage`, `home`,
`nav`, `resume`, `404`. **The key sets must stay identical.**

---

## Steps

1. Add the key to `en.json` under the right group:
   ```json
   "home": { "contactTitle": "Get in touch" }
   ```
2. Add the same key path to `es.json`:
   ```json
   "home": { "contactTitle": "Contáctame" }
   ```
3. Use it in the component **with an English fallback as the second argument**:
   ```tsx
   const { t } = useTranslation();
   <h2>{t('home.contactTitle', 'Get in touch')}</h2>
   ```

### Why the fallback argument matters

Tests mock `react-i18next` with `t: (key, fallback) => fallback ?? key`. The fallback string is
**what your tests assert on**. Omit it and the test sees the raw key (`home.contactTitle`); let it drift
from `en.json` and the test passes while the app shows something else. Keep them identical.

---

## Verify key parity

```bash
python3 - <<'PY'
import json
en = json.load(open('src/i18n/en.json'))
es = json.load(open('src/i18n/es.json'))
def keys(o, p=''):
    for k, v in o.items():
        if isinstance(v, dict): yield from keys(v, p + k + '.')
        else: yield p + k
a, b = set(keys(en)), set(keys(es))
print('missing in es:', sorted(a - b) or 'none')
print('missing in en:', sorted(b - a) or 'none')
print('total:', len(a))
PY
```

Both lines must read `none`.

---

## Then

```bash
npm test
npm start     # toggle EN/ES in the sidebar and confirm both render
```

The language toggle persists to `localStorage`, so if a change seems not to apply, clear
`i18nextLng` or hard-reload.

Finish with [`commit-audit.md`](./commit-audit.md).
