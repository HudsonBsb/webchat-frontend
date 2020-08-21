import { Component, OnInit, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { Message } from 'src/app/model/message.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChatState } from 'src/app/store/chat.state';
import { ChatSelectors } from 'src/app/store/chat.selectors';
import { User } from 'src/app/model/user.model';
import { environment } from 'src/environments/environment';
import { ChatActions } from 'src/app/store/chat.actions';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Output() modalOpen = new EventEmitter<boolean>(false);
  @Output() toggleView = new EventEmitter<boolean>(false);
  message = '';
  messages: Message[] = [];
  messages$: Observable<Message[]>;
  user$: Observable<User>;
  readonly api = environment.api;

  constructor(private store: Store<ChatState>) { }

  ngOnInit() {
    this.messages$ = this.store.select(ChatSelectors.messages);
    this.user$ = this.store.select(ChatSelectors.user);
    this.messages$.subscribe(msgs => console.log('Message received in chat component: ', msgs));
  }

  getClassesAlignMessages(user: User, my: User): string {
    if (user) {
      const klass = 'd-flex mb-4 ';
      const startOrEnd = user.name === my.name ? 'justify-content-start' : 'justify-content-end';
      return klass.concat(startOrEnd);
    } else {
      return '';
    }
  }

  getImage(user: User): string {
    if (user.sex === 'f') {
      return 'assets/images/icon-profile-default-f.png';
    } else {
      return 'assets/images/icon-profile-default-m.png';
    }
  }

  sendMessage(): void {
    if (this.message !== '') {
      const message = new Message(this.message);
      message.message = this.message;
      this.store.dispatch(ChatActions.sendMessage({ message }));
      this.message = '';
    }
  }

  toggleMenu(menu: HTMLElement): void {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }

  toggleContacts(): void {
    this.toggleView.emit(true);
  }

  openModal() {
    this.modalOpen.emit(true);
  }
}
