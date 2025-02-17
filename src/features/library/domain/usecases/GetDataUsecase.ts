import {LibrayPageData} from '../entities/LibraryPageData';
import {LibraryRepository} from '../repository/LibraryRepository';

export class GetDataUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(): LibrayPageData {
    return this.repository.getData();
  }
}
