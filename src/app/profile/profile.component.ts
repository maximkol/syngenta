import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  /**
   *
   */
  constructor(private readonly router:Router, private shopService: ShopService) {
    
  }
  onCustomerLogout() {
    localStorage.removeItem('customer')
    this.router.navigate(['/'])
    this.shopService.cartDataLength.emit([])
  }
}
