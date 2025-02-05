type UserProfile = {
  googleId: string;
  email: string;
  name: string;
};

export type LoginResult = {
  userProfile: UserProfile;
  accessToken: string;
  refreshToken: string;
};
