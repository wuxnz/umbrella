import {Plugin} from '../Plugin';
import Item from './Item';

interface Genre {
  id: string;
  name: string;
  description?: string | undefined;
  url: string;
  isPaginated?: boolean;
  nextPageNumber?: number;
  previousPageNumber?: number;
  items?: Item[];
  source?: Plugin;
}

export default Genre;
