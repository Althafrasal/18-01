import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { AddNewLeadComponent } from './lead-list/add-new-lead/add-new-lead.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PopUPComponent } from './shared/pop-up/pop-up.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LeadListComponent,
    AddNewLeadComponent,
    PopUPComponent,
    LoginComponent,
    ChatComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,HttpClientModule,
    AppRoutingModule,MatDialogModule,BrowserAnimationsModule,MatSlideToggleModule,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
