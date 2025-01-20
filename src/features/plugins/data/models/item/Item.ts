import Source from '../source/Source';

interface Item {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  url: string;
  source: Source;
}

export default Item;
