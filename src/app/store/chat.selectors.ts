import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.state';

const chat = createFeatureSelector<ChatState>('chat');
const user = createSelector(chat, (state) => state.user);
const users = createSelector(chat, (state) => state.users);
const userSelected = createSelector(chat, (state) => state.userSelected);
const messages = createSelector(chat, (state) => state.messages.length ? state.messages : null);
const error = createSelector(chat, (state) => state.error);

export const ChatSelectors = {
    chat, user, users, userSelected, messages, error
};
