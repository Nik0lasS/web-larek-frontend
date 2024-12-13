import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { OrderFormView } from './OrderFormView';

export class OrderFormContactView extends OrderFormView {
    private readonly _emailInput: HTMLInputElement;
    private readonly _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents, submitProcessor: () => void) {
        super(container, events);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', (e: Event) => {
            e.preventDefault();
            this.onFieldChange('contacts', 'email', (e.target as HTMLInputElement).value || null);
        });

        this._phoneInput.addEventListener('input', (e: Event) => {
            e.preventDefault();
            this.onFieldChange('contacts', 'phone', (e.target as HTMLInputElement).value || null);
        });

        this._submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            submitProcessor();
        });
    }
}