import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: any){
    return this.http.post('http://localhost:3000/login',data)
  }
  getToken(){
    return localStorage.getItem('token')
  }
  addLead(data: any) {
    return this.http.post("http://localhost:3000/leadsCreation", data)
  }

  getLead(){
    return this.http.get('http://localhost:3000/getleads')
  }
  addToMessages(data : any){
    return this.http.post('http://localhost:3000/addToMessages',data)
  }
  getMessage(){
    return this.http.get('http://localhost:3000/broadcastMessage')
  }
  addLeadNumber(data:any){
    return this.http.post('http://localhost:3000/leadNumbers',data)
  }

}
