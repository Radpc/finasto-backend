import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { CreateFamilyController } from './use-cases/create-family/create-family.controller';
import { GetFamilyByIdController } from './use-cases/get-family-by-id/get-family-by-id.controller';
import { ListFamiliesController } from './use-cases/list-families/list-families.controller';
import { CreateFamilyService } from './use-cases/create-family/create-family.service';
import { GetFamilyByIdService } from './use-cases/get-family-by-id/get-family-by-id.service';
import { ListFamiliesService } from './use-cases/list-families/list-families.service';
import { FamilyRepoService } from 'src/database/repositories/family/family-repo.service';
import { UserJwtService } from '../jwt/user-jwt/user-jwt.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateFamilyController,
    GetFamilyByIdController,
    ListFamiliesController,
  ],
  providers: [
    CreateFamilyService,
    GetFamilyByIdService,
    ListFamiliesService,
    UserJwtService,

    // Repo
    FamilyRepoService,
  ],
})
export class FamilyModule {}
