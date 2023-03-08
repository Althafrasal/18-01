import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopUPComponent } from '../shared/pop-up/pop-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable({ providedIn: 'root' })


export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  resToken: any = []
  resData: any = []
  resMessage: any = []
  usertype: any
  userId: any
  tenantid: any

  constructor(private auth: AuthService, private fb: FormBuilder, private route: Router, private popUp: MatDialog) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    })

  }
  ngOnInit(): void {
  }

  login() {
    const data = this.loginForm.value
    // console.log(data);
    this.auth.login(data).subscribe((res) => {
      console.log('result', res);
      this.resMessage = res

      if (this.resMessage.message == "logged in") {
        this.userId = this.resMessage.data[0].userid
        this.tenantid = this.resMessage.data[0].tenantid
        if (this.resMessage.data) {
          this.usertype = this.resMessage.data[0].usertype
        }
        if (this.usertype == "superadmin") {
          this.route.navigateByUrl('/tenantmanager')
        }
        else if (this.usertype == "admin") {
          this.route.navigateByUrl(`/report/${this.userId}`)
        }
        else {
          this.route.navigateByUrl('/chat')
        }
      }
      else {
        // console.log("hy am popup");
        this.popUp.open(PopUPComponent, { width: '500px', height: '300px', data: { message: this.resMessage.message } });
      }

      this.resToken = Object.values(res)[1]
      this.resData = Object.values(res)[2]

      // console.log(this.resData[0].userid);

      localStorage.setItem('token', this.resToken)
      localStorage.setItem('userid', this.resData[0].userid)
      localStorage.setItem('number', this.resData[0].username)
      localStorage.setItem('usertype', this.usertype)
      localStorage.setItem('tenantID', this.tenantid)
      localStorage.setItem('adminid',this.resData[0].adminid)

    })
    this.loginForm.reset()

  }

}
