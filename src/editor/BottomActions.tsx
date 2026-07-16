import Button, { IconButton } from '../ui/Button';
import type { EditorApi } from '../state/useEditorHistory';

interface Props {
  api: EditorApi;
  nextLabel: string;
  onNext: () => void;
}

export default function BottomActions({ api, nextLabel, onNext }: Props) {
  return (
    <div className="bottom-actions">
      <div className="bottom-actions__group">
        <IconButton
          name="undo"
          label="Undo"
          onClick={api.undo}
          disabled={!api.canUndo}
        />
        <Button variant="lemon" icon="sparkles" onClick={api.surpriseMe}>
          Surprise Me
        </Button>
        <IconButton name="reset" label="Reset everything" onClick={api.reset} />
      </div>
      <Button variant="primary" iconRight="arrow-right" onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
