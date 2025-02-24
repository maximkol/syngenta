import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ShopService } from './shop.service';
import { LoginRequest, User } from '../models/dataTypes';
import { AccessToken } from '../environment/elma';
@Injectable({
  providedIn: 'root'
})
export class CustomerSignupService {

  public replaceUrl = 'http://localhost:5000/'
  //public url = 'https://e-commerce-backend-f8v8.onrender.com/'
  public url = 'https://76mk34qndj4z4.elma365.ru/api/extensions/45640319-c190-46da-a326-18da0f1cae78/script/'
  public signupMsg = new EventEmitter<boolean>(false)
  public isCustomerLoggedIn = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private router: Router, private shopService: ShopService) { }

  getHeaders(){
    // let userStore = localStorage.getItem('customer')
    // let accessToken = userStore && JSON.parse(userStore).accessToken

    let httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${AccessToken}`
    })

    return httpHeaders

  }

  errorHandler(error: HttpErrorResponse){
    // console.log(error.error.message);  
    return throwError(error)
  }

  // signupUser(userData: Signup){
  //   return this.http.post<Signup>(`${this.url}auth/register`, userData)
  //   .pipe(catchError(this.errorHandler))
  // }

  loginUser(userData: LoginRequest){
    let Headers = this.getHeaders()
    this.http.post<User>(`${this.url}Authorization`, userData, { headers: Headers })
    .pipe(catchError(this.errorHandler))
    .subscribe((res)=>{
      if(res && res.result === "OK" && res.user_id){
        this.isCustomerLoggedIn.next(true)
        localStorage.setItem('customer', JSON.stringify({user_id: res.user_id, userName: res.username}))
        this.router.navigate(['/']) 
      }
    }, (err)=>{
      if(err){
        this.signupMsg.emit(true)
      }
    })
  }
  //   loginUser(userData: Signup){
  //     const user = users.find(u=>u.email===userData.email && u.password === userData.password)
  //     if(user){
  //       this.isCustomerLoggedIn.next(true)
  //       localStorage.setItem('customer', JSON.stringify({_id: user._id, accessToken: user.accessToken}))
  //       this.router.navigate(['/'])
  //       //this.localCartToDB()
  //     }
    
  // }


  reloadSeller(){
    if(localStorage.getItem('customer')){
      this.isCustomerLoggedIn.next(true)
      this.router.navigate(['/'])
    }
  }

  // getUser(userData: Signup){
  //   let Headers = this.getHeaders()
  //   return this.http.get<Signup>(`${this.url}users/${userData._id}`, { headers: Headers })
  // }
  getUser(userData: User):Observable<User>{
    const userInfo = localStorage.getItem("customer");
    if(userInfo){
      let user:User = JSON.parse(userInfo)
      return of(user)
    }
    throw new Error('User not found');
  }

  // localCartToDB(){
  //   let data = localStorage.getItem('localCart')
  //   if(data){
  //     let cartDataList:Product[] = JSON.parse(data)

  //     cartDataList.forEach((product: Product, index)=> {
  //       let cartData: Cart={
  //         ...product,
  //         productId: product._id
  //       }
  //       // console.log(cartData);
        
  //       this.shopService.addFromLocalToCart(cartData).subscribe((res)=>{
  //         if(res){
  //           console.log(res)
  //         }
  //       })
  //       if(cartDataList.length === index+1){
  //         localStorage.removeItem('localCart')
  //       }
  //     })
  //   }
    
  //   this.shopService.getCartCount()
    
  // }
}
