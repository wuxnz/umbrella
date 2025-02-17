import Item from '../../../plugins/data/model/item/Item';
import SourceType from '../../../plugins/data/model/source/SourceType';

export interface Favorite {
  category?: 'completed' | 'dropped' | 'in_progress' | 'on_hold' | 'planned';
  item: Item;
  notify?: boolean;
  timestamp: Date;
  type: SourceType;
}
