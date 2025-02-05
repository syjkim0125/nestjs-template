import { AuthService } from '@auth/application/commands/sevices/auth.service';
import { UserService } from '@auth/application/commands/sevices/user.service';
import { OauthService } from '@auth/application/commands/sevices/oauth.service';

export const ApplicationServices = [AuthService, OauthService, UserService];
