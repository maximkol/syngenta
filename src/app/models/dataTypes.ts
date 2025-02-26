// export interface Signup{
//     _id: string,
//     login: string,
//     email: string
//     password: string,
//     accessToken: string | undefined,
//     isAdmin: boolean | undefined
// }
export interface LoginRequest {
    login:string;
    password:string;
}
export interface User {
    user_id:string;
    username:string;
    result:string;
}
export interface ProductsResponse {
    result: string,
    objs: ProductResponse[],
}
export interface ProductResponse {
    name: string,
    item_id: string,
    desc: string,
    img: string,
    price: {
        _currency : {
            code: string,
            name: string,
            country: string
            units:number
        },
        cents: number
    }
}

export interface Product{
    _id: string,
    title: string,
    price: number,
    categories?: string,
    desc: string,
    image: string,
    size?: string,
    quantity?: number,
    productId: string
}
export interface AddProductToCartRequest{
    user_id:string;
    item_id: string,
    amount: number,
}


export interface Cart{ 
    productId: string, 
    _id: string, 
    title: string, 
    price: number, 
    categories?: string, 
    desc: string, 
    image: string, 
    size?: string, 
    quantity?: number | undefined, 
    cart?: any,
    cartCount?: number | undefined
}

export interface PriceSummary{
    price: number,
    discount: number,
    tax: number,
    delivery: number,
    total: number
}

export interface Order{
    email?: string,
    address?: string,
    contact?: string,
    totalPrice?: number,
    cartTotal?: number,
    paymentIntent?: {
        id: string,
        amount: number
    },
    orderStatus: "В обработке" | "Создан"
    order_id:string,
    name:string,
    date:string
}
export interface OrdersRequest {
    user_id:string;
}
export interface OrdersResponse{
    result: string,
    objs: OrderResponse[],
}
export interface OrderResponse {
    order_id:string,
    status: "В обработке" | "Создан",
    amount?: {
        cents: number,
    },
    name: string,
    date_zak:{
        ts:string,
    }
}
export interface StartOrderRequest{
    order_id:string
}