import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-new-agent',
  templateUrl: './add-new-agent.component.html',
  styleUrls: ['./add-new-agent.component.css']
})
export class AddNewAgentComponent implements OnInit {

  addAgentForm!:FormGroup
  Userid:any
  TenantId:any

  constructor(private fb:FormBuilder,private auth:AuthService,private popUp:MatDialog){
    this.addAgentForm=this.fb.group({
      username:[''],
      password:[''],
      tenantid:[''],
      userid:['']
    })

  }
  ngOnInit() :void{
    this.Userid=localStorage.getItem("userid")
    this.TenantId=localStorage.getItem("tenantID")

    this.addAgentForm.patchValue({
      userid:this.Userid,
      tenantid:this.TenantId


    })


  }

  addAgent(){
    this.auth.addAgents(this.addAgentForm.value).subscribe((res)=>{
      console.log(res);

       this.popUp.closeAll()

    })

  }


}
