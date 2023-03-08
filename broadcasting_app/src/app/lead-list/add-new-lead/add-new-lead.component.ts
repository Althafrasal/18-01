import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopUPComponent } from 'src/app/shared/pop-up/pop-up.component';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx'


@Component({
  selector: 'app-add-new-lead',
  templateUrl: './add-new-lead.component.html',
  styleUrls: ['./add-new-lead.component.css']
})
export class AddNewLeadComponent implements OnInit {

  constructor(private popUp: MatDialog, private auth: AuthService, private fb: FormBuilder) {
    this.addLeadForm = this.fb.group({
      leadName: [''],
      message: [''],
      userid: [''],
      tenantid : ['']
    })

  }
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid')
    this.tenantid = localStorage.getItem('tenantID')
    this.adminid = localStorage.getItem('adminid')
  }


  addLeadForm !: FormGroup;
  messageData: any = {}
  ExcelData: any = []
  resData: any = []
  userid: any
  tenantid: any
  adminid : any
  popUpData = `The new lead updated successfully`

  readExcel(event: any) {
    let file = event.target.files[0]
    let fileReader = new FileReader()

    fileReader.readAsBinaryString(file)

    fileReader.onload = (e) => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' })
      var sheetNames = workbook.SheetNames
      this.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
      // console.log("hy",this.ExcelData);
    }
  }

  addLead() {
    // console.log("add", this.tenantid, this.adminid);
    this.addLeadForm.value.userid = this.userid
    this.addLeadForm.value.tenantid = this.tenantid
    this.addLeadForm.value.adminid = this.adminid
    const data = this.addLeadForm.value
    console.log(data);
    // console.log("hy add",this.ExcelData);
    this.auth.addLead(data).subscribe((res) => {
      if (res) {
        this.resData = res
        // console.log(res);
        // console.log("res",this.resData);
        const leadId = Object.values(this.resData.result)[2]
        let i = 0

        this.auth.addLeadNumber(this.userid,leadId,{data : this.ExcelData}).subscribe((res) => {
          console.log(res);
        })
        // console.log("excel",this.ExcelData);

        // for (this.ExcelData[i]; i < this.ExcelData.length; i++) {
        //   console.log(this.ExcelData[i]);
        //   const customerNum = this.ExcelData[i]
        //   this.messageData = { leadId: leadId, userId: this.userid, leadNumber: customerNum.numbers}
        //   this.auth.addLeadNumber(leadId, this.userid,this.ExcelData).subscribe((res) => {
        //     console.log(res);
        //   })
        // }
      }
      else {
        console.log('error');
      }
    })
    this.popUp.closeAll()
    this.popUp.open(PopUPComponent, { height: '300px', width: '500px', data: { message: this.popUpData } })


  }

}
