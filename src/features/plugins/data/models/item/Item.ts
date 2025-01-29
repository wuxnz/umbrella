import {Plugin} from '../../../domain/entities/Plugin';
import SourceType from '../source/SourceType';

interface Item {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  url: string;
  type: SourceType;
  source?: Plugin;
}

export default Item;
