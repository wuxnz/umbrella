import {create} from 'zustand';
import {LibraryRepositoryImpl} from '../../../library/data/repository/LibraryRepositoryImpl';
import {Favorite} from '../../../library/domain/entities/Favorite';
import {AddFavoriteUsecase} from '../../../library/domain/usecases/AddFavoriteUsecase';
import {RemoveFavoriteUsecase} from '../../../library/domain/usecases/RemoveFavoriteUsecase';
import {UpdateFavoriteUsecase} from '../../../library/domain/usecases/UpdateFavoriteUsecase';
import Item from '../../../plugins/data/model/item/Item';

const addFavorite = new AddFavoriteUsecase(new LibraryRepositoryImpl());
const removeFavorite = new RemoveFavoriteUsecase(new LibraryRepositoryImpl());
const updateFavorite = new UpdateFavoriteUsecase(new LibraryRepositoryImpl());

// Add/Remove Favorite
interface FavoriteStoreState {
  item: Item;
  setItem: (item: Item) => void;
  isFavorited: boolean;
  setIsFavorited: (favorited: boolean) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (id: string) => void;
  updateFavorite: (id: string, favorite: Favorite) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useFavoriteStore = create<FavoriteStoreState>((set, get) => ({
  item: {} as Item,
  setItem: (item: Item) => {
    set({
      item: item,
    });
  },
  isFavorited: false,
  setIsFavorited: async (favorited: boolean) => {
    set({
      isFavorited: favorited,
    });
  },
  addFavorite: (favorite: Favorite) => {
    addFavorite.execute(favorite);
    get().setIsFavorited(true);
  },
  removeFavorite: (id: string) => {
    removeFavorite.execute(id);
    get().setIsFavorited(false);
  },
  updateFavorite: (id: string, favorite: Favorite) => {
    updateFavorite.execute(id, favorite);
  },
  visible: false,
  setVisible: (visible: boolean): void => {
    set({
      visible: visible,
    });
  },
}));
