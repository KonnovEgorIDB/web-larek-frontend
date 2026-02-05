import { categoryType, payType, IItem, IOrder, IApiOrder } from '../types';

//Классы(модели данных)

export class Item implements IItem {
	id: string;
	category: categoryType;
	title: string;
	image: string;
	price: number;
	description: string;

	constructor(data: IItem) {
		this.id = data.id;
		this.category = data.category;
		this.title = data.title;
		this.image = data.image;
		this.price = data.price;
		this.description = data.description;
	}
}

export class OrderModel implements IOrder {
	payment: payType | null = null;
	address: string;
	email: string;
	phone: string;
	total: number;
	itemList: string[] = [];

	addOrder(item: Item) {
		this.itemList.push(item.id);
	}

	removeOrder(id: string) {
		this.itemList = this.itemList.filter((itemInBasket) => itemInBasket !== id);
	}

	getOrder(): IApiOrder {
		const orderDetails = {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.itemList,
		};
		return orderDetails;
	}

	clear(): void {
		this.email = '';
		this.address = '';
		this.itemList = [];
		this.payment = null;
		this.phone = '';
		this.total = 0;
	}
}

export class CatalogModel {
	items: Item[] = [];

	setItems(items: Item[]) {
		this.items = items;
	}

	getItems(): Item[] {
		return this.items;
	}

	getItemByIdLocal(id: string) {
		return this.items.find((item) => item.id === id);
	}
}

export class BasketModel {
	items: Item[] = [];

	add(item: Item) {
		console.log(`add ${item.title}`);
		this.items.push(item);
	}
	remove(id: string) {
		console.log('before');
		console.log(this.items);
		this.items = this.items.filter((itemInBasket) => itemInBasket.id !== id);
		console.log('after');
		console.log(this.items);
	}
	itemOnBasket(id: string) {
		return this.items.some((item) => item.id === id);
	}
	getCount() {
		console.log(this.items);

		return this.items.length;
	}
	getTotal() {
		return this.items;
	}
	clear() {
		this.items = [];
	}
}
