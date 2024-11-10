import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './user_profile.entity';
import { UserProfileService } from './user_profile.service';
import { UserProfileController } from './user_profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])], // UserProfile 엔터티를 TypeORM 모듈에 등록
  providers: [UserProfileService], // UserProfileService를 모듈에 등록
  controllers: [UserProfileController], // UserProfileController를 모듈에 등록
  exports: [UserProfileService], // 필요한 경우 다른 모듈에서 UserProfileService를 사용할 수 있도록 내보내기
})
export class UserProfileModule {}
