import { EventEmitter, Injectable } from '@angular/core';
import { AddProductToCartRequest, Cart, Order, OrderResponse, OrdersRequest, OrdersResponse, Product, ProductsResponse, StartOrderRequest, User } from '../models/dataTypes';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AccessToken, ElmaPublicApiUrl } from '../environment/elma';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  public replaceUrl = 'http://localhost:5000/'
  //public url = 'https://e-commerce-backend-f8v8.onrender.com/'
  public url = 'http://localhost:5000/'

  public cartDataLength = new EventEmitter<Product[] | []>()

  constructor(private http: HttpClient) { }
  private products: Product[] = [];
  getHeaders() {
    let httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AccessToken}`
    })

    return httpHeaders

  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error)
  }

  trendyProducts(): Observable<Product[]> {
    let Headers = this.getHeaders();
    return this.http.get<ProductsResponse>(`${ElmaPublicApiUrl}Get_list_items`, { headers: Headers }).pipe(
      map(res => {
        const result: Product[] = res.objs.map(p => {
          return {
            _id: p.item_id,
            title: p.name,
            price: p.price.cents / 100,
            image: p.img,
            desc: p.desc,
            productId: p.item_id,
            categories: "Семена",
            culture: p.culture,
            reg_code: p.reg_code,
            region: p.region,
            reg_ad: p.reg_ad
          }
        })
        this.products = result;
        return result;
      }),
      catchError(err => {
        console.log(err);
        return of();
      })
    );

  }


  // getProduct(productId: string){
  //   // let Headers = this.getHeaders()
  //   return this.http.get<Product>(`${this.url}products/${productId}`)
  //   .pipe(catchError(this.errorHandler))
  // }
  getProduct(productId: string): Observable<Product> {
    const product = this.products.find(p => p._id === productId);
    if (product) {
      return of(product)
    }
    return of();
  }



  searchProducts(query: string) {
    let Headers = this.getHeaders()
    return this.http.get<Product[]>(`${this.url}products/?category=${query}`, { headers: Headers })
      .pipe(catchError(this.errorHandler))
  }

  addToLocal(productData: Product) {
    let cartData = []
    let localCart = localStorage.getItem('localCart')
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([productData]))
      this.cartDataLength.emit([productData])
    } else {
      cartData = JSON.parse(localCart)
      cartData.push(productData)
      localStorage.setItem('localCart', JSON.stringify(cartData))
      this.cartDataLength.emit(cartData)
    }
  }

  removeFromLocal(productId: string) {
    let cartData = localStorage.getItem('localCart')
    if (cartData) {
      let items: Product[] = JSON.parse(cartData)
      items = items.filter((item: Product) => productId !== item._id)
      localStorage.setItem('localCart', JSON.stringify(items))
      this.cartDataLength.emit(items)
    }
  }

  addToCart(productData: Product) {
    let Headers = this.getHeaders()
    return this.http.post<Product>(`${this.url}carts`, {
      productId: productData._id, quantity: productData.quantity,
      image: productData.image, title: productData.title, price: productData.price
    }, { headers: Headers })
      .pipe(catchError(this.errorHandler))
  }

  addFromLocalToCart(productData: Cart) {
    let Headers = this.getHeaders()
    return this.http.post<Cart>(`${this.url}carts`, {
      productId: productData._id, quantity: productData.quantity,
      image: productData.image, title: productData.title, price: productData.price
    }, { headers: Headers })
      .pipe(catchError(this.errorHandler))
  }

  // removeItemFromCart(productId: string){
  //   let userStore = localStorage.getItem('customer')
  //   let accessToken = userStore && JSON.parse(userStore).accessToken
  //   let httpHeaders: HttpHeaders = new HttpHeaders({
  //     'Authorization': `Bearer ${accessToken}`
  //   })
  //   return this.http.post<Product>(`${this.url}carts/remove-cart-item`, {productId: productId}, { headers: httpHeaders })
  //   .pipe(catchError(this.errorHandler))
  // }
  removeItemFromCart(productId: string) {
    this.removeFromLocal(productId)
    return of();
  }

  emptyCart() {
    localStorage.removeItem('localCart');
  }

  // getCart(){
  //   let Headers = this.getHeaders()
  //   return this.http.get<Cart>(`${this.url}carts/get-cart`, { headers: Headers })
  //   .pipe(catchError(this.errorHandler))
  // }
  getCart(): Observable<Product[]> {
    let cartData: Product[];
    let localCart = localStorage.getItem('localCart')
    if (localCart) {
      cartData = JSON.parse(localCart)
      return of(cartData)
    }
    else {
      return of()
    }
  }

  // getCartCount(){
  //   let Headers = this.getHeaders()
  //   return this.http.get<any>(`${this.url}carts/get-cart`, { headers: Headers })
  //   .pipe(catchError(this.errorHandler))
  //   .subscribe((res)=>{
  //     if(res){
  //       this.cartDataLength.emit(res.cart.products)
  //     }
  //   })
  // }
  getCartCount() {
    let cartData: Product[];
    let localCart = localStorage.getItem('localCart')
    if (localCart) {
      cartData = JSON.parse(localCart)
      return of(cartData)
        .subscribe((res) => {
          this.cartDataLength.emit(res)
        });
    }
    else {
      return of()
        .subscribe((res) => {
          this.cartDataLength.emit(res)
        });
    }
  }

  addProductToCart(productData: Product, userId:string): Observable<string> {
    let Headers = this.getHeaders()
    const request: AddProductToCartRequest = {
      user_id: userId,
      item_id: productData._id,
      amount: productData.quantity ? productData.quantity : 1
    }
    return this.http.post<string>(`${ElmaPublicApiUrl}Add_to_cart`, request, { headers: Headers })
      .pipe(catchError(this.errorHandler))
  }

  

  createOrder(orderId:string):Observable<any> {
    let Headers = this.getHeaders()
    const request: StartOrderRequest = {
      order_id: orderId
    }
    return this.http.post<any>(`${ElmaPublicApiUrl}Start_bp`, request, { headers: Headers })
      .pipe(catchError(this.errorHandler))
  }

  getUserOrders(userId:string):Observable<Order[]> {
    let Headers = this.getHeaders()
    const request: OrdersRequest = {
      user_id: userId
    }
    return this.http.post<OrdersResponse>(`${ElmaPublicApiUrl}Get_my_orders`, request, { headers: Headers })
      .pipe(
        map((response: OrdersResponse) => {
          const reversedResult: OrderResponse[] = response.objs.reverse()
          const result:Order[] = reversedResult.map(res=>{
            return {
              order_id: res.order_id,
              orderStatus: res.status,
              totalPrice: res?.amount?.cents ? res.amount.cents / 100 : undefined,
              name: res.name,
              date: new Date(res.date_zak.ts).toLocaleDateString("ru-RU"),
            }
          })
          return result
        }),
        catchError(this.errorHandler)
      )
  }

  deleteOrder(orderId: any) {
    let Headers = this.getHeaders()
    return this.http.delete<any>(`${this.url}orders/${orderId}`, { headers: Headers })
      .pipe(catchError(this.errorHandler))
  }
}
