import { UserDTO } from '../user/dto/user.dto';

export type AuthorizedRequest = Express.Request & { user: UserDTO };
