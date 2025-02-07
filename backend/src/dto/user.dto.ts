import { IsString, IsEmail, IsNotEmpty, IsNumber, IsArray, IsOptional, IsMongoId, Min } from 'class-validator';
import { Types } from 'mongoose';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  age: number;

  @IsArray()
  @IsOptional() 
  @IsMongoId({ each: true })
  blogs?: Types.ObjectId[];
}
