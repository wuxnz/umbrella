import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/model/item/DetailedItem';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepository} from '../repository/DetailsRepository';

export class FetchDetailsUsecase {
  constructor(private detailsRepository: DetailsRepository) {}

  async execute(id: string, plugin: Plugin): Promise<Status<DetailedItem>> {
    return await this.detailsRepository.fetchDetails(id, plugin);
  }
}
