import {Plugin} from '../../../domain/entities/Plugin';
import Item from './Item';

interface Genre {
  name: string;
  description: string | undefined;
  url: string;
  isPaginated: boolean;
  getNextPage?: (page: number) => Promise<Item[]>;
  items: Item[];
  source?: Plugin;
}

export default Genre;
