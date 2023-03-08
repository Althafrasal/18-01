import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthguardServiceService } from './authguard-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

constructor(private authGuard : AuthguardServiceService, private route : Router){}

  canActivate(): any
  {
    if(!this.authGuard.getToken()){
      this.route.navigateByUrl("")
    }
    return this.authGuard.getToken();

  }


}
