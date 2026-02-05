import { Api, ApiListResponse } from '../components/base/api';
import { API_URL } from '../utils/constants';
export type payType = 'online' | 'on delivery'; //Тип для способа оплаты
export type categoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'хард-скил'
	| 'кнопка';

export interface IApiList {
	total: number;
	items: IItem[];
}

export interface IApiItem {
	id: string;
	category: categoryType;
	title: string;
	image: string;
	price: number | null;
	description: string;
}

export interface IApiOrder {
	payment: payType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

//Основной интерфейс товара
export interface IItem {
	id: string;
	category: categoryType;
	title: string;
	image: string;
	price: number | null;
	description: string;
}

//Основной интерфейс заказа
export interface IOrder {
	payment: payType;
	address: string;
	email: string;
	phone: string;
}

//Интерфейс товара для отображения главной страницы
//Что должно присутствовать в ней
export interface IViewMainPage {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number;
}

//Интерфейс для отображения карточки товара
//В целом все то же самое нужно для
export interface IViewItem {
	category: categoryType;
	title: string;
	image: string;
	price: number;
	description: string;
	id: string;
}

//Интерфейс для вещей в корзине
export interface IViewBasketItem {
	id: string;
	index: number;
	title: string;
	price: number;
}
