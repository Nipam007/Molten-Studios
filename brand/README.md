# Molten Studios — brand assets

Everything visual, in one place. This folder sits outside `public/`, so
nothing here is published to the live site. Deploy still only ships
`public/`.

## logos/

| File | Size | Use it for |
|---|---|---|
| `molten-logo-vortex-1024.jpg` | 1024×1024 | **Google Business Profile logo, app icons, anywhere small.** The vortex stays legible down to 32px. |
| `molten-logo-seam-1024.jpg` | 1024×1024 | Alternative logo, matching the mark in the site header. Better large, weaker small. |
| `molten-logo-horizontal-light.png` | 1400×400 | Dark backgrounds — email signature, decks, website headers. Transparent. |
| `molten-logo-horizontal-dark.png` | 1400×400 | White backgrounds — invoices, letterheads, printed quotes. Transparent. |
| `molten-logo-stacked-light.png` | 900×820 | Vertical lockup for dark backgrounds. Transparent. |
| `molten-logo-stacked-dark.png` | 900×820 | Vertical lockup for white backgrounds. Transparent. |
| `molten-logo-stacked-seam.png` | 900×820 | Stacked lockup using the seam mark. Transparent. |

"light" means **white text, for dark backgrounds**. "dark" means black
text, for white backgrounds. Using the wrong one makes the wordmark
invisible.

## social/

| File | Size | Use it for |
|---|---|---|
| `molten-profile-400.png` | 400×400 | Profile picture — WhatsApp Business, Instagram, LinkedIn, Carousell, Fiverr. |
| `molten-square-1200.jpg` | 1200×1200 | Square brand image — Google Business Profile, Instagram posts, anywhere square. |
| `molten-share-card-1200x630.jpg` | 1200×630 | Link preview card. Already live on the site as `public/assets/og-image.jpg`. |

## source/

The two original generated images, kept so any of the above can be
rebuilt at a different size or crop without regenerating imagery.

## Notes

**Two marks are currently in use.** The favicon and profile picture use
the vortex; the site header and footer use the seam. That was not a
single deliberate decision — the vortex won a legibility test at 32px,
and the seam was chosen later for the logo lockup. Both are defensible,
but worth settling on one at some point.

**Square, not pre-rounded.** Every platform applies its own circular
mask. A PNG with transparent corners can render with black corners on
some of them, so these are all square.

**Fonts:** Fraunces (display) and Inter (body), both from Google Fonts.
**Colours:** `#050506` void, `#FFAC2E` amber, `#A0E0AB` sage,
`#A52D25` oxblood. Amber gradient: `#ffd08a → #ffac2e → #ef8244`.
