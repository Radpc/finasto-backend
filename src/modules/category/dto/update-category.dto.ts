import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCategoryDTO } from './create-category.dto';

// A category cannot be moved to another family, so familyId is not updatable.
export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDTO, ['familyId'] as const),
) {}
