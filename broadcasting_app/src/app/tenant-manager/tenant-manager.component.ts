import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { AddTenantComponent } from './add-tenant/add-tenant.component';
import { TenantAdminsComponent } from './tenant-admins/tenant-admins.component';

@Component({
  selector: 'app-tenant-manager',
  templateUrl: './tenant-manager.component.html',
  styleUrls: ['./tenant-manager.component.css']
})
export class TenantManagerComponent {

  data: any = []
  searchFilter: any

  constructor(private auth: AuthService, private popUp: MatDialog) {}

  ngOnInit(): void {

    this.getTenant()
    this.auth.reload.subscribe((_response) => {
      this.getTenant()
    })

  }

  getTenant() {
    this.auth.getTenant().subscribe(res => {
      this.data = res.data
      console.log(res);

    })
  }

  openAddNewTenant() {
    this.popUp.open(AddTenantComponent, { width: '400px', height: '400px' })
  }
  openAdmin(id: any) {
    this.popUp.open(TenantAdminsComponent, { width: '800px', height: '500px', data: { id: id } })
  }


}

  // firstFuntion() {
  //   this.Active = true
  //   this.nonActive = false
  //   this.message = "Active Tenants"

  // }
  // secondFuntion() {
  //   this.Active = false
  //   this.nonActive = true
  //   this.message = "In Active Tenants"


  // }
  // toggle() {
  //   if (this.isToggled) {
  //     this.firstFuntion()
  //   }
  //   else{
  //     this.secondFuntion()
  //   }
  //   this.isToggled = !this.isToggled

  // }



  // sort(headerName: string) {
  //   this.isDescOrder = !this.isDescOrder
  //   this.orderHeader = headerName
  // }
  // onTableDataChange(event: any) {
  //   this.pagingConfig.currentPage = event
  //   this.fetchData()
  // }
  // onTableSizeChange(event: any): void {
  //   this.pagingConfig.itemsPerPage = event.target.value
  //   this.pagingConfig.currentPage = 1
  //   this.fetchData()
  // }





