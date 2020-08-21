import { User } from './user.model';
import { UserPrivate } from './user-private.model';

export class Message {

    constructor(
        message: string, user?: User, onConnect?: boolean, onDisconnect?: boolean,
        prvt?: boolean, userPrivate?: UserPrivate, time?: Date) {
        this.message = message || this.message;
        this.user = user || this.user;
        this.time = time || this.time;
        this.private = prvt || this.private;
        this.userPrivate = userPrivate || this.userPrivate;
        this.onConnect = onConnect || this.onConnect;
        this.onDisconnect = onDisconnect || this.onDisconnect;
    }

    user: User;
    message: string;
    time: Date;
    private: boolean;
    userPrivate: UserPrivate;
    onConnect = false;
    onDisconnect = false;
}
