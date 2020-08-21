import { User } from '../model/user.model';
import { Message } from '../model/message.model';
import { ResponseError } from '../model/error.model';

export interface ChatState {
    user: User;
    users: User[];
    userSelected: User;
    messages: Message[];
    error: ResponseError;
}
