import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from '../service/user.service';
import { ChatActions } from './chat.actions';
import { mergeMap, catchError, map, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import { User } from '../model/user.model';
import { EMPTY, of } from 'rxjs';
import { ChatState } from './chat.state';
import { Router } from '@angular/router';
import { ChatSelectors } from './chat.selectors';
import { Message } from '../model/message.model';
import { UserPrivate } from '../model/user-private.model';
import { WebSocket } from '../websocket/websocket.config';
import { ResponseError } from '../model/error.model';
import { isNullOrUndefined } from 'util';

@Injectable()
export class ChatEffects {

    private ws: WebSocket;

    constructor(
        private actions$: Actions,
        private service: UserService,
        private store: Store<ChatState>,
        private router: Router,
        private userService: UserService
    ) {
        this.ws = new WebSocket(this.service, this.store);
    }

    loadUsers$ = createEffect(() => this.actions$.pipe(
        ofType(ChatActions.loadUsers),
        mergeMap(() => this.service.get().pipe(
            map((users: User[]) => ChatActions.loadedUsers({ users })),
            catchError(error => of(ChatActions.responseWithError({ error: this.getResponseError(error) })))
        ))
    ));

    newUser$ = createEffect(() => this.actions$.pipe(
        ofType(ChatActions.postUser),
        mergeMap((action) => this.service.post(action.user).pipe(
            map(() => {
                this.userService.userAndCookie = action.user;
                this.router.navigate(['/']);
                return ChatActions.loadedUser({ user: action.user });
            }),
            catchError(error => of(ChatActions.responseWithError({ error: this.getResponseError(error) })))
        ))
    ));

    uploadFile$ = createEffect(() => this.actions$.pipe(
        ofType(ChatActions.uploadFile),
        mergeMap(action => this.userService.upload(action.file).pipe(
            map(user => {
                this.userService.userAndCookie = user;
                return ChatActions.loadedUser({ user });
            }),
            catchError(error => of(ChatActions.responseWithError({ error: this.getResponseError(error) })))
        ))
    ));

    connectUser$ = createEffect(() => this.actions$.pipe(
        ofType(ChatActions.userConnect),
        withLatestFrom(this.store.select(ChatSelectors.user), this.store.select(ChatSelectors.users)),
        tap(([action, user, users]) => {
            if (action.user.name === user.name) {
                this.userService.userAndCookie = action.user;
                this.store.dispatch(ChatActions.loadedUser({ user: action.user }));
            } else {
                this.store.dispatch(ChatActions.loadedUsers({ users: [...users, action.user] }));
                this.sendMessage(action.user, 'entrou.');
            }
        })
    ), { dispatch: false });

    disconnectUser$ = createEffect(() => this.actions$.pipe(
        ofType(ChatActions.userDisconnect),
        withLatestFrom(
            this.store.select(ChatSelectors.user), this.store.select(ChatSelectors.users), this.store.select(ChatSelectors.userSelected)),
        tap(([action, user, users, selected]) => {
            if (action.user.name === user.name) {
                this.userService.clearUser();
                this.store.dispatch(ChatActions.clearUser());
            } else {
                if (selected && selected.name === action.user.name) {
                    this.store.dispatch(ChatActions.selectUser({ userSelected: null }));
                }
                this.sendMessage(action.user, 'saiu.');
            }
            users = users.filter(usr => usr.id !== action.user.name);
            this.store.dispatch(ChatActions.loadedUsers({ users }));
        })
    ), { dispatch: false });

    sendMessage$ = createEffect(() => this.actions$.pipe(
        ofType(ChatActions.sendMessage),
        withLatestFrom(this.store.select(ChatSelectors.user), this.store.select(ChatSelectors.userSelected)),
        tap(([action, user, selected]) => {
            const message = new Message(action.message.message, user);
            if (selected) {
                const prvt = new UserPrivate();
                prvt.name = selected.name;
                message.userPrivate = prvt;
                this.ws._sendPrivate(message, selected.id);
            } else {
                this.ws._send(message);
            }
        })
    ), { dispatch: false });

    // imageChanged$ = createEffect(() => this.actions$.pipe(
    //     ofType(ChatActions.changeImage),
    //     withLatestFrom(this.store.select(ChatSelectors.users)),
    //     map(([action, users]) => {
    //         const user: User = action.user;
    //         return Object.assign(users);
    //     }),
    //     tap(users => {
    //         this.store.dispatch(ChatActions.loadedUsers({ users }));
    //     })
    // ), { dispatch: false });

    getResponseError(err: any): ResponseError {
        const error = new ResponseError();
        if (!isNullOrUndefined(err) && err.error) {
            error.status = err.status;
            error.type = err;
            error.message = err.error.message;
        }
        return error;
    }

    sendMessage(user: User, msg: 'entrou.' | 'saiu.'): void {
        const message = new Message(msg);
        message.message = `${user.name} ${msg}`;
        message.onConnect = msg === 'entrou.';
        message.onDisconnect = msg === 'saiu.';
        this.store.dispatch(ChatActions.receivedMessage({ message }));
    }
}
