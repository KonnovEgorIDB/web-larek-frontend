import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { Item, CatalogModel, BasketModel, OrderModel } from './models';
import {
	CatalogView,
	CardView,
	BasketItemView,
	BasketView,
	OrderFirstView,
	OrderSecondView,
	OrderSuccessView,
} from './views';
import {
	IApiItem,
	IViewItem,
	IApiOrder,
	IViewBasketItem,
	IApiList,
	IViewMainPage,
} from './types';
//API
const api = new Api(API_URL);

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
const orderSecondView = new OrderSecondView();
const orderSuccessView = new OrderSuccessView();

//Контроллеры
catalogView.onClick = (id: string) => {
	api.get(`/product/${id}`).then((resultItem: IApiItem) => {
		console.log(`${resultItem.id}`);
		const result: IViewItem = {
			category: resultItem.category,
			title: resultItem.title,
			image: resultItem.image,
			price: resultItem.price,
			description: resultItem.description,
			id: resultItem.id,
		};
		if (resultItem.price === null) {
			cardView.disableBuyButtonNull();
		} else if (basketModel.itemOnBasket(resultItem.id)) {
			cardView.disableBuyButton();

			console.log('есть в корзине');
		} else {
			cardView.enableBuyButton();
		}
		cardView.render(result);
	});
};

cardView.onBuy = (id: string) => {
	console.log('выполнилось');
	const resultItem = catalogModel.getItemByIdLocal(id);

	orderModel.addOrder(resultItem);

	basketModel.add(resultItem);

	basketView.renderCounter(basketModel.getCount());
	cardView.disableBuyButton();
};

basketView.onDeleteItem = (id: string) => {
	console.log('delete');
	console.log(id);
	basketModel.remove(id);
	orderModel.removeOrder(id);
	console.log(basketModel);
	basketView.renderCounter(basketModel.getCount());
	cardView.enableBuyButton();
	basketView.openBasket();
};

basketView.onPlaceOrder = () => {
	orderFirstView.render();
};

orderFirstView.onNextPage = (evt, orderElement) => {
	evt.preventDefault();

	const cardBtn = orderElement.querySelector(
		'[name=card]'
	) as HTMLButtonElement;
	const cashBtn = orderElement.querySelector(
		'[name=cash]'
	) as HTMLButtonElement;
	const inputAddress = orderElement.querySelector(
		'[name=address]'
	) as HTMLInputElement;

	if (cardBtn.dataset.choice === 'true') orderModel.payment = 'online';
	if (cashBtn.dataset.choice === 'true') orderModel.payment = 'on delivery';

	orderModel.address = inputAddress.value;
	console.log(orderModel.address);
	console.log(orderModel.payment);

	console.log('next page!');
	orderSecondView.render();
};

orderSecondView.payOrder = (evt, orderElement) => {
	evt.preventDefault();

	const emailInput = orderElement.querySelector(
		'[name=email]'
	) as HTMLInputElement;
	const phoneInput = orderElement.querySelector(
		'[name=phone]'
	) as HTMLInputElement;

	orderModel.email = emailInput.value;
	orderModel.phone = phoneInput.value;

	const apiPostOrder: IApiOrder = orderModel.getOrder();

	console.log('send order');
	console.log(apiPostOrder);
	api
		.post('/order', apiPostOrder)
		.then((res) => {
			console.log('correct!');
			console.log(res);
			orderSuccessView.render(orderModel.total);
			orderSuccessView.startNewOrder();
		})
		.catch((res) => {
			console.log('incorrect!');
			console.log(res);
		});
};

orderSuccessView.startNewOrder = () => {
	orderModel.clear();
	basketModel.clear();
	basketView.renderCounter(0);
	orderFirstView.clearForm();
	orderSecondView.clearForm();
};

basketView.openBasket = () => {
	const items: Item[] = basketModel.getTotal();

	const itemsView: IViewBasketItem[] = [];
	let total = 0;
	for (let i = 0; i < items.length; i++) {
		itemsView.push({
			id: items[i].id,
			index: i + 1,
			title: items[i].title,
			price: items[i].price,
		});
		total += items[i].price;
	}
	console.log(itemsView);

	let basketList: HTMLUListElement = basketView.getBasketList();

	basketList.replaceChildren();
	itemsView.forEach((item) => {
		console.log(item);

		basketList = basketItemView.renderInBasket(item, basketList);
		console.log(basketList);
	});
	console.log(basketList);
	orderModel.total = total;
	basketView.render(basketList, total);
};

api.get('/product').then((res: IApiList) => {
	const items = res.items.map((data) => new Item(data));

	catalogModel.setItems(items);

	const viewItems: IViewMainPage[] = catalogModel.getItems().map((item) => ({
		id: item.id,
		category: item.category,
		title: item.title,
		image: item.image,
		price: item.price,
	}));

	catalogView.render(viewItems);
});
