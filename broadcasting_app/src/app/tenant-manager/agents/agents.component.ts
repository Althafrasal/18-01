import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AddNewAgentComponent } from './add-new-agent/add-new-agent.component';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent {
  data: any
  id: any
  userType: any;
  tenantList: any
  tenantName: any

  searchFilter: any
  orderHeader: string = ''
  isDescOrder: boolean = true

  constructor(private route: ActivatedRoute, private auth: AuthService, private popUp: MatDialog, private router: Router) {
    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalItems: this.totalItems
    }
  }

  currentPage: number = 1
  itemsPerPage: number = 10
  totalItems: number = 0
  pagingConfig: any

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.id = parseInt(this.id, 10)
    this.userType = localStorage.getItem('usertype')

    if (this.userType == "superadmin") {
      this.getAgentsBytenantid()
      this.tenantList = true
      this.auth.getTenantName(this.id).subscribe((res: any) => {
        this.tenantName = res.data[0].tenantName
        console.log(this.tenantName);
      })
    }
    else {
      this.getAgents()
    }
    this.auth.reload.subscribe(_response => {
      this.getAgents()
    })
  }

  getAgents() {
    // console.log("fun",this.id);
    this.auth.getAgents(this.id).subscribe((res: any) => {
      // console.log(this.id);
      // console.log("by admin", res);
      this.data = res.data
    })
  }
  getAgentsBytenantid() {

    this.auth.getAgentsBytenantid(this.id).subscribe((res: any) => {
      // console.log("by tenant",res);
      this.data = res.data
    })
  }

  getchat(id: any , agent : any) {
    // console.log("idddddd" , id ,user );
    this.router.navigate(["/chat",{id,agent}])
  }

  openAddNewAgent() {
    this.popUp.open(AddNewAgentComponent, { width: '400px', height: '400px' })
  }

  sort(headerName: string) {
    this.isDescOrder = !this.isDescOrder
    this.orderHeader = headerName
  }
  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event

    // if(this.userType == "superadmin"){
    //   this.getAgentsBytenantid()
    // }
    // else
    // this.getAgents()
  }
  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value
    this.pagingConfig.currentPage = 1

    // if(this.userType == "superadmin"){
    //   this.getAgentsBytenantid()
    // }
    // else
    // this.getAgents()
  }

}
