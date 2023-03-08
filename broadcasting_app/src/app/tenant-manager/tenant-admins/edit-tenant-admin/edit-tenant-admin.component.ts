// import { Component, Inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'app-edit-tenant-admin',
//   templateUrl: './edit-tenant-admin.component.html',
//   styleUrls: ['./edit-tenant-admin.component.css']
// })
// export class EditTenantAdminComponent {
//   isReadonly = true
//   editTenantAdminForm!:FormGroup
//   id:any
//   data:any


//   constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public datas: any, private auth: AuthService, private popUp: MatDialog) {
//     this.editTenantAdminForm = this.fb.group({
//       name:[''],
//       email:[''],
//       phonenumber:[''],
//       username:[''],
//       password:[''],
//       tenant:['']
//     })

//   }

//   ngOnInit(){
//     this.id = this.datas.dataKey
//     // console.log(this.id);

//     // this.auth.getAdminById(this.id).subscribe((res) => {
//     //   console.log(res);
//     //   this.editTenantAdminForm.patchValue({
//     //     name:res.data[0].name,
//     //     email:res.data[0].email,
//     //     phonenumber:res.data[0].phonenumber,
//     //     username:res.data[0].username,
//     //     password:res.data[0].password,
//     //     tenant:['']

//     //   })

//     // })
//   }


// editAdmin(){
//   // this.auth.updateAdmin(this.editTenantAdminForm.value,this.id).subscribe((res)=>{

//   //   // this.popName = this.editTenantForm.value.tenantName
//   //   // this.popUpData = `The tenant data for ${this.popName} updated successfully`
//   //   if(res){
//   //     console.log(res);
//   //     this.editTenantAdminForm.reset()

//   //   }
//   //   else{
//   //     console.log("err");

//   //   }
//   // })


// }

// }
