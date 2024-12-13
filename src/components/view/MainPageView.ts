import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IMainPageView {
    setProducts(elements: HTMLElement[]): void,
    setCartCounter(value: number): void,
    toggleLocked(): void,
}

export class MainPageView extends Component implements IMainPageView {
    private readonly _cartCounter: HTMLSpanElement;
    private readonly _cartButton: HTMLButtonElement;
    private readonly _mainPageWrapper: HTMLDivElement;
    private readonly _gallery: HTMLElement;


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