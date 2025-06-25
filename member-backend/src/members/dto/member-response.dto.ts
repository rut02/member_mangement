import { IsNumber, IsString, IsDate, IsOptional, IsEnum, IsIn } from 'class-validator';
import { Prefix } from './create-member.dto';

export class MemberResponseDto {
  @IsNumber()
  id: number;


  @IsString()
  @IsIn(['นาย', 'นาง', 'นางสาว'], { message: 'คำนำหน้าชื่อต้องเป็น นาย, นาง, หรือ นางสาว' })
  prefix: string;


  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  birthDate: string;

  @IsString()
  @IsOptional()
  profilePicture: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsNumber()
  age: number;
}