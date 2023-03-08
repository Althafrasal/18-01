import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-addnew-admin',
  templateUrl: './addnew-admin.component.html',
  styleUrls: ['./addnew-admin.component.css']
})
export class AddnewAdminComponent implements OnInit {

  adminForm!:FormGroup
  tenantId:any


  constructor(private fb:FormBuilder,private auth : AuthService , private popUp : MatDialog,@Inject(MAT_DIALOG_DATA) public datas: any){

    this.adminForm=this.fb.group({
      username:[''],
      password:[''],
      tenantid:['']
    })

  }
  ngOnInit() :void{
    this.tenantId = this.datas.dataKey
    this.adminForm.patchValue({
      tenantid : this.datas.dataKey
    })

  }

  addAdmin(){
    this.auth.addNewAdmin(this.adminForm.value).subscribe((res)=>{
      console.log(res);
      this.popUp.closeAll()

    })

  }

}
