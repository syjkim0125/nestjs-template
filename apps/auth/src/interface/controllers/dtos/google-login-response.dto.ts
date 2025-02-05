import { GoogleUserProfile } from '@auth/interface/types/google-user-profile';

export class GoogleLoginResponseDto {
  userProfile: GoogleUserProfile;
  accessToken: string;
  refreshToken: string;
}
