import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import {DetailsRepositoryImpl} from '../../data/repository/DetailsRepositoryImpl';
import {FetchDetailsUsecase} from '../../domain/usecases/FetchDetailsUsecase';

const fetchDetails = new FetchDetailsUsecase(new DetailsRepositoryImpl());

export class DetailsViewModel {
  async fetchDetails(id: string, plugin: any): Promise<Status<DetailedItem>> {
    return await fetchDetails.execute(id, plugin);
  }
}
