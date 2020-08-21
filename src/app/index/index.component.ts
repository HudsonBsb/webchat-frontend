import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { WebSocket } from '../websocket/websocket.config';
import { UserService } from '../service/user.service';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { ChatState } from '../store/chat.state';
import { ChatActions } from '../store/chat.actions';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild(ModalComponent, { static: true }) modal: ModalComponent;
  @ViewChild('contactsView', { static: true }) contacts: ElementRef;
  @ViewChild('chatView', { static: true }) chat: ElementRef;
  ws: WebSocket;

  public readonly api = environment.api;

  @HostListener('window:resize', ['$event.target.screen'])
  onSize(screen: Screen): void {
    const viewContact: HTMLElement = this.contacts.nativeElement;
    const viewChat: HTMLElement = this.chat.nativeElement;
    if (screen.width > 576) {
      viewContact.style.display = 'block';
      viewChat.style.display = 'block';
    } else {
      viewContact.style.display = 'none';
      viewChat.style.display = 'block';
    }
  }

  constructor(private userService: UserService, private store: Store<ChatState>) {
    this.ws = new WebSocket(userService, this.store);
  }

  ngOnInit(): void {
    this.ws._connect();
    this.store.dispatch(ChatActions.loadUsers());
  }

  onOpenModal(): void {
    this.modal.openModal();
  }

  toggleViews(from: 'chat' | 'contact'): void {
    const viewContact: HTMLElement = this.contacts.nativeElement;
    const viewChat: HTMLElement = this.chat.nativeElement;
    if (from === 'contact') {
      viewContact.style.display = 'none';
      viewChat.style.display = 'block';
    } else {
      viewContact.style.display = 'block';
      viewChat.style.display = 'none';
    }
  }
}
