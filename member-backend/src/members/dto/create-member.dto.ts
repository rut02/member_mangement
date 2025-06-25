import { IsEnum, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export enum Prefix {
  MR = 'นาย',
  MRS = 'นาง',
  MISS = 'นางสาว',
}

export class CreateMemberDto {
  @IsEnum(Prefix, { message: 'คำนำหน้าชื่อต้องเป็น นาย, นาง, หรือ นางสาว' })
  @IsNotEmpty({ message: 'ต้องระบุคำนำหน้าชื่อ' })
  prefix: Prefix;

  @IsString({ message: 'ชื่อต้องเป็นสตริง' })
  @IsNotEmpty({ message: 'ต้องระบุชื่อ' })
  firstName: string;

  @IsString({ message: 'นามสกุลต้องเป็นสตริง' })
  @IsNotEmpty({ message: 'ต้องระบุนามสกุล' })
  lastName: string;

  @IsDateString({}, { message: 'วันเกิดต้องเป็นวันที่ในรูปแบบ ISO (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'ต้องระบุวันเกิด' })
  birthDate: string;
}