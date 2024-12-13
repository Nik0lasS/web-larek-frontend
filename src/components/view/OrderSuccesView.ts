import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

interface IOrderSuccessView {
    _totalPrice: HTMLParagraphElement,
    _actionButton: HTMLButtonElement
    setTotalPrice(price: number): void,
}

export class OrderSuccessView extends Component implements IOrderSuccessView {
    private readonly _totalPrice: HTMLParagraphElement;
    private readonly _actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._totalPrice = ensureElement<HTMLParagraphElement>('.order-success__description', container);
        this._actionButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._actionButton.addEventListener('click', () => {
            this._events.emit('modal:close');
        });
    }

    setTotalPrice(price: number): void {
        this.setText(this._totalPrice, `Списано ${price} синапсов`)
    }
}