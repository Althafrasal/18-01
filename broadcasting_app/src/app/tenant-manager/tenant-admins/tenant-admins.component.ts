import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AddnewAdminComponent } from './addnew-admin/addnew-admin.component';
// import { EditTenantAdminComponent } from './edit-tenant-admin/edit-tenant-admin.component';


@Component({
  selector: 'app-tenant-admins',
  templateUrl: './tenant-admins.component.html',
  styleUrls: ['./tenant-admins.component.css']
})
export class TenantAdminsComponent {

  data: any = []
  tenantId: any
  id: any
  status = 0

  searchFilter: any
  orderHeader: string = ''
  isDescOrder: boolean = true
  pagingConfig: any

  currentPage: number = 1
  itemsPerPage: number = 10
  totalItems : number = 0

  constructor(private popUp: MatDialog, private auth: AuthService, @Inject(MAT_DIALOG_DATA) public datas: any) {


    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
     totalItems : this.totalItems
    }
  }

  ngOnInit(): void {
    console.log(this.datas.id);

    this.tenantId = this.datas.id
    this.getadmin(this.tenantId)
    this.auth.reload.subscribe(_response => {
      this.getadmin(this.tenantId)
    })

  }

  sort(headerName: string) {
    this.isDescOrder = !this.isDescOrder
    this.orderHeader = headerName

  }
  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event
    this.getadmin(this.tenantId)
  }
  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value
    this.pagingConfig.currentPage = 1
    this.getadmin(this.tenantId)
  }

  getadmin(id: any) {
    this.auth.getAdminByID(this.tenantId).subscribe((res: any) => {
      // console.log(this.tenantId);
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
    this.popUp.open(AddnewAdminComponent, { width: '400px', height: '400px', data: { dataKey: this.tenantId } })
  }
  // openEdit(id: any) {
  //   // console.log(id);
  //   this.popUp.open(EditTenantAdminComponent, { width: '800px', height: '400px', data: { dataKey: id } })
  // }


}
