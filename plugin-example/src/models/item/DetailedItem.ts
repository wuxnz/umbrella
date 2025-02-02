import Item from './Item';
import Genre from './Genre';
import ItemMedia from './ItemMedia';
import SourceType from '../source/SourceType';
import {Plugin} from '../Plugin';

interface DetailedItem extends Item {
  language: string;
  trailerUrl?: string;
  synopsis: string;
  related?: Item[];
  genres?: Genre[];
  media: ItemMedia[];
  releaseDate?: string;
  rating?: number;
  ratingCount?: number;
  creators?: string[];
  status?: string;
  nsfw?: boolean;
  nextMediaRelease?: string;
  otherNames?: string[];
  source?: Plugin;
}

export default DetailedItem;
