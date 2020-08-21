import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { User } from '../model/user.model';
import { Message } from '../model/message.model';
import { UserService } from '../service/user.service';
import { environment } from 'src/environments/environment';
import { IndexComponent } from '../index/index.component';
import { Store } from '@ngrx/store';
import { ChatState } from '../store/chat.state';
import { ChatActions } from '../store/chat.actions';
import { ChatSelectors } from '../store/chat.selectors';

export class WebSocket {

    user: User;
    message: Message;
    path = '/topic';
    pathNewConnection = '/topic/connect/member';
    pathDisconnection = '/topic/disconnect/member';
    pathChangeImage = '/topic/image/change';
    ws = new SockJS(environment.ws);
    stompClient: Stomp = Stomp.over(this.ws);

    constructor(private userService: UserService, private store: Store<ChatState>) { }

    _connect(): void {
        this.stompClient.connect({}, () => this.setListeners(), this.errorCallBack);
    }

    _disconnect(): void {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }

    _send(message: Message): void {
        this.stompClient.send('/app/ws', {}, JSON.stringify(message));
    }

    _sendPrivate(message: Message, id: string): void {
        this.stompClient.send(`/app/ws/${id}/private`, {}, JSON.stringify(message));
    }

    errorCallBack(error: any): void {

        console.error('errorCallBack: ' + error);

        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    onMessageReceived(message: any): void {
        this.store.dispatch(ChatActions.receivedMessage({ message: JSON.parse(message) }));
    }

    onPrivateMessageReceived(message: any): void {
        this.store.dispatch(ChatActions.receivedMessage({ message: JSON.parse(message) }));
    }

    setListeners(): void {

        const id = this.ws._transport.url.split('/')[5];
        const pathPrivateMessages = `/topic/${id}/private`;
        const usr: User = this.userService.user;
        const user = new User(id, usr.name, usr.image, usr.sex);
        const header = { user: JSON.stringify(user) };

        this.stompClient.send('/app/ws/connect/new', header);

        this.stompClient.subscribe(this.path, (event) => {
            this.onMessageReceived(event.body);
        });

        this.stompClient.subscribe(pathPrivateMessages, (event) => {
            this.onPrivateMessageReceived(event.body);
        });

        this.stompClient.subscribe(this.pathNewConnection, (event) => {
            this.store.dispatch(ChatActions.userConnect({ user: JSON.parse(event.body) }));
        });

        this.stompClient.subscribe(this.pathDisconnection, (event) => {
            this.store.dispatch(ChatActions.userDisconnect({ user: JSON.parse(event.body) }));
        });

        this.stompClient.subscribe(this.pathChangeImage, (event) => {
            this.store.dispatch(ChatActions.loadUsers());
        });
    }
}
