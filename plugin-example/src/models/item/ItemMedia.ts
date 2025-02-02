import MediaType from '../media/MediaType';

interface ItemMedia {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  releaseDate?: string;
  duration?: number;
  rating?: number;
  filler?: boolean;
  type: MediaType;
  url: string;
  language?: string;
  number: number;
}

export default ItemMedia;
