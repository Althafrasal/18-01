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
      userid: ['']
    })

  }
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid')

  }


  addLeadForm !: FormGroup;
  messageData: any = {}
  ExcelData: any = []
  resData: any = []
  userid: any
  popUpData = `The new lead updated successfully`

  readExcel(event: any) {
    let file = event.target.files[0]
    let fileReader = new FileReader()

    fileReader.readAsBinaryString(file)

    fileReader.onload = (e) => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' })
      var sheetNames = workbook.SheetNames
      this.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])

    }
  }

  addLead() {
    const data = this.addLeadForm.value
    console.log(data);
    this.addLeadForm.value.userid = this.userid

    this.auth.addLead(data).subscribe((res) => {
      if (res) {
        this.resData = res
        const leadId = Object.values(this.resData.result)[2]

        let i = 0
        for (this.ExcelData[i]; i <= this.ExcelData.length; i++) {
          // console.log(this.ExcelData[i]);
          const customerNum = this.ExcelData[i]
          console.log(customerNum.number);

          this.messageData = { leadId: leadId, userId: this.userid, leadNumber: customerNum.number}

          this.auth.addLeadNumber(this.messageData).subscribe((res) => {
            console.log(res);

          })

        }
      }
      else {
        console.log('error');

      }
    })
  }
  import() {
    this.popUp.open(PopUPComponent, { height: '300px', width: '500px', data: { message: this.popUpData } })
  }

}
