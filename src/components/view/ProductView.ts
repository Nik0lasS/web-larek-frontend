import { IEvents } from '../base/events';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { categoryClassMap } from '../../utils/constants';

interface IProductView {
    setTitle(value: string): void,
    setCategory(value: string): void,
    setImageComponentContent(value: string): void,
    setPrice(value: number | null): void,
    setDescription(value: string): void,
    setIndex(value: number): void,
    setActionButtonTextContent(value: string): void,
}

export class ProductView extends Component implements IProductView{
    private readonly _title: HTMLHeadingElement;
    private readonly _category: HTMLSpanElement;
    private readonly _image: HTMLImageElement;
    private readonly _price: HTMLSpanElement;
    private readonly _description: HTMLParagraphElement;
    private readonly _index: HTMLSpanElement;
    private readonly _actionButton: HTMLButtonElement;

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
        this._price = ensureElement<HTMLSpanElement>('.card__price', container);

        // не в каждом представлении продукта есть эти элементы, а ensureElement
        // может выбрасывать ошибку
        try {
            this._category = ensureElement<HTMLSpanElement>('.card__category', container);
        } catch { /* empty */ }

        try {
            this._image = ensureElement<HTMLImageElement>('.card__image', container);
        } catch { /* empty */ }

        try {
            this._description = ensureElement<HTMLParagraphElement>('.card__text', container);
        } catch { /* empty */ }

        try {    
            this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container);
        } catch { /* empty */ }

        try {
            this._actionButton = ensureElement<HTMLButtonElement>('.card__button', container);
        } catch { /* empty */ }    

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
        this.toggleClass(this._category, categoryClassMap[value], true);
    }

    setImageComponentContent(value: string) {
        this.setImage(this._image, value, this._title.textContent || '');
    }

    setPrice(value: number | null) {
        this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
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