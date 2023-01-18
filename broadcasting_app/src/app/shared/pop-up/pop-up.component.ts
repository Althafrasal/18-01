import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUPComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public datas: any){}

message : any = ''

ngOnInit(){
console.log(this.datas);

  this.message = this.datas.message
}
}
