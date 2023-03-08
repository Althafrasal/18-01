import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Subject, tap } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userType: any

  constructor(private http: HttpClient) { }

  private refreshPage = new Subject<void>

  get reload() {
    return this.refreshPage
  }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }
  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  login(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/login', data)
  }
  getToken() {
    return localStorage.getItem('token')
  }
  addLead(data: any) {
    return this.http.post("https://sms.xlogix.ca/api/leadsCreation", data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }

  getLead(loginUserID: any): Observable<any> {
    return this.http.get('https://sms.xlogix.ca/api/getleads/' + loginUserID)
  }
  addToMessages(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/addToMessages', data)
  }
  broadcastMessage(leadId: any) {
    return this.http.get('https://sms.xlogix.ca/api/broadcastMessage/' + leadId).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }
  addLeadNumber(userId: any, leadId: any, data: any) {
    return this.http.post('https://sms.xlogix.ca/api/leadNumbers/' + userId + "/" + leadId, data)
  }
  fetchingMessages(customernumber: any, agentid: any) {
    return this.http.get('https://sms.xlogix.ca/api/fetchingMessages/' + customernumber + "/" + agentid)
  }

  getDistinct(agentid: any) {
    return this.http.get('https://sms.xlogix.ca/api/getDistinct/' + agentid)
  }
  sendIndividual(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/sendIndividual', data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }
  saveindividual(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/individualChat', data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }
  getBroadcastedLeads(loginUserId: any) {
    return this.http.get('https://sms.xlogix.ca/api/getBroadcastedLeads/' + loginUserId)
  }

  deleteLeadList(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/deleteLeadList/' + id).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }
  readMessage(customernumber: any) {
    return this.http.get('https://sms.xlogix.ca/api/readstatus/' + customernumber)
  }

  updateLead(data: any, id: any) {
    return this.http.post('https://sms.xlogix.ca/api/updateLead/' + id, data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }

  getLeadsByid(id: any): Observable<any> {
    return this.http.get('https://sms.xlogix.ca/api/getLeadsByid/' + id)
  }
  deleteLeadNumber(leadId: any) {
    return this.http.get('https://sms.xlogix.ca/api/deleteLeadNumber/' + leadId)
  }

  getTenant(): Observable<any> {
    return this.http.get('https://sms.xlogix.ca/api/getTenants')
  }
  addTenant(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/createTenant', data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }
  getAdminByID(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/getTenantAdmins/' + id)
  }
  addNewAdmin(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/createAdmin', data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }
  getAgents(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/getAgents/' + id)
  }

  addAgents(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/createAgent', data).pipe(
      tap(() => {
        this.reload.next()
      })
    )
  }

  getAgentsBytenantid(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/getAgentsBytenantid/' + id)
  }

  getTenantName(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/tenantName/' + id)
  }

  getTenantAgentCount(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/AgentCount/' + id)
  }

  getTotalMessages(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/totalMessages/' + id)
  }

  getDeliveredMessages(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/deliveredMessageCount/' + id)
  }

  getNotDeliveredMessages(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/notDeliveredMessageCount/' + id)
  }

  getAdminAgentCount(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/getAgentsCountbyAdmin/' + id)
  }

  getAdminTotalMessages(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/totalMessagesbyAdminId/' + id)
  }

  getAdminDeliveredMessages(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/deliveredMessageCountByAdminId/' + id)
  }

  getAdminNotDeliveredMessages(id: any) {
    return this.http.get('https://sms.xlogix.ca/api/NotdeliveredMessageCountByAdminId/' + id)
  }

  getMessageReportForTenant(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/messageReportForTenant', data)
  }
  getBroadcastReportForTenant(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/broadcastReportForTenant', data)
  }

  getMessageReportForAdmin(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/messageReportForAdmin', data)
  }
  getBroadcastReportForAdmin(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/broadcastReportForAdmin', data)
  }
  agentReportForNotDelivered(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/agentReportForNotDelivered', data)
  }
  agentReportForDelivered(data: any) {
    return this.http.post('https://sms.xlogix.ca/api/agentReportForDelivered', data)
  }

  getDistinctStatus() {
    return this.http.get('https://sms.xlogix.ca/api/getDistinctStatus')
  }

  // saveBroadCast(){
  //   return this.http.get('https://34.93.48.128/api/saveBroadCast')
  // }

}
//http://34.93.249.195/ - external IP
//10.160.0.63 - internal IP
