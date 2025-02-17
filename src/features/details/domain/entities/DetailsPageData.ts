import DetailedItem from '../../../plugins/data/model/item/DetailedItem';
import Item from '../../../plugins/data/model/item/Item';

export interface DetailsPageData {
  item: Item;
  detailedItem: DetailedItem;
  relatedItems: Item[];
}
