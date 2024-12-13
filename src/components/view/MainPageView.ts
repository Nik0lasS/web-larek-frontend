import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class MainPageView extends Component {
    protected _cartCounter: HTMLSpanElement;
    protected _cartButton: HTMLButtonElement;
    protected _mainPageWrapper: HTMLDivElement;
    protected _gallery: HTMLElement;


    constructor(events: IEvents) {
        super(document.body, events);

        this._cartCounter = ensureElement<HTMLSpanElement>('.header__basket-counter');
        this._cartButton = ensureElement<HTMLButtonElement>('.header__basket');
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._mainPageWrapper = ensureElement<HTMLDivElement>('.page__wrapper');

        this._cartButton.addEventListener('click', () => {
            this._events.emit('cart:open');
        });
    }

    setProducts(elements: HTMLElement[]) {
        this._gallery.replaceChildren(...elements);
    }

    setCartCounter(value: number) {
        this.setText(this._cartCounter, String(value));
    }

    toggleLocked() {
        this.toggleClass(this._mainPageWrapper, 'page__wrapper_locked');
    }
}