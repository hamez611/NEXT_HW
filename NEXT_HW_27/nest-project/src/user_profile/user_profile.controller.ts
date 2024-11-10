import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileService } from './user_profile.service';
import { User } from '../users/user.entity';
import { UserProfile } from './user_profile.entity';
@Controller('profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProfile(@Req() req, @Body() body): Promise<UserProfile> {
    const user: User = req.user;
    return this.userProfileService.createProfile(
      user,
      body.bio,
      body.avatarUrl,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Req() req): Promise<UserProfile> {
    const user: User = req.user;
    return this.userProfileService.getProfile(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateProfile(@Req() req, @Body() body): Promise<UserProfile> {
    const user: User = req.user;
    return this.userProfileService.updateProfile(
      user,
      body.bio,
      body.avatarUrl,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeProfile(@Req() req): Promise<void> {
    const user: User = req.user;
    return this.userProfileService.removeProfile(user);
  }
}
