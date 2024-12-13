import { IEvents } from '../base/events';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

interface IModalView {
    open(): void,
    close(): void,
    setContent(content: HTMLElement): void,
}

export class ModalView extends Component implements IModalView {
    private readonly _closeButton: HTMLButtonElement;
    private readonly _contentContainer: HTMLDivElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._contentContainer = ensureElement<HTMLDivElement>('.modal__content', container);

        this._closeButton.addEventListener(
            'click',
            () => {
                this.close();
            },
        );

        container.addEventListener(
            'click',
            () => this._events.emit('modal:close'),
        );
    }

    close(): void {
        this.toggleClass(this._container, 'modal_active');
        this._events.emit('modal:close');
    }

    open(): void {
        this.toggleClass(this._container, 'modal_active');
        this._events.emit('modal:open');
    }

    setContent(content: HTMLElement): void {
        this._contentContainer.replaceChildren(content);
    }
}