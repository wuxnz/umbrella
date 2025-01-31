import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepository} from '../../domain/repository/DetailsRepository';
import {DetailsService} from '../datasource/DetailsService';

export class DetailsRepositoryImpl implements DetailsRepository {
  async fetchDetails(id: string, plugin: Plugin): Promise<any> {
    return DetailsService.fetchDetails(id, plugin);
  }
}
