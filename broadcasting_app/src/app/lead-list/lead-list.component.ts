import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewLeadComponent } from './add-new-lead/add-new-lead.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {
  data: any = []
  broadcastData: any

  constructor(private popUp: MatDialog, private route: Router, private auth: AuthService) { }
  ngOnInit(): void {
    this.getleads()

  }


  getleads() {
    this.auth.getLead().subscribe(
      (data: any) => {
        // console.log(data);
        this.data = data.result;
        console.log(this.data);

      },
      (error) => {
        console.log(error);
        // alert(error)
      }
    );
  }
  

  broadCast() {
    this.auth.getMessage().subscribe(res => {
      console.log(res);

    })
  }


}
