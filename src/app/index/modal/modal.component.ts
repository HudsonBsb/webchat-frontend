import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user.model';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChatState } from 'src/app/store/chat.state';
import { ChatActions } from 'src/app/store/chat.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @ViewChild('modal', { static: true }) modal: ElementRef;
  @ViewChild('inputLabel', { static: true }) label: ElementRef;
  @ViewChild('imageToChange', { static: true }) image: ElementRef;
  readonly api = environment.api;
  file: File;

  constructor(public userService: UserService, private store: Store<ChatState>) { }

  ngOnInit() {
  }

  changeFile(e: any) {
    const file: File = this.validateFile(e.target.files[0]);
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event: any) => {
        if (!event.target.error && event.target.result) {
          const imageBase64 = 'data:image/png;base64,' + btoa(event.target.result);
          this.image.nativeElement.src = imageBase64;
        }
      };
    }
  }

  validateFile(file: File): File {
    if (!isNullOrUndefined(file)) {
      if (file.type.split('/').shift() !== 'image') {
        Swal.fire('Escolha uma imagem!', '', 'error');
        return;
      }
      if (file.name.length > 25) {
        this.label.nativeElement.innerText = file.name.match(/.{0,25}/g)[0].concat('...');
      } else {
        this.label.nativeElement.innerText = file.name;
      }
      if(file.size > 10240){
        Swal.fire('Imagem maior que o máximo suportado de 10MB, escolha uma imagem de menor tamanho!', '', 'error');
        return;
      }
      return file as File;
    }
  }

  saveImage(): void {
    if (!isNullOrUndefined(this.file)) {
      this.store.dispatch(ChatActions.uploadFile({ file: this.file }));
      this.closeModal();
    }
  }

  getImage(user: User): string {
    if (user.sex === 'f') {
      return 'assets/images/icon-profile-default-f.png';
    } else {
      return 'assets/images/icon-profile-default-m.png';
    }
  }

  openModal(): void {
    this.modal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.file = null;
    this.label.nativeElement.innerText = null;
    this.image.nativeElement.src = this.userService.user.image ?
      this.api + this.userService.user.image : this.getImage(this.userService.user);
    this.modal.nativeElement.style.display = 'none';
  }
}
