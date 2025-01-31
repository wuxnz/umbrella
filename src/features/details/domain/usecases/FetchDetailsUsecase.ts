import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepository} from '../repository/DetailsRepository';

export class FetchDetailsUsecase {
  constructor(private detailsRepository: DetailsRepository) {}

  async execute(id: string, plugin: Plugin): Promise<DetailedItem> {
    return await this.detailsRepository.fetchDetails(id, plugin);
  }
}
