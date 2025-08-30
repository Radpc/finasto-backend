import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTimeBudgetDTO {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: new Date().toISOString() })
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: new Date().toISOString() })
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  budgetValue: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 1 })
  categoryId: string;
}
