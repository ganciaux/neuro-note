import { JwtUser } from './jwt-user.model';

export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
