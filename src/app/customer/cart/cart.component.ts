import { Component, OnInit } from '@angular/core';
import { Cart, PriceSummary, User } from '../../models/dataTypes';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  public cart: Cart[] | undefined

  public priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private router: Router, private shopService: ShopService){}

  ngOnInit(): void {
    this.loadCardDetails()
  }

  loadCardDetails(){
    this.shopService.getCart().subscribe((res)=>{
      this.cart = res
      // console.log(this.cart);
      let price = 0
      res.forEach((item: any)=>{
        if(item.quantity && item.price){
          price+= +item.price * +item.quantity 
        }
      })
      this.priceSummary.price = price
      this.priceSummary.tax = price/10
      this.priceSummary.delivery = 100
      this.priceSummary.total = price //price + price/10 + 100
      // console.log(this.priceSummary.total);
      if(!this.cart?.length){
        this.router.navigate(['/'])
      }else{
        this.shopService.getCartCount()
      }
    })
  }

  removeFromCart(productId: string){
    this.shopService.removeFromLocal(productId)
    this.loadCardDetails() 
    
  }

  createOrder(){
    const product = this.cart?.[0];
    const userInfo = localStorage.getItem("customer");
    if (userInfo && product) {
      let user: User = JSON.parse(userInfo)
      this.shopService.addProductToCart(product, user.user_id)
      .subscribe((res)=>{
        this.shopService.getUserOrders(user.user_id).subscribe((res)=>{
          const newOrder = res.find(o=>o.orderStatus === "Создан")
          if(newOrder){
            this.shopService.createOrder(newOrder.order_id)
            .subscribe((res)=>{
              this.shopService.emptyCart()
              this.router.navigate(['/orders'])
            })
          }
        })
      })
    }
  }

}
