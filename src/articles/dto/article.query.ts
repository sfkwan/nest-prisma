import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, Min } from 'class-validator';
export class ArticleQuery {
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiProperty({ default: true })
  published: boolean;

  @ApiProperty({
    description: 'page number for request',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page?: number;
}
