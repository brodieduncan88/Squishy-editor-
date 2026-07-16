import './atmosphere.css';

/* Fixed, GPU-cheap ambience: drifting aurora blobs + a fine film grain.
   Purely decorative. Sits behind page content. */
export default function Atmosphere({ grain = true }: { grain?: boolean }) {
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos__aurora">
        <span className="atmos__blob atmos__blob--pink" />
        <span className="atmos__blob atmos__blob--mint" />
        <span className="atmos__blob atmos__blob--lav" />
        <span className="atmos__blob atmos__blob--lemon" />
      </div>
      {grain && <div className="atmos__grain" />}
    </div>
  );
}
