import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChatState } from 'src/app/store/chat.state';
import { ChatSelectors } from 'src/app/store/chat.selectors';
import { map } from 'rxjs/operators';
import { ChatActions } from 'src/app/store/chat.actions';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  @Output() toggleView = new EventEmitter<boolean>(false);
  @Output() modalOpen = new EventEmitter<boolean>(false);
  user$ = new Observable<User>();
  users$ = new Observable<User[]>();
  usersImmutable$ = new Observable<User[]>();
  userSelected: User;
  search: string;
  isRemoveIcon: boolean;
  file: File;
  readonly api = environment.api;

  constructor(public userService: UserService, private store: Store<ChatState>) {
  }

  ngOnInit() {
    this.user$ = this.store.select(ChatSelectors.user);
    this.users$ = this.store.select(ChatSelectors.users);
    this.usersImmutable$ = this.users$;
    this.store.select(ChatSelectors.userSelected)
      .subscribe(usr => this.userSelected = usr);
  }

  selectUser(user: User): void {
    if (isNullOrUndefined(this.userSelected)) {
      this.store.dispatch(ChatActions.selectUser({ userSelected: user }));
    } else if (!isNullOrUndefined(this.userSelected) && this.userSelected !== user) {
      this.store.dispatch(ChatActions.selectUser({ userSelected: user }));
    } else {
      this.store.dispatch(ChatActions.selectUser({ userSelected: null }));
    }
  }

  findUser(): void {
    if (this.search) {
      const name = this.search.toLocaleLowerCase();
      this.users$ = this.users$.pipe(
        map(users => users
          .filter(usr => usr.name.toLocaleLowerCase().indexOf(name) !== -1)));
      this.isRemoveIcon = true;
    } else {
      this.users$ = this.usersImmutable$;
      this.isRemoveIcon = false;
    }
  }

  clearSearch(): void {
    this.search = undefined;
    this.isRemoveIcon = false;
    this.users$ = this.usersImmutable$;
  }

  getImage(user: User): string {
    if (user.sex === 'f') {
      return 'assets/images/icon-profile-default-f.png';
    } else {
      return 'assets/images/icon-profile-default-m.png';
    }
  }

  toggleChat(): void {
    this.toggleView.emit(true);
  }

  toggleMenu(menu: HTMLElement): void {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }

  openModal() {
    this.modalOpen.emit(true);
  }
}
