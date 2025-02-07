import { IsString, IsNotEmpty, IsOptional, IsMongoId, MaxLength } from 'class-validator'

export class BlogDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsOptional()
  tags?: string[];
}
