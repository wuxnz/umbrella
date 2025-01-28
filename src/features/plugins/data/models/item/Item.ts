import SourceType from '../source/SourceType';

interface Item {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  url: string;
  type: SourceType;
}

export default Item;
