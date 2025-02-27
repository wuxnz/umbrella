import Item from '../../../plugins/data/model/item/Item';
import SourceType from '../../../plugins/data/model/source/SourceType';

export enum FavoriteCategoryType {
  Completed = 'Completed',
  Dropped = 'Dropped',
  'In Progress' = 'In Progress',
  'On Hold' = 'On Hold',
  Planned = 'Planned',
}

export interface Favorite {
  id: string;
  category?: FavoriteCategoryType;
  item: Item;
  notify: boolean;
  timestamp: Date;
  type: SourceType;
}
