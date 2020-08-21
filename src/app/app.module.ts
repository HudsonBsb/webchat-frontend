import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { UserActivate } from './guard/user.guard';
import { LoginRouteActivate } from './guard/login-route.guard';
import { ChatComponent } from './index/chat/chat.component';
import { ContactsComponent } from './index/contacts/contacts.component';
import { ModalComponent } from './index/modal/modal.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ChatReducers } from './store/chat.reducers';
import { ChatEffects } from './store/chat.effects';
import { ErrorComponent } from './error/error.component';
import { MaxLengthNamePipe } from './pipe/max-length.pipe';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    ChatComponent,
    ContactsComponent,
    ModalComponent,
    ErrorComponent,
    MaxLengthNamePipe
  ],
  imports: [
    StoreModule.forRoot({}),
    StoreModule.forFeature('chat', ChatReducers),
    EffectsModule.forRoot([ChatEffects]),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [UserActivate, LoginRouteActivate],
  bootstrap: [AppComponent]
})
export class AppModule { }
