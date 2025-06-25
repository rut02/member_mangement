import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import type { Multer } from 'multer';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto, file?: Express.Multer.File): Promise<MemberResponseDto> {
    const member = this.membersRepository.create({
      ...createMemberDto,
      profilePicture: file ? `uploads/${file.filename}` : null,
    });
    const savedMember = await this.membersRepository.save(member);
    return this.mapToResponseDto(savedMember);
  }

  async findAll(search?: string, page = 1, limit = 10): Promise<{ data: MemberResponseDto[]; total: number }> {
    const [data, total] = await this.membersRepository.findAndCount({
      where: search
        ? [
            { firstName: Like(`%${search}%`) },
            { lastName: Like(`%${search}%`) },
          ]
        : {},
      order: { birthDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: data.map((member) => this.mapToResponseDto(member)),
      total,
    };
  }

  async findOne(id: number): Promise<MemberResponseDto> {
    const member = await this.membersRepository.findOneBy({ id });
    if (!member) {
      throw new NotFoundException(`ไม่พบสมาชิกที่มี ID ${id}`);
    }
    return this.mapToResponseDto(member);
  }

  async update(id: number, updateMemberDto: UpdateMemberDto, file?: Express.Multer.File): Promise<MemberResponseDto> {
    const member = await this.findOne(id);
    Object.assign(member, updateMemberDto);
    if (file) {
      member.profilePicture = `uploads/${file.filename}`;
    }
    const updatedMember = await this.membersRepository.save(member);
    return this.mapToResponseDto(updatedMember);
  }

  async remove(id: number): Promise<void> {
    const member = await this.findOne(id);
    await this.membersRepository.delete(id);
  }

  async getAgeReport(): Promise<{ age: number; count: number }[]> {
    return this.membersRepository
      .createQueryBuilder('member')
      .select('FLOOR(DATEDIFF(CURDATE(), member.birthDate)/365)', 'age')
      .addSelect('COUNT(*)', 'count')
      .groupBy('age')
      .orderBy('age', 'ASC')
      .getRawMany();
  }

  private mapToResponseDto(member: Member): MemberResponseDto {
    return {
      id: member.id,
      prefix: member.prefix,
      firstName: member.firstName,
      lastName: member.lastName,
      birthDate: member.birthDate,
      profilePicture: member.profilePicture,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      age: member.age, // รวม age จาก getter
    };
  }
}