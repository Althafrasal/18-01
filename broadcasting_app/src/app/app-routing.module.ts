import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './services/authentication.guard';
import { AdminsComponent } from './tenant-manager/admins/admins.component';
import { AgentsComponent } from './tenant-manager/agents/agents.component';
import { ReportsComponent } from './tenant-manager/reports/reports.component';
import { TenantDetailsComponent } from './tenant-manager/tenant-details/tenant-details.component';
import { TenantManagerComponent } from './tenant-manager/tenant-manager.component';


const routes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'leadlist', component: LeadListComponent,canActivate:[AuthenticationGuard] },
  {path: 'chat', component: ChatComponent,canActivate:[AuthenticationGuard]  },
  {path: 'chat/:id/:user', component: ChatComponent,canActivate:[AuthenticationGuard]  },
  {path : "tenantmanager", component : TenantManagerComponent},
  {path : "tenantDetails/:id" , component: TenantDetailsComponent},
  {path : "admins/:id"  , component : AdminsComponent},
  {path : "agent/:id", component : AgentsComponent},
  {path : "report/:id" , component : ReportsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
