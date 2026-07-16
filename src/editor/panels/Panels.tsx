import SelectTile from '../../ui/SelectTile';
import Swatch from '../../ui/Swatch';
import Chip from '../../ui/Chip';
import SquishyPreview from '../../squishy/SquishyPreview';
import { PanelHeader, OptionGrid, GroupLabel } from './PanelBits';
import type { EditorApi } from '../../state/useEditorHistory';
import { preset } from '../../lib/presets';
import {
  SHAPES,
  COLOURS,
  GRADIENTS,
  SKINS,
  FACES,
  ACCESSORIES,
  GIFT_BOXES,
  WRAPPINGS,
  RIBBONS,
  PERSONALITIES,
  COLOUR_MAP,
} from '../../data';

/* ---------- Squishy ---------- */
export function SquishySelector({ api }: { api: EditorApi }) {
  return (
    <>
      <PanelHeader title="Pick your squishy" hint="Choose a character to begin." />
      <OptionGrid cols={3}>
        {SHAPES.map((s) => (
          <SelectTile
            key={s.id}
            label={s.name}
            selected={api.state.squishyType === s.id}
            onSelect={() => api.set({ squishyType: s.id })}
          >
            <div className="tile__squishy">
              <SquishyPreview
                state={preset({ ...api.state, squishyType: s.id })}
                size={68}
                shadow={false}
              />
            </div>
          </SelectTile>
        ))}
      </OptionGrid>
    </>
  );
}

/* ---------- Colour ---------- */
export function ColourPicker({ api }: { api: EditorApi }) {
  const groups = [
    { key: 'pastel', label: 'Pastel palette' },
    { key: 'bright', label: 'Bright palette' },
    { key: 'metallic', label: 'Metallic palette' },
  ] as const;
  return (
    <>
      <PanelHeader title="Body colour" hint="Tap a colour, or try a gradient." />
      {groups.map((g) => (
        <div key={g.key}>
          <GroupLabel>{g.label}</GroupLabel>
          <div className="swatch-row">
            {COLOURS.filter((c) => c.group === g.key).map((c) => (
              <Swatch
                key={c.id}
                colour={c.hex}
                label={c.name}
                metallic={c.metallic}
                selected={!api.state.gradient && api.state.primaryColour === c.id}
                onSelect={() => api.set({ primaryColour: c.id, gradient: null })}
              />
            ))}
          </div>
        </div>
      ))}
      <GroupLabel>Gradient magic</GroupLabel>
      <div className="swatch-row">
        {GRADIENTS.map((g) => (
          <Swatch
            key={g.id}
            colour={`linear-gradient(160deg, ${g.from}, ${g.to})`}
            label={g.name}
            selected={api.state.gradient === g.id}
            onSelect={() => api.set({ gradient: g.id })}
          />
        ))}
      </div>

      <GroupLabel>Custom colour</GroupLabel>
      <label className="custom-colour">
        <span
          className="custom-colour__preview"
          style={{ background: COLOUR_MAP[api.state.primaryColour]?.hex ?? '#fff' }}
        />
        <span className="custom-colour__text">Pick any colour you like</span>
        <input
          type="color"
          aria-label="Custom body colour"
          value={COLOUR_MAP[api.state.primaryColour]?.hex ?? '#F9B5DE'}
          onChange={(e) => {
            // register a custom colour on the fly
            const hex = e.target.value;
            const id = `custom-${hex.replace('#', '')}`;
            if (!COLOUR_MAP[id]) {
              COLOUR_MAP[id] = { id, name: 'Custom', hex, group: 'bright' };
            }
            api.set({ primaryColour: id, gradient: null });
          }}
        />
      </label>
    </>
  );
}

/* ---------- Skin ---------- */
export function SkinSelector({ api }: { api: EditorApi }) {
  return (
    <>
      <PanelHeader title="Skin & pattern" hint="Give your squishy a fun surface." />
      <OptionGrid cols={3}>
        {SKINS.map((s) => (
          <SelectTile
            key={s.id}
            label={s.name}
            emoji={s.emoji}
            selected={api.state.skin === s.id}
            onSelect={() => api.set({ skin: s.id })}
          />
        ))}
      </OptionGrid>
    </>
  );
}

/* ---------- Face ---------- */
export function FaceSelector({ api }: { api: EditorApi }) {
  return (
    <>
      <PanelHeader title="Face & feelings" hint="How is your squishy feeling today?" />
      <OptionGrid cols={3}>
        {FACES.map((f) => (
          <SelectTile
            key={f.id}
            label={f.name}
            selected={api.state.face === f.id}
            onSelect={() => api.set({ face: f.id })}
          >
            <div className="tile__squishy">
              <SquishyPreview
                state={preset({ ...api.state, face: f.id })}
                size={64}
                shadow={false}
              />
            </div>
          </SelectTile>
        ))}
      </OptionGrid>
    </>
  );
}

/* ---------- Extras ---------- */
export function AccessorySelector({ api }: { api: EditorApi }) {
  return (
    <>
      <PanelHeader title="Fun extras" hint="Add as many as you like — tap to remove." />
      <OptionGrid cols={3}>
        {ACCESSORIES.map((a) => (
          <SelectTile
            key={a.id}
            label={a.name}
            emoji={a.emoji}
            selected={api.state.accessories.includes(a.id)}
            onSelect={() => api.toggleAccessory(a.id)}
          />
        ))}
      </OptionGrid>
    </>
  );
}

/* ---------- Name ---------- */
export function NameEditor({ api }: { api: EditorApi }) {
  return (
    <>
      <PanelHeader title="Name your squishy" />
      <label className="text-field">
        <span className="text-field__label">What is your squishy called?</span>
        <input
          className="text-field__input"
          type="text"
          maxLength={22}
          placeholder="e.g. Marshmallow"
          value={api.state.name}
          onChange={(e) => api.set({ name: e.target.value })}
        />
      </label>
      <GroupLabel>Personality</GroupLabel>
      <div className="chip-wrap">
        {PERSONALITIES.map((p) => (
          <Chip
            key={p}
            label={p}
            selected={api.state.personality === p}
            onSelect={() => api.set({ personality: p })}
          />
        ))}
      </div>
    </>
  );
}

/* ---------- Gift Box ---------- */
export function GiftWrapper({ api }: { api: EditorApi }) {
  const s = api.state;
  return (
    <>
      <PanelHeader title="Wrap it up" hint="Make it a gift for someone special." />

      <GroupLabel>Box shape</GroupLabel>
      <OptionGrid cols={3}>
        {GIFT_BOXES.map((b) => (
          <SelectTile
            key={b.id}
            label={b.name}
            emoji={b.emoji}
            selected={s.box === b.id}
            onSelect={() => api.set({ box: b.id })}
          />
        ))}
      </OptionGrid>

      <GroupLabel>Wrapping</GroupLabel>
      <OptionGrid cols={3}>
        {WRAPPINGS.map((w) => (
          <SelectTile
            key={w.id}
            label={w.name}
            emoji={w.emoji}
            selected={s.wrapping === w.id}
            onSelect={() => api.set({ wrapping: w.id })}
          />
        ))}
      </OptionGrid>

      <GroupLabel>Ribbon</GroupLabel>
      <div className="swatch-row">
        {RIBBONS.map((r) => (
          <Swatch
            key={r.id}
            colour={r.colour}
            label={r.name}
            selected={s.ribbon === r.id}
            onSelect={() => api.set({ ribbon: r.id })}
          />
        ))}
      </div>

      <label className="text-field">
        <span className="text-field__label">Who is it for?</span>
        <input
          className="text-field__input"
          type="text"
          maxLength={24}
          placeholder="Recipient's name"
          value={s.recipient}
          onChange={(e) => api.set({ recipient: e.target.value })}
        />
      </label>

      <label className="text-field">
        <span className="text-field__label">Gift message</span>
        <textarea
          className="text-field__input text-field__area"
          maxLength={120}
          rows={3}
          placeholder="Write something kind…"
          value={s.giftMessage}
          onChange={(e) => api.set({ giftMessage: e.target.value })}
        />
      </label>
    </>
  );
}
