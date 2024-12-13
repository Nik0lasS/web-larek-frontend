import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { OrderFormView } from './OrderFormView';

interface IOrderFormContactView {
    _emailInput: HTMLInputElement,
    _phoneInput: HTMLInputElement,
}

export class OrderFormContactView extends OrderFormView implements IOrderFormContactView {
    private readonly _emailInput: HTMLInputElement;
    private readonly _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', (e: Event) => {
            e.preventDefault();
            this.onFieldChange('email', (e.target as HTMLInputElement).value || null);
        });

        this._emailInput.addEventListener('input', (e: Event) => {
            e.preventDefault();
            this.onFieldChange('phone', (e.target as HTMLInputElement).value || null);
        });
    }
}