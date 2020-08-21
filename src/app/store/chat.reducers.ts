import { ChatState } from './chat.state';
import { createReducer, on } from '@ngrx/store';
import { ChatActions } from './chat.actions';

const initialState: ChatState = {
    user: null,
    users: null,
    userSelected: null,
    messages: [],
    error: null
};

export const ChatReducers = createReducer(initialState,
    on(ChatActions.loadedUsers, (state, { users }) => ({ ...state, users })),
    on(ChatActions.loadedUser, (state, { user }) => ({ ...state, user })),
    on(ChatActions.clearUser, (state) => ({ ...state, user: null })),
    on(ChatActions.selectUser, (state, { userSelected }) => ({ ...state, userSelected })),
    on(ChatActions.receivedMessage, (state, { message }) => ({ ...state, messages: [...state.messages, message] })),
    on(ChatActions.responseWithError, (state, { error }) => ({ ...state, error })),
    on(ChatActions.userDisconnect, (state, { user }) => {
        const users = state.users.filter(usr => user.id !== usr.id);
        return ({ ...state, users });
    }),
);
