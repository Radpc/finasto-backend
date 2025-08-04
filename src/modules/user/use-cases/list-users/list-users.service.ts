import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { UserDomain } from '../../domain/user.domain';
import { ListUsersQuery } from './list-users.dto';
import { PaginatedList } from 'src/types/utils';

type Input = {
  query: ListUsersQuery;
  requester: Requester;
};
type Output = PaginatedList<UserDomain>;

@Injectable()
export class ListUsersService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute({ query, requester }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const result = await this.userRepoService.getUsers({
      where: {
        name: query.searchBy ? { contains: query.searchBy } : undefined,
        families: { some: { users: { some: { id: requester.userId } } } },
      },
      skip,
      take,
    });

    if (!result) throw new NotFoundException();

    return result;
  }
}
