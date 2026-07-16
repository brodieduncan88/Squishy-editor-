import { useNavigate } from 'react-router-dom';
import { Logo } from '../home/Header';
import Button, { IconButton } from '../ui/Button';
import SoundToggle from '../audio/SoundToggle';
import type { EditorApi } from '../state/useEditorHistory';

export default function EditorHeader({
  api,
  onShare,
}: {
  api: EditorApi;
  onShare: () => void;
}) {
  const nav = useNavigate();
  return (
    <header className="editor-header">
      <Logo />
      <div className="editor-header__mid">
        <IconButton name="undo" label="Undo" onClick={api.undo} disabled={!api.canUndo} />
        <IconButton name="redo" label="Redo" onClick={api.redo} disabled={!api.canRedo} />
      </div>
      <div className="editor-header__right">
        <SoundToggle tone="light" />
        <IconButton
          name="heart"
          label="My Creations"
          onClick={() => nav('/creations')}
        />
        <Button variant="sky" size="sm" icon="share" onClick={onShare}>
          <span className="hide-xs">Share</span>
        </Button>
      </div>
    </header>
  );
}
