import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, Max, MaxLength, Min } from 'class-validator';
export class ArticleQuery {
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiProperty({ description: 'Publish status', default: true })
  published: boolean;

  @ApiProperty({
    type: Number,
    description: 'Page to retrieve',
    minimum: 1,
    maximum: 100,
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  public page?: number;

  @ApiProperty({ description: 'Retrieve reason', maxLength: 150 })
  @MaxLength(150)
  reason: string;
}
