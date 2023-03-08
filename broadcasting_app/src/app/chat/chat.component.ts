import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  messageComposeForm: FormGroup;
  sendData: any = []
  isSelected = false;
  socket: any;
  message: any;
  messages: any = []
  data: any;
  searchFilter: any
  chatSelected = false
  refreshPage: any
  searchForm: FormGroup;
  goBack = false

  constructor(private auth: AuthService, private fb: FormBuilder, private route: Router, private router : ActivatedRoute) {

    this.messageComposeForm = this.fb.group({
      messageBox: [''],
      number: [''],
      agent_id: [''],
      senderNumber: [' '],
      tenantid:[''],
      adminid:['']

    })
    this.searchForm = this.fb.group({
      searchNumber:['',[Validators.required, Validators.pattern("^[0-9]*$")]]
    })
  }
  agent_id: any
  customerData: any = []
  customerNumber: any = ''
  senderNumber: any
  searchNumber: any
  id : any
  userType : any
  agentName : any
  tenantid:any
  adminId:any


  ngOnInit(): void {
    this.agent_id = localStorage.getItem('userid')
    this.userType = localStorage.getItem('usertype')
    this.tenantid=localStorage.getItem('tenantID')
    this.adminId=localStorage.getItem('adminid')
    this.id = parseInt(this.agent_id, 10)
    console.log(this.id);

    if(this.userType == "superadmin"){
      this.id = this.router.snapshot.paramMap.get('id')
      this.agentName = this.router.snapshot.paramMap.get('agent')
      this.agent_id = this.id
      this.goBack = true
    }
    else{
      this.agent_id = localStorage.getItem('userid')
    }

    // this.agent_id = "1"
    this.senderNumber = localStorage.getItem('number')
    this.getDistinct()
    this.messageComposeForm.patchValue({
      agent_id: this.agent_id, senderNumber: this.senderNumber,tenantid:this.tenantid,adminid:this.adminId
    })
    this.searchFilter = null

  }

  getDistinct() {
    this.auth.getDistinct(this.agent_id).subscribe((res: any) => {
      this.customerData = res.result
      console.log("distinct", res);
      // console.log(this.customer);
    })
  }

  fetch(cus: any, agentid: any) {
    this.auth.fetchingMessages(cus, agentid).subscribe((res: any) => {
      this.messages = res.result
      console.log(this.messages);
    })
  }

  clicked(custnumber: any) {
    clearInterval(this.refreshPage);
    this.searchFilter = null
    this.customerNumber = custnumber
    this.fetch(this.customerNumber, this.agent_id);

    if(this.userType == "superadmin"){
      this.chatSelected = false
    }
    else{
      this.chatSelected = true
    }
    // this.chatSelected = true
    this.refreshPage = setInterval(() => {
      this.fetch(this.customerNumber, this.agent_id);
    }, 4000);
  }

  refreshDistinct = setInterval(() => {
    this.getDistinct()
  }, 3000)

  sendMessage() {
    this.messageComposeForm.value.number = this.customerNumber
    this.sendData = this.messageComposeForm.value
    console.log(this.sendData);
    // const individual = { number: this.sendData.number, message: this.messageComposeForm.value.messageBox, direction: "outgoing", messageType: "individual"}
    this.auth.sendIndividual(this.sendData).subscribe(res => {
      if (res) {
        console.log(res);
      }
      else {
        console.log("error");
      }
    })
  }

  save() {
    this.messageComposeForm.value.number = this.customerNumber
    this.sendData = this.messageComposeForm.value
    const individual = { number: this.sendData.number, message: this.messageComposeForm.value.messageBox, direction: "outgoing", messageType: "individual", agent_id: this.messageComposeForm.value.agent_id ,tenantid : this.tenantid , adminid : this.adminId }
    // console.log(individual);
    this.auth.saveindividual(individual).subscribe((res) => {
      this.messageComposeForm.reset()
      this.messageComposeForm.patchValue({
        agent_id: this.agent_id,
        senderNumber: this.senderNumber
      })
      console.log(res);
    })
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  back(){
    window.history.back()
  }

  unRead(customernumber: any) {
    this.auth.readMessage(customernumber).subscribe((res) => {
      console.log("read", res);
    })
  }

  // selectedNumber(number: any) {
  //   const num = document.getElementById(number)
  //   if (num) {
  //     num.style.setProperty('background-color', '#284455');
  //     num.style.setProperty('color', 'white');
  //   }
  // }

  ngOnDestroy() {
    clearInterval(this.refreshPage);
    clearInterval(this.refreshDistinct)
  }
}



