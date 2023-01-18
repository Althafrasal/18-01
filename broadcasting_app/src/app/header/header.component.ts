import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddNewLeadComponent } from '../lead-list/add-new-lead/add-new-lead.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private popUp: MatDialog, private route: Router, private auth: AuthService) { }


  logout() {
    this.route.navigateByUrl('')
    localStorage.clear()
  }
  chat() {
    this.route.navigateByUrl('chat')
  }

  openAddNewLead() {
    this.popUp.open(AddNewLeadComponent, { width: '800px', height: '500px' });
  }
}
