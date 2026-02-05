import { IViewMainPage, IViewItem, IViewBasketItem } from '../types';
import { CDN_URL } from '../utils/constants';
//Классы Отображения

export class CatalogView {
	mainPage: HTMLElement;

	constructor(className: string) {
		this.mainPage = document.querySelector(`.${className}`);
	}

	onClick?: (id: string) => void;
	render(items: IViewMainPage[]) {
		this.mainPage.replaceChildren();
		const cardTemplate: HTMLTemplateElement =
			document.querySelector('#card-catalog');
		items.forEach((item) => {
			const cardElement = cardTemplate.content
				.querySelector('.card')!
				.cloneNode(true) as HTMLElement;
			const category = cardElement.querySelector(
				'.card__category'
			) as HTMLElement;
			category.textContent = item.category;

			const title = cardElement.querySelector('.card__title') as HTMLElement;
			title.textContent = item.title;

			const image = cardElement.querySelector(
				'.card__image'
			) as HTMLImageElement;
			image.src = CDN_URL + item.image;
			console.log(CDN_URL + item.image);
			const price = cardElement.querySelector('.card__price') as HTMLElement;
			if (item.price === null) price.textContent = 'Бесценно';
			else price.textContent = `${item.price} синапсов`;

			cardElement.addEventListener('click', () => {
				this.onClick?.(item.id);
			});
			this.mainPage.append(cardElement);
		});
	}
}

abstract class ModalView {
	modalWindow = document.querySelector('.modal') as HTMLElement;
	cardPage = this.modalWindow.querySelector('.modal__content') as HTMLElement;
	closeButton = this.modalWindow.querySelector(
		'.modal__close'
	) as HTMLButtonElement;
	popup = this.modalWindow;
	closeByOverlay = () => {
		this.closeModal();
	};

	addOverlayListener = () => {
		this.popup.addEventListener('click', this.closeByOverlay);
	};

	removeOverlayListener = () => {
		this.popup.removeEventListener('click', this.closeByOverlay);
	};

	closeByEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	};

	openModal = () => {
		this.popup.classList.add('modal_active');

		const popupContent = this.popup.querySelector('.modal__container');

		document.addEventListener('keydown', this.closeByEscape);

		this.popup.addEventListener('click', this.closeByOverlay);

		popupContent.addEventListener('mouseleave', this.addOverlayListener);

		popupContent.addEventListener('mouseenter', this.removeOverlayListener);
	};

	closeModal = () => {
		this.popup.classList.remove('modal_active');

		const popupContent = this.popup.querySelector('.modal__container');

		this.popup.removeEventListener('click', this.closeByOverlay);

		popupContent.removeEventListener('mouseleave', this.addOverlayListener);

		popupContent.removeEventListener('mouseenter', this.removeOverlayListener);

		document.removeEventListener('keydown', this.closeByEscape);
	};

	constructor() {
		this.closeButton.addEventListener('click', () => {
			this.closeModal();
		});
	}
}

export class CardView extends ModalView {
	cardTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
	cardElement = this.cardTemplate.content
		.querySelector('.card')!
		.cloneNode(true) as HTMLElement;
	category = this.cardElement.querySelector('.card__category') as HTMLElement;
	title = this.cardElement.querySelector('.card__title') as HTMLElement;
	image = this.cardElement.querySelector('.card__image') as HTMLImageElement;
	text = this.cardElement.querySelector('.card__text') as HTMLParagraphElement;
	button = this.cardElement.querySelector('.card__button') as HTMLButtonElement;
	price = this.cardElement.querySelector('.card__price') as HTMLElement;
	id: string;

	onBuy?: (id: string) => void;

	constructor() {
		super();
		this.cardPage.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;

			const addBtn = target.closest('.card__button');
			if (addBtn) {
				const addBtnDiv = target.closest('.card__row');
				if (!addBtnDiv) return;

				this.onBuy?.(this.id);
				return;
			}
		});
	}

	render(item: IViewItem) {
		this.cardPage.replaceChildren();
		this.category.textContent = item.category;

		this.title.textContent = item.title;

		this.image.src = CDN_URL + item.image;

		this.text.textContent = item.description;

		this.id = item.id;

		if (item.price) this.price.textContent = `${item.price} синапсов`;

		this.cardPage.append(this.cardElement);
		this.openModal();
	}

	disableBuyButton() {
		this.button.textContent = 'Товар уже в корзине';
		this.button.setAttribute('disabled', '');
		this.button.style.backgroundColor = 'grey';
	}

	disableBuyButtonNull() {
		this.price.textContent = 'Бесценно';
		this.button.textContent = 'Невозможно';
		this.button.setAttribute('disabled', '');
		this.button.style.backgroundColor = 'grey';
	}

	enableBuyButton() {
		this.button.textContent = 'В корзину';
		this.button.removeAttribute('disabled');
		this.button.style.backgroundColor = 'white';
	}
}

export class BasketItemView extends ModalView {
	constructor() {
		super();
	}

	renderInBasket(item: IViewBasketItem, basket__list: HTMLUListElement) {
		const cardBasketTemplate: HTMLTemplateElement =
			document.querySelector('#card-basket');
		const cardBasketElement: HTMLElement = cardBasketTemplate.content
			.querySelector('.card_compact')!
			.cloneNode(true) as HTMLElement;

		const indexBasket: HTMLSpanElement = cardBasketElement.querySelector(
			'.basket__item-index'
		);
		const titleBasket: HTMLSpanElement =
			cardBasketElement.querySelector('.card__title');
		const priceBasket: HTMLSpanElement =
			cardBasketElement.querySelector('.card__price');

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

export class BasketView extends ModalView {
	icon = document.querySelector('.header__basket');
	counter = this.icon.querySelector(
		'.header__basket-counter'
	) as HTMLSpanElement;

	basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
	basketElement = this.basketTemplate.content
		.querySelector('.basket')!
		.cloneNode(true) as HTMLElement;
	basketList: HTMLUListElement =
		this.basketElement.querySelector('.basket__list');
	deleteButton: HTMLButtonElement = this.basketElement.querySelector('.button');
	basketPrice: HTMLSpanElement =
		this.basketElement.querySelector('.basket__price');
	placeOrderBtn: HTMLButtonElement =
		this.basketElement.querySelector('.basket__button');

	onDeleteItem?: (id: string) => void;
	onPlaceOrder?: () => void;
	openBasket?: () => void;

	constructor() {
		super();
		this.icon.addEventListener('click', () => {
			this.openBasket();
		});

		this.cardPage.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;

			const deleteBtn = target.closest('.basket__item-delete');
			if (deleteBtn) {
				evt.stopPropagation();
				const itemEl = deleteBtn.closest('.card_compact') as HTMLElement;
				if (!itemEl) return;

				const id = itemEl.dataset.id;
				if (!id) return;

				this.onDeleteItem?.(id);
				return;
			}

			const placeOrderBtn = target.closest('.basket__button');
			if (placeOrderBtn) {
				this.onPlaceOrder?.();
				return;
			}
		});
	}
	renderCounter(count: number) {
		this.counter.textContent = `${count}`;
	}

	render(basket__list: HTMLUListElement, total: number) {
		console.log('work');
		this.cardPage.replaceChildren();

		this.basketList = basket__list;
		this.basketPrice.textContent = `${total} синапсов`;
		console.log(basket__list);

		if (total === 0) this.placeOrderBtn.setAttribute('disabled', 'true');
		else this.placeOrderBtn.removeAttribute('disabled');

		this.cardPage.append(this.basketElement);
		this.openModal();
	}
	getBasketList(): HTMLUListElement {
		return this.basketList;
	}
}

export class OrderFirstView extends ModalView {
	orderFirstTemplate: HTMLTemplateElement = document.querySelector('#order');
	orderFirstElement = this.orderFirstTemplate.content
		.querySelector('.form')!
		.cloneNode(true) as HTMLFormElement;
	formErrors = this.orderFirstElement.querySelector('.form__errors');
	cardBtn = this.orderFirstElement.querySelector(
		'[name=card]'
	) as HTMLButtonElement;
	cashBtn = this.orderFirstElement.querySelector(
		'[name=cash]'
	) as HTMLButtonElement;
	inputAddress = this.orderFirstElement.querySelector(
		'[name=address]'
	) as HTMLInputElement;
	nextBtn = this.orderFirstElement.querySelector(
		'.order__button'
	) as HTMLButtonElement;

	onNextPage?: (evt: Event, orderElement: HTMLElement) => void;

	constructor() {
		super();
		this.cardBtn.dataset.choice = 'false';
		this.cashBtn.dataset.choice = 'false';

		this.cardPage.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;

			const cardBtn = target.closest('[name=card]');
			if (cardBtn) {
				console.log('card click');
				this.toggleBtn(this.cardBtn, this.cashBtn);
				this.checkValid();
				return;
			}

			const cashBtn = target.closest('[name=cash');
			if (cashBtn) {
				console.log('cash click');
				this.toggleBtn(this.cashBtn, this.cardBtn);
				this.checkValid();
				return;
			}

			const nextBtn = target.closest('.order__button');
			if (nextBtn) {
				this.onNextPage?.(evt, this.orderFirstElement);
			}
		});

		this.orderFirstElement.addEventListener('input', () => {
			this.checkValid();
		});
	}
	checkValid() {
		console.log('checkvalid');

		console.log(this.formErrors);
		console.log(this.cardBtn.dataset);
		console.log(this.cashBtn.dataset);
		if (
			this.cardBtn.dataset.choice === 'false' &&
			this.cashBtn.dataset.choice === 'false'
		) {
			this.formErrors.textContent = 'выберите способ оплаты';
			this.nextBtn.setAttribute('disabled', 'true');
		} else if (this.inputAddress.value.length === 0) {
			this.formErrors.textContent = 'укажите адрес доставки';
			this.nextBtn.setAttribute('disabled', 'true');
		} else {
			this.formErrors.textContent = '';
			this.nextBtn.removeAttribute('disabled');
		}
	}

	toggleBtn(onBtn: HTMLButtonElement, offBtn: HTMLButtonElement) {
		onBtn.style.outline = '2px solid white';
		onBtn.dataset.choice = 'true';

		offBtn.style.outline = 'none';
		offBtn.dataset.choice = 'false';
		console.log('toggle button');
		console.log(onBtn.dataset);
		console.log(offBtn.dataset);
	}

	clearForm() {
		this.inputAddress.value = '';
		this.cardBtn.dataset.choice = 'false';
		this.cardBtn.style.outline = 'none';

		this.cashBtn.dataset.choice = 'false';
		this.cashBtn.style.outline = 'none';

		this.formErrors.textContent = '';
	}

	render() {
		this.cardPage.replaceChildren();

		this.cardPage.append(this.orderFirstElement);
	}
}

export class OrderSecondView extends ModalView {
	orderSecondTemplate: HTMLTemplateElement =
		document.querySelector('#contacts');
	orderSecondElement = this.orderSecondTemplate.content
		.querySelector('.form')!
		.cloneNode(true) as HTMLFormElement;
	formErrors = this.orderSecondElement.querySelector('.form__errors');

	emailInput = this.orderSecondElement.querySelector(
		'[name=email]'
	) as HTMLInputElement;
	phoneInput = this.orderSecondElement.querySelector(
		'[name=phone]'
	) as HTMLInputElement;
	payBtn = this.orderSecondElement.querySelector('.button');

	payOrder?: (evt: Event, orderElement: HTMLElement) => void;

	constructor() {
		super();

		this.cardPage.addEventListener('input', () => {
			this.checkValid();
		});

		this.cardPage.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;
			const payBtn = target.closest('.button');
			if (payBtn) {
				const payModal = target.closest('[name=contacts]');
				if (!payModal) return;
				console.log('clicked to pay');
				this.payOrder?.(evt, this.orderSecondElement);
			}
		});
	}

	checkValid() {
		if (this.emailInput.value.length === 0) {
			this.formErrors.textContent = 'укажите майл';
			this.payBtn.setAttribute('disabled', 'true');
		} else if (this.phoneInput.value.length === 0) {
			this.formErrors.textContent = 'укажите телефон';
			this.payBtn.setAttribute('disabled', 'true');
		} else {
			this.formErrors.textContent = '';
			this.payBtn.removeAttribute('disabled');
		}
	}

	clearForm() {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.formErrors.textContent = '';
	}

	render() {
		this.cardPage.replaceChildren();

		this.cardPage.append(this.orderSecondElement);
	}
}

export class OrderSuccessView extends ModalView {
	orderSuccessTemplate: HTMLTemplateElement =
		document.querySelector('#success');
	orderSuccessElement = this.orderSuccessTemplate.content
		.querySelector('.order-success')!
		.cloneNode(true) as HTMLElement;
	orderDescription = this.orderSuccessElement.querySelector(
		'.order-success__description'
	);
	startNewOrder?: () => void;
	constructor() {
		super();
		this.cardPage.addEventListener('click', (evt) => {
			const target = evt.target as HTMLElement;

			const newOrder = target.closest('.order-success__close');
			if (newOrder) {
				this.closeModal();
			}
		});
	}
	render(total: number) {
		this.cardPage.replaceChildren();

		this.orderDescription.textContent = `Списано ${total} синапсов`;

		this.cardPage.append(this.orderSuccessElement);
	}
}
