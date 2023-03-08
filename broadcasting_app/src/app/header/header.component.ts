import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {


  agent: any = false
  superAdmin: any = false
  username: any
  usertype: any
  admin : any = false 

  constructor(private popUp: MatDialog, private route: Router, private auth: AuthService) { }

  ngOnInit(): void {

    this.username = localStorage.getItem('number')
    this.usertype = localStorage.getItem('usertype')

    if(this.usertype== "superadmin"){
     this.superAdmin = true
    }
    if(this.usertype =="agent"){
      this.agent = true
    }
    if(this.usertype == "admin"){
      this.admin = true
    }
  }


  logout() {
    this.route.navigateByUrl('')
    localStorage.clear()

  }





}
