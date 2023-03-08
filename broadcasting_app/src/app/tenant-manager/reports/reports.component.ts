import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BroadcastReportComponent } from './broadcast-report/broadcast-report.component';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  id: any
  userType: any
  tenantList: any
  tenantName: any
  totalAgents: any
  getReportForm !: FormGroup
  totalMessages: any
  deliveredMessages: any
  notDeliveredMessages: any
  messageReportData: any
  broadcastReportData: any
  date: any
  today: any
  loading = false
  exportButton = false
  noData = false


  constructor(private route: ActivatedRoute, private auth: AuthService, private fb: FormBuilder,
    private datePipe: DatePipe, private popUp: MatDialog) {
    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalItems: this.totalItems
    }
    this.getReportForm = this.fb.group({
      FromDate: [''],
      ToDate: [''],
      id: ['']
    })
  }

  messageReport = false;
  broadCastReport = true;
  message: string = 'Toggle to message report';
  isToggled: boolean = false;
  agent: any

  currentPage: number = 1
  itemsPerPage: number = 10
  totalItems: number = 0
  pagingConfig: any

  ngOnInit(): void {

    this.date = Date()
    this.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    // console.log(this.date);

    this.userType = localStorage.getItem('usertype')
    this.id = this.route.snapshot.paramMap.get('id')
    // console.log(this.id);
    if (this.userType == "superadmin") {
      this.tenantList = true
      this.auth.getTenantName(this.id).subscribe((res: any) => {
        this.tenantName = res.data[0].tenantName
        // console.log(this.tenantName);
      })
      this.getAgentCount()
      this.getTotalMessages()
      this.getDeliveredMessages()
      this.getNotDeliveredMessages()
    } else {
      this.getAdminAgentCount()
      this.getAdminTotalMessages()
      this.getAdminDeliveredMessage()
      this.getAdminNotDeliveredMessage()
    }
  }

  report() {
    this.loading = true
    this.exportButton = true
    this.getReportForm.patchValue({
      id: this.id,
    })
    if (this.userType == "superadmin") {
      this.auth.getMessageReportForTenant(this.getReportForm.value).subscribe((res: any) => {
        this.messageReportData = res.data
        this.loading = false
        if (this.messageReportData == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        console.log("report", this.messageReportData);
      })
      this.auth.getBroadcastReportForTenant(this.getReportForm.value).subscribe((res: any) => {
        this.broadcastReportData = res.data
        this.loading = false
        if (this.broadcastReportData == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        console.log("getBroadcastReportForTenant", res);
      })
    } else {
      this.auth.getMessageReportForAdmin(this.getReportForm.value).subscribe((res: any) => {
        this.messageReportData = res.data
        this.loading = false
        if (this.messageReportData == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        console.log("admin", res);
      })
      this.auth.getBroadcastReportForAdmin(this.getReportForm.value).subscribe((res: any) => {
        this.broadcastReportData = res.data
        this.loading = false
        if (this.broadcastReportData == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        console.log("getBroadcastReportForTenant", res);
      })
    }
    console.log(this.getReportForm.value);
  }
  getAgentCount() {
    this.auth.getTenantAgentCount(this.id).subscribe((res: any) => {
      // console.log("count",res.data[0].countNumbers);
      this.totalAgents = res.data[0].countNumbers
    })
  }

  getTotalMessages() {
    this.auth.getTotalMessages(this.id).subscribe((res: any) => {
      this.totalMessages = res.data[0].MessageCount
      // console.log("message", res);
    })
  }
  getDeliveredMessages() {
    this.auth.getDeliveredMessages(this.id).subscribe((res: any) => {
      this.deliveredMessages = res.data[0].deliveredMessages
    })
  }

  getNotDeliveredMessages() {
    this.auth.getNotDeliveredMessages(this.id).subscribe((res: any) => {
      this.notDeliveredMessages = res.data[0].NotdeliveredMessages
    })
  }

  getAdminAgentCount() {
    this.auth.getAdminAgentCount(this.id).subscribe((res: any) => {
      this.totalAgents = res.data[0].agentCount
    })
  }

  getAdminTotalMessages() {
    this.auth.getAdminTotalMessages(this.id).subscribe((res: any) => {
      this.totalMessages = res.data[0].MessageCount
    })
  }

  getAdminDeliveredMessage() {
    this.auth.getAdminDeliveredMessages(this.id).subscribe((res: any) => {
      this.deliveredMessages = res.data[0].deliveredMessages
    })
  }

  getAdminNotDeliveredMessage() {
    this.auth.getAdminNotDeliveredMessages(this.id).subscribe((res: any) => {
      this.notDeliveredMessages = res.data[0].deliveredMessages
    })
  }

  exportMessageReport() {
    this.auth.exportExcel(this.messageReportData, 'Message Report');
  }

  exportBroadcastReport() {
    this.auth.exportExcel(this.broadcastReportData, 'Broadcast Report');
  }

  openReport(agent: any) {
    let FromDate = this.getReportForm.value.FromDate
    let toDate = this.getReportForm.value.ToDate
    this.popUp.open(BroadcastReportComponent, { width: '1250px', height: '720px', data: { agent: agent, FromDate: FromDate, toDate: toDate } })
    console.log(agent);
  }

  firstFuntion() {
    this.messageReport = false
    this.broadCastReport = true
    this.message = "Toggle to Message Report"
  }
  secondFuntion() {
    this.messageReport = true
    this.broadCastReport = false
    this.message = "Toggle to Broadcast Report"
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
