import { Module } from '@nestjs/common';
import { CreateTagController } from './use-cases/create-tag/create-tag.controller';
import { CreateTagService } from './use-cases/create-tag/create-tag.service';
import { GetTagByIdController } from './use-cases/get-tag-by-id/get-tag-by-id.controller';
import { ListTagsController } from './use-cases/list-tags/list-tags.controller';
import { UpdateTagController } from './use-cases/update-tag/update-tag.controller';
import { GetTagByIdService } from './use-cases/get-tag-by-id/get-tag-by-id.service';
import { ListTagsService } from './use-cases/list-tags/list-tags.service';
import { UpdateTagService } from './use-cases/update-tag/update-tag.service';
import { PrismaService } from 'src/database/prisma.service';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';

@Module({
  controllers: [
    CreateTagController,
    GetTagByIdController,
    ListTagsController,
    UpdateTagController,
  ],
  providers: [
    PrismaService,
    TagRepoService,
    CreateTagService,
    GetTagByIdService,
    ListTagsService,
    UpdateTagService,
  ],
})
export class TagsModule {}
