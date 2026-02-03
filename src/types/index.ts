import { Api, ApiListResponse } from "../components/base/api";
import { API_URL } from "../utils/constants";
type payType = 'online' | 'on delivery'; //Тип для способа оплаты
type categoryType = 'софт-скил' | 'другое' | 
'дополнительное' | 'хард-скил' | 'кнопка' ;

const api = new Api(API_URL);

//Основной интерфейс товара
interface IItem {
    id: string;
    category: categoryType;
    title: string;
    image: string;
    price: number;
    description: string;
}

//Основной интерфейс заказа
interface IOrder {
    payment: payType;
    address: string;
    email: string;
    phone: string;
}

//интерфейсы набора возможных действий на странице
interface IListModel<T> {
    items: T[],

    //действия доступные на странице
    loadCard(id: string): Promise<void>,
    loadBasket(): Promise<void>, 
}



interface IOrderPost {
    payment: payType;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}

//Интерфейс товара для отображения главной страницы
//Что должно присутствовать в ней
interface IViewMainPage {
    categoryId: string;
    title: string;
    image: string;
    price: number;
}

//Интерфейс для отображения карточки товара
//В целом все то же самое нужно для 
interface IViewItem {
    categoryId: string;
    title: string;
    image: string;
    price: number;
    description: string;
}

//Интерфейс для вещей в корзине
interface IBasketItem {
    title: string;
    price: number;
}

//Интерфейс отображения корзины
interface IBasket{
    items: IBasketItem[];
}

//Интерфейс для отображения окна
//Со способом оплаты и адресом
interface IViewOrderPay {
    payment: payType;
    address: string;
}

//Интерфейс для отображения окна
//С почтой и телефоном
interface IViewOrderContact {
    email: string;
    phone: string;
}


//интерфейсы отображения



//Классы(модели данных)

//
class Item implements IItem {
    id: string;
    category: categoryType;
    title: string;
    image: string;
    price: number;
    description: string;

    constructor(data: IItem){
        this.id = data.id;
        this.category = data.category;
        this.title = data.title;
        this.image = data.image;
        this.price = data.price;
        this.description = data.description;
    }

    open() {
        console.log(`открыть карточку ${this.id} ${this.title}`);
    }

}

class Basket implements IBasket{
    items: IBasketItem[];

    constructor(items: IBasketItem[]){
        this.items = items;
    }

    open() {
        console.log(`открыть корзину с товарами ${this.items}`);
    }

    deleteItem(itemDelete: IItem) {
        this.items = this.items.filter(item => item !== itemDelete);
    }

    placeOrder(): number {
        let total: number = 0;
       for(let i = 0; i < this.items.length; i++){
        total += this.items[i].price;
       }
       return total;
    }
}

class Order implements IOrder {
    payment: payType;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
    
    load1(){
        
    }

    load2(order: IViewOrderPay){
        this.payment = order.payment;
        this.address = order.payment;
    }

    sendOrder(order: IViewOrderContact) {
        this.email = order.email;
        this.phone = order.phone;

        //апи запрос на оформление заказа
    }
}



class CatalogView {
    items: IViewMainPage[];

}


console.log('go api');
api.get('/product')
    .then((res) => {
        console.log(res);
    })
