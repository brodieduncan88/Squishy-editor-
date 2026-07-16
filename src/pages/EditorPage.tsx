import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEditorHistory } from '../state/useEditorHistory';
import type { EditorState } from '../state/editorState';
import { useIsCompact } from '../lib/useMediaQuery';
import { CATEGORIES, CATEGORY_ORDER, type CategoryId } from '../editor/categories';
import EditorHeader from '../editor/EditorHeader';
import CategoryNavigation from '../editor/CategoryNavigation';
import StagePreview from '../editor/StagePreview';
import OptionPanel from '../editor/OptionPanel';
import BottomActions from '../editor/BottomActions';
import GiftReveal from '../editor/GiftReveal';
import ShareModal from '../share/ShareModal';
import BottomSheet from '../ui/BottomSheet';
import '../editor/editor.css';

export default function EditorPage() {
  const location = useLocation();
  const seed = (location.state as { seed?: EditorState } | null)?.seed;
  const api = useEditorHistory(seed);
  const compact = useIsCompact();

  const [active, setActive] = useState<CategoryId>('squishy');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Keyboard shortcuts for undo / redo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) api.redo();
        else api.undo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api]);

  const activeDef = CATEGORIES.find((c) => c.id === active)!;
  const idx = CATEGORY_ORDER.indexOf(active);
  const isLast = idx === CATEGORY_ORDER.length - 1;

  const selectCategory = (id: CategoryId) => {
    setActive(id);
    if (compact) setSheetOpen(true);
  };

  const handleNext = () => {
    if (isLast) {
      setGiftOpen(true);
      setSheetOpen(false);
    } else {
      const next = CATEGORY_ORDER[idx + 1];
      setActive(next);
      if (compact) setSheetOpen(true);
    }
  };

  const nextLabel = isLast ? 'Wrap Gift' : 'Next';

  return (
    <div className="editor">
      <EditorHeader api={api} onShare={() => setShareOpen(true)} />

      {compact ? (
        /* ---------- Tablet / mobile ---------- */
        <div className="editor-compact">
          <StagePreview state={api.state} />
          <CategoryNavigation active={active} onSelect={selectCategory} variant="tabs" />
          <div className="editor-compact__actions">
            <BottomActions api={api} nextLabel={nextLabel} onNext={handleNext} />
          </div>
          <BottomSheet
            open={sheetOpen}
            title={activeDef.label}
            onClose={() => setSheetOpen(false)}
          >
            <OptionPanel category={active} api={api} />
          </BottomSheet>
        </div>
      ) : (
        /* ---------- Desktop ---------- */
        <div className="editor-desktop">
          <aside className="editor-desktop__rail">
            <CategoryNavigation active={active} onSelect={setActive} variant="rail" />
          </aside>
          <main className="editor-desktop__stage">
            <StagePreview state={api.state} />
          </main>
          <aside className="editor-desktop__panel">
            <div className="editor-desktop__panel-scroll">
              <OptionPanel category={active} api={api} />
            </div>
          </aside>
          <footer className="editor-desktop__actions">
            <BottomActions api={api} nextLabel={nextLabel} onNext={handleNext} />
          </footer>
        </div>
      )}

      <GiftReveal
        open={giftOpen}
        state={api.state}
        onClose={() => setGiftOpen(false)}
        onSendLink={() => {
          setGiftOpen(false);
          setShareOpen(true);
        }}
      />
      <ShareModal open={shareOpen} state={api.state} onClose={() => setShareOpen(false)} />
    </div>
  );
}
