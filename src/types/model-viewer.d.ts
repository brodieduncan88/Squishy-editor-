/* JSX typing for Google's <model-viewer> custom element. */
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: number | string;
        'rotation-per-second'?: string;
        'shadow-intensity'?: number | string;
        'shadow-softness'?: number | string;
        exposure?: number | string;
        'touch-action'?: string;
        'interaction-prompt'?: string;
        'camera-orbit'?: string;
        'disable-pan'?: boolean;
      },
      HTMLElement
    >;
  }
}
