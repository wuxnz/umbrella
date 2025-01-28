import Item from './Item';

interface Category {
  name: string;
  description?: string;
  url: string;
  isPaginated: boolean;
  nextPageNumber?: number;
  previousPageNumber?: number;
  items: Item[];
}

export default Category;
