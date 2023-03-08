import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { PopUPComponent } from 'src/app/shared/pop-up/pop-up.component';
import * as XLSX from 'xlsx'


@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.css']
})
export class EditLeadComponent implements OnInit {
  constructor(private popUp: MatDialog, private auth: AuthService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public datas: any) {

    this.editLeadForm = this.fb.group({
      leadName: [''],
      message: [''],
      userid: ['']
    })

  }

  ngOnInit(): void {
    this.leadId = this.datas.id
    this.userid = localStorage.getItem('userid')


    this.auth.getLeadsByid(this.leadId).subscribe((res) => {
      console.log(res);
      this.editLeadForm.patchValue({
        leadName: res.data[0].leadname,
        message: res.data[0].messagebody,
        userid: this.userid

      })

    })

  }

  editLeadForm !: FormGroup;
  ExcelData: any = []
  messageData: any = {}
  resData: any = []
  userid: any
  leadId: any



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

  updateLead() {
    this.auth.updateLead(this.editLeadForm.value, this.leadId).subscribe((res) => {
      console.log(res);

      console.log("update", this.leadId,this.userid);


      if (this.ExcelData.length > 0) {
          this.auth.deleteLeadNumber(this.leadId).subscribe((res)=>{
            console.log(res);
            if (res) {
              this.resData = res
              // console.log(res);
              // console.log("res",this.resData);
              // const leadId = Object.values(this.resData.result)[2]
              let i = 0
              this.auth.addLeadNumber( this.userid,this.leadId,{data : this.ExcelData}).subscribe((res) => {
                console.log(res);
              })
              // for (this.ExcelData[i]; i < this.ExcelData.length; i++) {
              //   console.log(this.ExcelData[i]);
              //   const customerNum = this.ExcelData[i]
              //   // console.log(customerNum.numbers);
              //   this.messageData = { leadId: this.leadId, userId: this.userid, leadNumber: customerNum.numbers }
              //   this.auth.addLeadNumber(this.messageData).subscribe((res) => {
              //     console.log(res);
              //   })

              // }
            }

          })

      }


    })
    this.popUp.closeAll()
    this.popUp.open(PopUPComponent, { height: '300px', width: '500px', data: { message: "lead Updated successfully" } })

  }


}
