import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthguardServiceService {

  constructor() { }

  getToken(){
    return !!localStorage.getItem("token")
  }
}