type GoogleUserProfile = {
  googleId: string;
  email: string;
  name: string;
};

export class GoogleLoginCommandResult {
  userProfile: GoogleUserProfile;
  accessToken: string;
  refreshToken: string;
}
