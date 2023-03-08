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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from './header/header.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuthguardServiceService } from './services/authguard-service.service';
import { EditLeadComponent } from './lead-list/edit-lead/edit-lead.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TenantManagerComponent } from './tenant-manager/tenant-manager.component';
import { AddTenantComponent } from './tenant-manager/add-tenant/add-tenant.component';
import { EditTenantComponent } from './tenant-manager/edit-tenant/edit-tenant.component';
import { TenantAdminsComponent } from './tenant-manager/tenant-admins/tenant-admins.component';
import { AddnewAdminComponent } from './tenant-manager/tenant-admins/addnew-admin/addnew-admin.component';
import { TenantDetailsComponent } from './tenant-manager/tenant-details/tenant-details.component';
import { AdminsComponent } from './tenant-manager/admins/admins.component';
import { AgentsComponent } from './tenant-manager/agents/agents.component';
import { ReportsComponent } from './tenant-manager/reports/reports.component';
import { AddNewAgentComponent } from './tenant-manager/agents/add-new-agent/add-new-agent.component';
import { BroadcastReportComponent } from './tenant-manager/reports/broadcast-report/broadcast-report.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
  AppComponent,LeadListComponent,AddNewLeadComponent,PopUPComponent,LoginComponent,ChatComponent,HeaderComponent,EditLeadComponent,
  TenantManagerComponent,AddTenantComponent,EditTenantComponent,TenantAdminsComponent, AddnewAdminComponent, TenantDetailsComponent,
  AdminsComponent, AgentsComponent, ReportsComponent, AddNewAgentComponent, BroadcastReportComponent
  ],
  imports: [
    BrowserModule,HttpClientModule,NgxPaginationModule,MatFormFieldModule ,
    AppRoutingModule,MatDialogModule,BrowserAnimationsModule,MatSlideToggleModule,ReactiveFormsModule,FormsModule,Ng2SearchPipeModule,

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy},AuthguardServiceService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
