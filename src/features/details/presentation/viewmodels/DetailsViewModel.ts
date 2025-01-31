import {DetailsRepositoryImpl} from '../../data/repository/DetailsRepositoryImpl';
import {FetchDetailsUsecase} from '../../domain/usecases/FetchDetailsUsecase';

const fetchDetails = new FetchDetailsUsecase(new DetailsRepositoryImpl());

export class DetailsViewModel {
  async fetchDetails(id: string, plugin: any) {
    return await fetchDetails.execute(id, plugin);
  }
}
