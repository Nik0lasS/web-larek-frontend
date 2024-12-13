import { IEvents } from '../base/events';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

export class ProductView extends Component {
    protected _title: HTMLHeadingElement;
    protected _category: HTMLSpanElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLSpanElement;
    protected _description: HTMLParagraphElement;
    protected _index: HTMLSpanElement;
    protected _actionButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: IEvents,
        eventsProcessors: {
            onProductClick?: () => void,
            onActionButtonClick?: () => void,
        }
    ) {
        super(container, events);

        this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
        this._category = ensureElement<HTMLSpanElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._price = ensureElement<HTMLSpanElement>('.card__price', container);
        this._description = ensureElement<HTMLParagraphElement>('.card__text', container);
        this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container);
        this._actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

        if (eventsProcessors?.onProductClick) {
            container.addEventListener('click', eventsProcessors.onProductClick);
        }

        if (eventsProcessors?.onActionButtonClick) {
            this._actionButton.addEventListener('click', eventsProcessors.onActionButtonClick)
        }
    }

    setTitle(value: string) {
        this.setText(this._title, value);
    }

    setCategory(value: string) {
        this.setText(this._category, value);
    }

    setImageComponentContent(value: string) {
        this.setImage(this._image, value, this._title.textContent || '');
    }

    setPrice(value: string) {
        this.setText(this._price, value);
    }

    setDescription(value: string) {
        this.setText(this._description, value);
    }

    setIndex(value: number) {
        this.setText(this._index, value);
    }

    setActionButtonTextContent(value: string) {
        this.setText(this._actionButton, value);
    }
}