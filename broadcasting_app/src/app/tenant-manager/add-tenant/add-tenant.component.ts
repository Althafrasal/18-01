import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-add-tenant',
  templateUrl: './add-tenant.component.html',
  styleUrls: ['./add-tenant.component.css']
})
export class AddTenantComponent {

  title: string = ''

  addTenantForm!: FormGroup
  popName: any;
  popUpData: any;
  data: any
  scud: any = {}
  error: any
  isReadOnly: boolean = false
  selectedItem: any;
  ScudAr: any = []


  constructor(private fb: FormBuilder, private auth: AuthService, private popUp: MatDialog) {
    this.addTenantForm = this.fb.group({
      tenantName: ['', [Validators.required]],
      defaultAddress: ['']
    })

  }
  ngOnInit(): void {


  }

  addTenant() {
    this.auth.addTenant(this.addTenantForm.value).subscribe((res) => {
      console.log(res);

      this.popUp.closeAll()
    })



  }






}



