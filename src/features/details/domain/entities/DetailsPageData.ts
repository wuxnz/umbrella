import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import Item from '../../../plugins/data/models/item/Item';

export interface DetailsPageData {
  item: Item;
  detailedItem: DetailedItem;
  relatedItems: Item[];
}
