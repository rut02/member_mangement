import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';

@Module({
  imports: [
       TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'rootuser',
      password: 'rootpass',
      database: 'member_management',
      entities: [Member],
      synchronize: true,
    }),
       MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
