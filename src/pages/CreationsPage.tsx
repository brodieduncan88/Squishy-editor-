import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../home/Header';
import Button, { IconButton } from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import { loadCreations, deleteCreation, type Creation } from '../lib/storage';
import { downloadCard } from '../lib/exportImage';
import { preset } from '../lib/presets';
import './pages.css';

export default function CreationsPage() {
  const nav = useNavigate();
  const [list, setList] = useState<Creation[]>(() => loadCreations());

  return (
    <div className="subpage">
      <div className="subpage__sky">
        <Header />
        <div className="container subpage__head">
          <h1>My Creations</h1>
          <p>Your saved squishies live here — only on this device.</p>
        </div>
      </div>

      <div className="container subpage__body">
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty__art">
              <SquishyPreview
                state={{
                  ...loadDefault(),
                }}
                size={180}
                float
              />
            </div>
            <h2>No squishies yet!</h2>
            <p>Make your first squishy and keep it here forever.</p>
            <Button variant="primary" size="lg" icon="wand" onClick={() => nav('/editor')}>
              Create My Squishy
            </Button>
          </div>
        ) : (
          <div className="creations-grid">
            {list.map((c) => (
              <div className="creation-card" key={c.id}>
                <div className="creation-card__art">
                  <SquishyPreview state={c.state} size={150} float />
                </div>
                <div className="creation-card__name">{c.state.name || 'My Squishy'}</div>
                <div className="creation-card__actions">
                  <Button
                    variant="sky"
                    size="sm"
                    icon="wand"
                    onClick={() => nav('/editor', { state: { seed: c.state } })}
                  >
                    Edit
                  </Button>
                  <IconButton
                    name="download"
                    label="Save image"
                    onClick={() => downloadCard(c.state)}
                  />
                  <IconButton
                    name="close"
                    label="Delete"
                    onClick={() => setList(deleteCreation(c.id))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function loadDefault() {
  return preset({
    squishyType: 'blob',
    primaryColour: 'pastel-lav',
    skin: 'holo',
    face: 'sleepy',
    personality: 'Sleepy',
  });
}
