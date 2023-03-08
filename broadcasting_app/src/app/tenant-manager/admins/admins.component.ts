import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AddnewAdminComponent } from '../tenant-admins/addnew-admin/addnew-admin.component';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent {
  id: any
  data: any = []
  status = 0
  userType: any
  tenantList = false
  tenantName : any

  searchFilter: any
  orderHeader: string = ''
  isDescOrder: boolean = true
  pagingConfig: any

  currentPage: number = 1
  itemsPerPage: number = 10
  totalItems: number = 0

  constructor(private route: ActivatedRoute, private popUp: MatDialog, private auth: AuthService) {
    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalItems: this.totalItems
    }
  }

  ngOnInit(): void {

    this.userType = localStorage.getItem('usertype')

    if (this.userType == "superadmin") {
      this.tenantList = true
      this.id = this.route.snapshot.paramMap.get('id')
      this.id = parseInt(this.id, 10) // string to int
    } if (this.userType == "admin") {
      this.id = localStorage.getItem("userid")
    }

    this.getadmin(this.id)
    this.auth.reload.subscribe(_response => {
      this.getadmin(this.id)
    })

    this.auth.getTenantName(this.id).subscribe((res : any) =>{
      this.tenantName = res.data[0].tenantName
      console.log( this.tenantName);
    })
  }
  sort(headerName: string) {
    this.isDescOrder = !this.isDescOrder
    this.orderHeader = headerName

  }
  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event
    // this.getadmin(this.id)
  }
  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value
    this.pagingConfig.currentPage = 1
    // this.getadmin(this.id)
  }

  getadmin(id: any) {
    // console.log("fun",id);
    this.auth.getAdminByID(id).subscribe((res: any) => {
      // console.log(this.id);
      // console.log(res);
      this.data = res.data
    })
  }

  deleteTenantAdmin(id: any) {
    // this.auth.deleteTenantAdmin(id).subscribe(res => {
    //   console.log("delete", res);
    // })
  }

  openAddNewAdmin() {
    this.popUp.open(AddnewAdminComponent, { width: '400px', height: '400px', data: { dataKey: this.id } })
  }
  // openEdit(id: any) {
  //   // console.log(id);
  //   this.popUp.open(EditTenantAdminComponent, { width: '800px', height: '400px', data: { dataKey: id } })
  // }


}





