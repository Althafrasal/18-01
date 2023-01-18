import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable({ providedIn: 'root' })


export class LoginComponent implements OnInit {

  loginForm !: FormGroup ;
  resToken : any = []
  resData : any =[]

  constructor(private auth : AuthService,private fb: FormBuilder,private route : Router){
    this.loginForm = this.fb.group({
      username: [''],
      password:[''],
    })

  }
  ngOnInit(): void {
  }

  login(){
    const data=this.loginForm.value
    console.log(data);
     this.auth.login(data).subscribe((res)=>{

      this.resToken = Object.values(res)[1]
      this.resData = Object.values(res)[2]

      // console.log(this.resData[0].userid);

      localStorage.setItem('token',this.resToken)
      localStorage.setItem('userid',this.resData[0].userid)

      this.route.navigateByUrl('/leadlist')

    console.log(res);

    })
  }

}
