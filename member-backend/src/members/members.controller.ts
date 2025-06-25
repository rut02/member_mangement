import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Multer } from 'multer';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('ไฟล์ต้องเป็น JPEG หรือ PNG'), false);
      }
      if (file.size > 2 * 1024 * 1024) {
        return cb(new BadRequestException('ไฟล์ต้องมีขนาดไม่เกิน 2MB'), false);
      }
      cb(null, true);
    },
  }))
  async create(@Body() createMemberDto: CreateMemberDto, @UploadedFile() file?: Express.Multer.File): Promise<MemberResponseDto> {
    return this.membersService.create(createMemberDto, file);
  }

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: MemberResponseDto[]; total: number }> {
    return this.membersService.findAll(search, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.membersService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('ไฟล์ต้องเป็น JPEG หรือ PNG'), false);
      }
      if (file.size > 2 * 1024 * 1024) {
        return cb(new BadRequestException('ไฟล์ต้องมีขนาดไม่เกิน 2MB'), false);
      }
      cb(null, true);
    },
  }))
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<MemberResponseDto> {
    return this.membersService.update(+id, updateMemberDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.membersService.remove(+id);
  }

  @Get('report/age')
  async getAgeReport(): Promise<{ age: number; count: number }[]> {
    return this.membersService.getAgeReport();
  }
}