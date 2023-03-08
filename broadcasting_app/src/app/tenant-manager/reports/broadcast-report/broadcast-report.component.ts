import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-broadcast-report',
  templateUrl: './broadcast-report.component.html',
  styleUrls: ['./broadcast-report.component.css']
})
export class BroadcastReportComponent {

  getReportForm !: FormGroup

  constructor(private fb: FormBuilder,private popUp: MatDialog, @Inject(MAT_DIALOG_DATA) public datas: any, private auth: AuthService,private datePipe: DatePipe) {
    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
     totalItems : this.totalItems
    }
    this.getReportForm = this.fb.group({
      FromDate: [''],
      toDate: [''],
      agent: ['']
    })
   }

  currentPage: number = 1
  itemsPerPage: number = 10
  totalItems : number = 0
  pagingConfig: any

  notDelivereData : any = []
  deliveredData : any = []
  Delivered = false;
  NotDelivered = true;
  message: string = 'Not Delivered';
  isToggled: boolean = false;
  agent : any
  date: any

  ngOnInit(): void {
    this.date = Date()
    this.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    // console.log(this.datas.agent);
    this.agent = this.datas.agent
    this.auth.agentReportForNotDelivered(this.datas).subscribe((res: any) => {
      console.log("agentReportForNotDelivered",res);
      this.notDelivereData = res.data
      // console.log(this.notDelivereData);
    })
    this.auth.agentReportForDelivered(this.datas).subscribe((res: any) => {
      console.log("agentReportForDelivered",res);
      this.deliveredData = res.data
      // console.log(this.deliveredData);
    })
    this.auth.getDistinctStatus().subscribe((res : any)=>{
      console.log(res);

    })

  }
  report() {

    this.getReportForm.patchValue({
      agent: this.agent,
    })

    this.auth.agentReportForNotDelivered(this.getReportForm.value).subscribe((res: any) => {
      // console.log(res);
      this.notDelivereData = res.data
      console.log(this.notDelivereData);

    })
    this.auth.agentReportForDelivered(this.getReportForm.value).subscribe((res: any) => {
      // console.log(res);
      this.deliveredData = res.data
      console.log(this.deliveredData);

    })

    console.log(this.getReportForm.value);
  }

  exportNotDelivered() {
    this.auth.exportExcel(this.notDelivereData,'Not Delivered Broadcast');
  }
  exportDelivered(){
    this.auth.exportExcel(this.deliveredData,'Delivered Broadcast');
  }

  firstFuntion() {
    this.Delivered = false
    this.NotDelivered = true
    this.message = "Not Delivered"
  }
  secondFuntion() {
    this.Delivered = true
    this.NotDelivered = false
    this.message = "Delivered"
  }
  toggle() {
    if (this.isToggled) {
      this.firstFuntion()
    }
    else {
      this.secondFuntion()
    }
    this.isToggled = !this.isToggled
  }

  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event
  }
  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value
    this.pagingConfig.currentPage = 1
  }

}
