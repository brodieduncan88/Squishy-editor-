# 🧸 Squishy Studio

A colourful, child-friendly **digital squishy toy customiser**. Kids pick a
squishy, change its colours, add patterns, faces and accessories, name it, wrap
it as a virtual present, then export an image or share a private link.

Built as a polished, launchable frontend MVP with a soft‑3D, glossy, jelly‑like
aesthetic.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Tech

- **React 18 + TypeScript + Vite**
- **react-router-dom** for pages
- **Layered SVG squishies** — every character is composed from data (shape,
  colour, pattern, face, accessories, gloss, shadow) and rendered as a single
  SVG string, so it exports and shares cleanly with no heavy dependencies.
- Plain CSS design‑token system (no UI framework).

## Architecture

```
src/
  data/       Asset config — the single source of truth (add content here)
              shapes · colours · skins · faces · accessories · gifts
  lib/        buildSquishy (SVG compositor) · faceParts · colour utils
              presets · exportImage (PNG) · share (private links) · storage
  state/      EditorState model + useEditorHistory (undo/redo, Surprise Me)
  squishy/    SquishyPreview (idle float + click-to-squash)
  ui/         Button, Icon, SelectTile, Swatch, Chip, Modal, BottomSheet
  home/       Header, Hero, How It Works, Gallery, Design Packs, Gift, Trust
  editor/     SquishyEditor shell, CategoryNavigation, StagePreview,
              OptionPanel + panels, BottomActions, GiftReveal
  share/      ShareModal
  pages/      HomePage · EditorPage · CreationsPage · SharedPage
```

### Data-driven assets

New squishies, skins, faces, accessories and gift boxes are added purely by
editing files in `src/data/` — the UI reads them automatically. The MVP ships:

- **10** squishy shapes (Bear, Cat, Dog, Duck, Axolotl, Unicorn, Ice Cream,
  Donut, Frog, Mystery Blob)
- **20** colours (pastel · bright · metallic) + gradients + custom picker
- **14** skins (solid, animal prints, motifs, galaxy, glitter, metallics,
  holographic, rainbow)
- **8** faces · **10** accessories · **6** gift boxes

### Editor state

A single `EditorState` object drives everything, managed by
`useEditorHistory` which provides **undo/redo** (history stack, ⌘/Ctrl‑Z),
**Reset**, and **Surprise Me** (randomises colours, pattern, face and extras).

### Sharing & export

- **Save Image** rasterises the composition to a branded PNG via canvas.
- **Private link** encodes the whole creation into an unguessable URL
  (`/s/…`) — no server, no public profiles, no chat. **My Creations** are
  stored locally on the device.

## Responsive

- **Desktop:** header · left category rail · large centre stage · right option
  panel · bottom action bar.
- **Tablet / mobile:** preview on top · category tab bar · options in a bottom
  sheet · fixed actions. All touch targets ≥ 44×44px.

## Accessibility

- Keyboard navigation and visible focus states
- Accessible labels on all icon buttons
- Selection is never colour‑only (ring + lift + check badge)
- Navy‑on‑light text for contrast
- Full `prefers-reduced-motion` support
