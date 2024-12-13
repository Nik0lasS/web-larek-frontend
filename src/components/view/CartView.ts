import { IEvents } from '../base/events';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

interface ICartView {
    disableMakeOrderButtonState(state: boolean): void,
    setTotalPrice(price: number): void,
    setCartItems(items: HTMLElement[]): void,
}

export class CartView extends Component implements ICartView {
    private readonly _cartItems: HTMLUListElement;
    private readonly _makeOrderButton: HTMLButtonElement;
    private readonly _totalPrice: HTMLSpanElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._cartItems = ensureElement<HTMLUListElement>('.basket__list', container);
        this._makeOrderButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        this._totalPrice = ensureElement<HTMLSpanElement>('.basket__price', container);

        this._makeOrderButton.addEventListener(
            'click',
            () => this._events.emit('orderFormAddress:open'),
        );
    }

    setCartItems(items: HTMLElement[]): void {
        this._cartItems.replaceChildren(...items);
    }

    disableMakeOrderButtonState(state: boolean): void {
        this.setDisabled(this._makeOrderButton, state);
    }

    setTotalPrice(price: number): void {
        this.setText(this._totalPrice, `${price} синапсов`);
    }
}