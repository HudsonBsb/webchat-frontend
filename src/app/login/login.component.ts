import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../model/user.model';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChatState } from '../store/chat.state';
import { ChatActions } from '../store/chat.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../app.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('f', { static: false }) form: NgForm;
  @ViewChild('inputUserName', { static: false }) inputUserName: ElementRef;
  disabled = false;

  constructor(private store: Store<ChatState>) { }

  ngOnInit(): void { }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const user = new User();
      const value = form.value;
      user.name = value.userName;
      user.sex = value.sex;
      user.id = '';
      this.userRegister(user);
    }
  }

  userRegister(user: User): void {
    this.store.dispatch(ChatActions.postUser({ user }));
  }

  // userRegisterError(err: any): void {
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Opa...',
  //     text: err.error && err.error.message || 'Erro interno, tente novamente mais tarde.',
  //     onAfterClose: () => {
  //       this.form.onReset();
  //       this.inputUserName.nativeElement.focus();
  //     }
  //   });
  // }
}
