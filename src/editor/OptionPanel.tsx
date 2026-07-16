import type { EditorApi } from '../state/useEditorHistory';
import type { CategoryId } from './categories';
import {
  SquishySelector,
  ColourPicker,
  SkinSelector,
  FaceSelector,
  AccessorySelector,
  NameEditor,
  GiftWrapper,
} from './panels/Panels';

export default function OptionPanel({
  category,
  api,
}: {
  category: CategoryId;
  api: EditorApi;
}) {
  switch (category) {
    case 'squishy':
      return <SquishySelector api={api} />;
    case 'colour':
      return <ColourPicker api={api} />;
    case 'skin':
      return <SkinSelector api={api} />;
    case 'face':
      return <FaceSelector api={api} />;
    case 'extras':
      return <AccessorySelector api={api} />;
    case 'name':
      return <NameEditor api={api} />;
    case 'gift':
      return <GiftWrapper api={api} />;
    default:
      return null;
  }
}
