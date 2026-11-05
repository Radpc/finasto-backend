import { Injectable } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { UserDomain } from '../../domain/user.domain';
import { ListUsersQuery } from './list-users.dto';
import { PaginatedList } from 'src/types/utils';

type Input = {
  familyId: string;
  query: ListUsersQuery;
};
type Output = PaginatedList<UserDomain>;

@Injectable()
export class ListUsersService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute({ familyId, query }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const result = await this.userRepoService.getUsers(familyId, {
      where: {
        name: query.searchBy ? { contains: query.searchBy } : undefined,
      },
      skip,
      take,
    });

    return result;
  }
}
