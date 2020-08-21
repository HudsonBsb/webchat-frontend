import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { ChatState } from '../store/chat.state';
import { ChatSelectors } from '../store/chat.selectors';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(private store: Store<ChatState>) { }

  ngOnInit() {
    this.store.select(ChatSelectors.error)
      .subscribe(error => {
        if (!isNullOrUndefined(error)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error && error.message || 'Algo deu errado, tente novamente em alguns instantes.',
          });
        }
      });
  }

}
