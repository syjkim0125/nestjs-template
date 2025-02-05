import { Request } from 'express';

import { GoogleUserProfile } from '@auth/interface/types/google-user-profile';

export interface AuthenticatedRequest extends Request {
  user?: GoogleUserProfile;
}
