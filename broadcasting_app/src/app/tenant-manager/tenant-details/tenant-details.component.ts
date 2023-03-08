import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.css']
})
export class TenantDetailsComponent {

  id: any
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    console.log(this.id);

  }
}
