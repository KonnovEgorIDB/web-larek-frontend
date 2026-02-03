import './scss/styles.scss';
import { Api, ApiListResponse } from "./components/base/api";
import { API_URL, CDN_URL } from "./utils/constants";
import { createElement } from './utils/utils';
type payType = 'online' | 'on delivery'; //Тип для способа оплаты
type categoryType = 'софт-скил' | 'другое' | 
'дополнительное' | 'хард-скил' | 'кнопка' ;

document.querySelector('.modal_active').classList.remove('modal_active');

const api = new Api(API_URL);

interface IApiList {
    total: number,
    items: IItem[]
}

interface IApiItem{
    id: string;
    category: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
}

interface IApiOrder{
    payment: payType;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

//Основной интерфейс товара
interface IItem {
    id: string;
    category: categoryType;
    title: string;
    image: string;
    price: number | null;
    description: string;
}

//Основной интерфейс заказа
interface IOrder {
    payment: payType;
    address: string;
    email: string;
    phone: string;
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
    category: string;
    title: string;
    image: string;
    price: number;
    onClick: (evt: Event) => void;
}

//Интерфейс для отображения карточки товара
//В целом все то же самое нужно для 
interface IViewItem {
    category: categoryType;
    title: string;
    image: string;
    price: number;
    description: string;
    onBuy: (evt: Event) => IItem | void;
}

//Интерфейс для вещей в корзине
interface IViewBasketItem {
    id: string;
    index: number;
    title: string;
    price: number;
}

//Интерфейс отображения корзины
interface IBasket{
    items: IViewBasketItem[];
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
    //inBasket: boolean;
    constructor(data: IItem){
        this.id = data.id;
        this.category = data.category;
        this.title = data.title;
        this.image = data.image;
        this.price = data.price;
        this.description = data.description;
    }

    // addToBasket() {
    //     this.inBasket = true;
    // }

    // removeFromBasket(){
    //     this.inBasket = false;
    // }

}

// class Basket implements IBasket{
//     items: IBasketItem[];

//     constructor(items: IBasketItem[]){
//         this.items = items;
//     }

//     open() {
//         console.log(`открыть корзину с товарами ${this.items}`);
//     }

//     deleteItem(itemDelete: IItem) {
//         this.items = this.items.filter(item => item !== itemDelete);
//     }

//     placeOrder(): number {
//         let total: number = 0;
//        for(let i = 0; i < this.items.length; i++){
//         total += this.items[i].price;
//        }
//        return total;
//     }
// }

class OrderModel implements IOrder {
    payment: payType;
    address: string;
    email: string;
    phone: string;
    total: number;
    itemList: string[];
    
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
    addOrder(item: Item) {
        this.itemList.push(item.id);
    }
    removeOrder(id: string){
        this.itemList = this.itemList.filter(itemInBasket => itemInBasket !== id);
    }

    getOrder() : IApiOrder{
        const orderDetails = {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.itemList
        }
    

        return orderDetails;
    }
}

class CatalogModel {
    items: Item[] = [];

    setItems(items: Item[]){
        this.items = items;
    }

    getItems(): Item[] {
        return this.items;
    }

    getItemById(id : string) : Promise<IItem>{
        return api.get(`/product/${id}`)
            .then((resultItem: IApiItem) => {
                return resultItem as IItem;
        });
    }

    //getItemById
}

class BasketModel {
    items: Item[] = [];
    
    add(item: Item){
        this.items.push(item);
    }
    remove(id: string){
        this.items = this.items.filter(itemInBasket => itemInBasket.id !== id);
    }
    itemOnBasket(id: string){
        return this.items.some(item => item.id === id)
    }
    getCount(){
        console.log(this.items);

        return this.items.length;
    }
    getTotal(){
        return this.items;
    }
    clear(){
        this.items = [];
    }
}

class CatalogView {
    mainPage: HTMLElement;

    constructor(className:string){
        this.mainPage = document.querySelector(`.${className}`);
    }
    render(items: IViewMainPage[]){
        this.mainPage.replaceChildren();
        const cardTemplate : HTMLTemplateElement = document.querySelector('#card-catalog');
        items.forEach((item) => {
            const cardElement = cardTemplate.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
            const category = cardElement.querySelector('.card__category') as HTMLElement;
            category.textContent = item.category;

            const title = cardElement.querySelector('.card__title') as HTMLElement;
            title.textContent = item.title;

            const image = cardElement.querySelector('.card__image') as HTMLImageElement;
            image.src = CDN_URL+item.image;

            const price = cardElement.querySelector('.card__price') as HTMLElement;
            if(item.price === null) price.textContent = 'Бесценно'
            else price.textContent = `${item.price} синапсов`;

            cardElement.addEventListener('click', item.onClick);
            this.mainPage.append(cardElement);
        })
    }
}

abstract class ModalView{
    modalWindow = document.querySelector('.modal') as HTMLElement;
    cardPage = this.modalWindow.querySelector('.modal__content') as HTMLElement;
    closeButton = this.modalWindow.querySelector('.modal__close') as HTMLButtonElement;
    
    constructor(){
        this.closeButton.addEventListener('click', (evt) => {
            this.modalWindow.classList.remove('modal_active');
        });
    }
}

class CardView extends ModalView {
    cardTemplate : HTMLTemplateElement = document.querySelector('#card-preview');
    cardElement = this.cardTemplate.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
    category = this.cardElement.querySelector('.card__category') as HTMLElement;
    title = this.cardElement.querySelector('.card__title') as HTMLElement;
    image = this.cardElement.querySelector('.card__image') as HTMLImageElement;
    text = this.cardElement.querySelector('.card__text') as HTMLParagraphElement;
    button = this.cardElement.querySelector('.card__button') as HTMLButtonElement;
    price = this.cardElement.querySelector('.card__price') as HTMLElement;
    private currentItem: IViewItem | null = null;

    
    constructor(){
        super();
        this.cardPage.addEventListener('click', (evt) => {
            const target = evt.target as HTMLElement;

            if (target.closest('.card__button')) {
                this.currentItem?.onBuy(evt);
                return;
            }

            // if (target.closest('.basket__item-delete')) {
            //     this.currentItem?.onDelete(evt);
            //     return;
            // }
        });
    }

    render(item: IViewItem){
        this.cardPage.replaceChildren();
        this.currentItem = item;
        this.category.textContent = item.category;

        this.title.textContent = item.title;

        this.image.src = CDN_URL+item.image;

        this.text.textContent = item.description;      

        if(item.price) this.price.textContent = `${item.price} синапсов`;

        this.cardPage.append(this.cardElement);
        this.modalWindow.classList.add('modal_active');

    }

    

    disableBuyButton(){
        this.button.textContent = 'Товар уже в корзине';
        this.button.setAttribute('disabled', '');
        this.button.style.backgroundColor = 'grey'
    }
    disableBuyButtonNull(){
        this.price.textContent = 'Бесценно'
        this.button.textContent = 'Невозможно';
        this.button.setAttribute('disabled', '');
        this.button.style.backgroundColor = 'grey';
    }
    enableBuyButton(){
        this.button.textContent = 'В корзину';
        this.button.removeAttribute('disabled');
        this.button.style.backgroundColor = 'white'
    }
    
    
}

class BasketItemView extends ModalView{
    private currentItem: IViewBasketItem | null = null;


    constructor(){
        super();

        

    }

    renderInBasket(item: IViewBasketItem, basket__list: HTMLUListElement){
        this.currentItem = item;

        const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
        const cardBasketElement: HTMLElement = cardBasketTemplate.content.querySelector('.card_compact')!.cloneNode(true) as HTMLElement;
        
        const indexBasket: HTMLSpanElement = cardBasketElement.querySelector('.basket__item-index');
        const titleBasket: HTMLSpanElement = cardBasketElement.querySelector('.card__title');
        const priceBasket: HTMLSpanElement = cardBasketElement.querySelector('.card__price');
        const deleteButton: HTMLButtonElement = cardBasketElement.querySelector('.basket__item-delete');


        cardBasketElement.dataset.id = item.id;

        indexBasket.textContent = `${item.index}`;
        titleBasket.textContent = item.title;
        priceBasket.textContent = `${item.price}`;

        basket__list.append(cardBasketElement);
        console.log(item);
        console.log(basket__list);
        return basket__list;
    }
}

class BasketView extends ModalView{
    icon = document.querySelector('.header__basket');
    counter = this.icon.querySelector('.header__basket-counter') as HTMLSpanElement;

    basketTemplate : HTMLTemplateElement = document.querySelector('#basket');
    basketElement = this.basketTemplate.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    basketList : HTMLUListElement = this.basketElement.querySelector('.basket__list');
    deleteButton : HTMLButtonElement = this.basketElement.querySelector('.button');
    basketPrice: HTMLSpanElement = this.basketElement.querySelector('.basket__price');
    

    onDeleteItem?: (id:string) => void;
    onPlaceOrder?: () => void;

    constructor(){
        super();
        this.icon.addEventListener('click', openBasket);

        this.cardPage.addEventListener('click', (evt) => {
            const target = evt.target as HTMLElement;

            const deleteBtn = target.closest('.basket__item-delete');
            if (deleteBtn) {
                const itemEl = deleteBtn.closest('.card_compact') as HTMLElement;
                if (!itemEl) return;

                const id = itemEl.dataset.id;
                if (!id) return;

                this.onDeleteItem?.(id);
                return; // чтобы не выполнялись другие действия
            }

            // 2️⃣ Оформление заказа
            const placeOrderBtn = target.closest('.basket__button');
            if (placeOrderBtn) {
                this.onPlaceOrder?.(); 
                return;
            }
        });

    }
    renderCounter(count: number){
        this.counter.textContent = `${count}`;
    }
    
    render(basket__list: HTMLUListElement, total: number){
        console.log('work');
        this.cardPage.replaceChildren();

        this.basketList = basket__list;
        this.basketPrice.textContent = `${total} синапсов`;
        console.log(basket__list);

        this.cardPage.append(this.basketElement);
        this.modalWindow.classList.add('modal_active');

    }
    getBasketList() : HTMLUListElement{
        return this.basketList;
    }
}

class OrderFirstView extends ModalView{
    orderFirstTemplate : HTMLTemplateElement = document.querySelector('#order');
    orderFirstElement = this.orderFirstTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLFormElement;
    formErrors = this.orderFirstElement.querySelector('.form__errors');
    cardBtn = this.orderFirstElement.querySelector('[name=card]') as HTMLButtonElement;
    cashBtn = this.orderFirstElement.querySelector('[name=cash]') as HTMLButtonElement;

    checkValid(orderElement: HTMLElement){
        const formErrors = orderElement.querySelector('.form__errors');
        const cardBtn = orderElement.querySelector('[name=card]') as HTMLButtonElement;
        const cashBtn = orderElement.querySelector('[name=cash]') as HTMLButtonElement;
        const inputAddress = orderElement.querySelector('[name=address]') as HTMLInputElement;
        
        console.log(formErrors);
        console.log(cardBtn.dataset.choise);
        console.log(cashBtn.dataset.choise);
        if(cardBtn.dataset.choise === 'false' && cashBtn.dataset.choise === 'false'){
            formErrors.textContent = 'выберите способ оплаты';
        }
        else if(inputAddress.value.length === 0){
            formErrors.textContent = 'Заполните адрес доставки';
        }
        else {
            formErrors.textContent = '';
        }
    }

    toggleBtn(onBtn : HTMLButtonElement, offBtn: HTMLButtonElement){
        onBtn.style.outline = '2px solid white';
        onBtn.dataset.choise = 'true';
        
        offBtn.style.outline = 'none';
        onBtn.dataset.choise = 'false';
    }

    constructor(){
        super();
        this.cardBtn.dataset.choise = 'false';
        this.cashBtn.dataset.choise = 'false';

        this.cardPage.addEventListener('click', (evt) => {
            const target = evt.target as HTMLElement;

            const cardBtn = target.closest('[name=card]');
            if(cardBtn){
                console.log('card click')
                this.toggleBtn(this.cardBtn, this.cashBtn);
                this.checkValid(this.orderFirstElement);
                return;
            }

            const cashBtn = target.closest('[name=cash');
            if(cashBtn){
                console.log('cash click');
                this.checkValid(this.orderFirstElement);
                this.toggleBtn(this.cashBtn, this.cardBtn);
                return;
            }

        })

        this.orderFirstElement.addEventListener('input', (evt) => {
            this.checkValid(this.orderFirstElement)

        });
            
    }
    

    render(){
        this.cardPage.replaceChildren();
        
        this.cardPage.append(this.orderFirstElement);
    }
}


//Модели данных
const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const orderModel = new OrderModel();

//Отображения
const catalogView: CatalogView = new CatalogView('gallery');
const cardView: CardView = new CardView();
const basketItemView: BasketItemView = new BasketItemView();
const basketView: BasketView = new BasketView();
const orderFirstView: OrderFirstView = new OrderFirstView();

basketView.onDeleteItem = (id: string) => {
                console.log('delete');
                console.log(id);
                basketModel.remove(id);
                orderModel.removeOrder(id);
                console.log(basketModel);
                basketView.renderCounter(basketModel.getCount());
                cardView.enableBuyButton();
                openBasket();
            }

basketView.onPlaceOrder = () => {
    orderFirstView.render();
}

function openBasket(){
    
    const items : Item[] = basketModel.getTotal();
    
    const itemsView: IViewBasketItem[] = [];
    let total : number = 0;
    for (let i = 0; i < items.length; i++){
        const currentItem = items[i];

        itemsView.push({
            id: items[i].id,
            index: i+1,
            title: items[i].title,
            price: items[i].price,
            
        });
        total += items[i].price;
    }
    console.log(itemsView);
    
    let basketList : HTMLUListElement = basketView.getBasketList();
    
    basketList.replaceChildren();
    itemsView.forEach((item) => {
        console.log(item);
        
        basketList = basketItemView.renderInBasket(item, basketList);
        console.log(basketList);
    })
    console.log(basketList);
    orderModel.total = total;
    basketView.render(basketList, total);
    
}



api.get('/product')
    .then((res : IApiList) => {

        const items = res.items.map(data => new Item(data));

        catalogModel.setItems(items)

        const viewItems : IViewMainPage[] = catalogModel.getItems().map(item => ({
            category: item.category,
            title: item.title,
            image: item.image,
            price: item.price,
            onClick: (evt: Event) => {
                catalogModel.getItemById(item.id)
                    .then((resultItem) => {
                        console.log(`${resultItem.id}`)
                        const result: IViewItem = {
                            category: resultItem.category,
                            title: resultItem.title,
                            image: resultItem.image,
                            price: resultItem.price,
                            description: resultItem.description,
                            onBuy(){
                                // catalogModel.getItemById(item.id)
                                // .then((addItem)=> {
                                //     if (basketModel.itemOnBasket(addItem.id)) {
                                //         cardView.disableBuyButton();
                                //     }
                                //     else{
                                        
                                //     }
                                    
                                // });
                                console.log('выполнилось');
                                orderModel.addOrder(new Item(resultItem));
                                basketModel.add(new Item(resultItem));
                                basketView.renderCounter(basketModel.getCount());
                                cardView.disableBuyButton();
                            }
                        }
                        if(resultItem.price === null){
                            cardView.disableBuyButtonNull();
                        }
                        else if (basketModel.itemOnBasket(resultItem.id)) {
                            cardView.disableBuyButton();

                            console.log('есть в корзине');
                        }
                        else {
                            cardView.enableBuyButton();
                        }
                        cardView.render(result);
                });
            }
        }));
        
        catalogView.render(viewItems);
    });


