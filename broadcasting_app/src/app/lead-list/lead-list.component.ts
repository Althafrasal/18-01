import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopUPComponent } from '../shared/pop-up/pop-up.component';
import { AddNewLeadComponent } from './add-new-lead/add-new-lead.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';


@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {
  data: any = []
  broadcastData: any
  broadcasted = false;
  toBroadcast = true;
  message: string = 'To Broadcast';
  isToggled: boolean = false;
  senderNumber: any;
  loginUserID: any
  refreshPage: any
  refreshDistinct: any


  constructor(private popUp: MatDialog, private route: Router, private auth: AuthService) {
    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
     totalItems : this.totalItems
    }
   }

  currentPage: number = 1
  itemsPerPage: number = 10
  totalItems : number = 0
  pagingConfig: any

  ngOnInit(): void {
    this.loginUserID = localStorage.getItem('userid')
    this.getleads()
    this.auth.reload.subscribe((response) => {
      this.getleads()
    })
    this.getBroadcastedLeads()
    this.auth.reload.subscribe((response) => {
      this.getBroadcastedLeads()
    })
  }

  firstFuntion() {
    this.toBroadcast = true
    this.broadcasted = false
    this.message = "To Broadcast"
  }
  secondFuntion() {
    this.toBroadcast = false
    this.broadcasted = true
    this.message = "Broadcasted"
  }
  toggle() {
    if (this.isToggled) {
      this.firstFuntion()
    }
    else {
      this.secondFuntion()
    }
    this.isToggled = !this.isToggled
  }

  getleads() {
    this.auth.getLead(this.loginUserID).subscribe((data: any) => {
        this.data = data.result;
        console.log(this.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getBroadcastedLeads() {
    this.auth.getBroadcastedLeads(this.loginUserID).subscribe((data: any) => {
        // console.log(data);
        this.broadcastData = data.result;
        console.log("broadcasted", this.broadcastData);
      },
      (error) => {
        console.log(error);
        // alert(error)
      }
    );
  }

  broadCast(leadsId: any) {
    console.log(leadsId);
    this.auth.broadcastMessage(leadsId).subscribe(res => {
      console.log(res);
      if (res) {
        this.popUp.open(PopUPComponent, { width: '500px', height: '300px', data: { message: "Broadcasted successfully" } });
      }
    })
  }
  openAddNewLead() {
    this.popUp.open(AddNewLeadComponent, { width: '800px', height: '500px' });
  }

  editLead(id : any) {
    this.popUp.open(EditLeadComponent, { width: '800px', height: '500px', data: { id: id } });

  }

  // saveBroadCast(){
  //   console.log("hy");

  //   this.auth.saveBroadCast().subscribe(res=>{
  //     console.log(res);

  //   })
  // }
  logout() {
    this.route.navigateByUrl('')
    localStorage.clear()

  }
  deleteLead(id: any) {
    this.auth.deleteLeadList(id).subscribe(res => {
      console.log(res);
      this.popUp.open(PopUPComponent, { width: '500px', height: '300px', data: { message: " Lead deleted Successfully " } })
    })
  }

  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event
  }
  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value
    this.pagingConfig.currentPage = 1
  }


}
