import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.model';
import { Message } from '../model/message.model';
import { ResponseError } from '../model/error.model';

const loadUsers = createAction('[User] all users load');
const loadedUsers = createAction('[User] all users loaded', props<{ users: User[] }>());
const loadedUser = createAction('[User] new user loaded', props<{ user: User }>());
const userConnect = createAction('[User] new user connect', props<{ user: User }>());
const userDisconnect = createAction('[User] new user disconnect', props<{ user: User }>());
const clearUser = createAction('[User] clear user disconnected');
const selectUser = createAction('[User] select a user', props<{ userSelected: User }>());
const postUser = createAction('[User] send a new user', props<{ user: User }>());
const sendMessage = createAction('[Message] send a new message', props<{ message: Message }>());
const receivedMessage = createAction('[Message] a new message received', props<{ message: Message }>());
const uploadFile = createAction('[Modal] upload file', props<{ file: File }>());
const changeImage = createAction('[Modal] someone changed your image', props<{ user: User }>());
const responseWithError = createAction('[Error] set response with error', props<{ error: ResponseError }>());

export const ChatActions = {
    loadUsers,
    loadedUsers,
    loadedUser,
    selectUser,
    userConnect,
    userDisconnect,
    postUser,
    clearUser,
    sendMessage,
    receivedMessage,
    uploadFile,
    changeImage,
    responseWithError
};
