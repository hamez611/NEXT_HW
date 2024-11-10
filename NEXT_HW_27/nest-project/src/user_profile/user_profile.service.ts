import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './user_profile.entity';
import { User } from '../users/user.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createProfile(
    user: User,
    bio: string,
    avatarUrl: string,
  ): Promise<UserProfile> {
    const profile = this.userProfileRepository.create({ bio, avatarUrl, user });
    return this.userProfileRepository.save(profile);
  }

  async getProfile(userId: number): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  async updateProfile(
    user: User,
    bio: string,
    avatarUrl: string,
  ): Promise<UserProfile> {
    const profile = await this.getProfile(user.id);
    profile.bio = bio;
    profile.avatarUrl = avatarUrl;
    return this.userProfileRepository.save(profile);
  }

  async removeProfile(user: User): Promise<void> {
    const profile = await this.getProfile(user.id);
    await this.userProfileRepository.remove(profile);
  }
}
