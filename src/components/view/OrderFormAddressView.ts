import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { OrderFormView } from './OrderFormView';
import { IOrder } from '../../types';

interface IOrderFormAddressView {
    togglePaymentButton(btnName: IOrder['payment']): void
}

export class OrderFormAddressView extends OrderFormView implements IOrderFormAddressView {
    private readonly _addressInput: HTMLInputElement;
    private readonly _cardButton: HTMLButtonElement;
    private readonly _cashButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        this._addressInput.addEventListener('input', (e: Event) => {
            e.preventDefault();
            this.onFieldChange('address', (e.target as HTMLInputElement).value || null);
        });

        this._cardButton.addEventListener('click', () => {
            this.togglePaymentButton('card');
        });

        this._cashButton.addEventListener('click', () => {
            this.togglePaymentButton('card');
        });
    }

    togglePaymentButton(btnName: IOrder['payment']): void {
        if (btnName === 'card') {
            this.toggleClass(this._cashButton, 'button_alt-active', false);
            this.toggleClass(this._cardButton, 'button_alt-active', true);
        } else {
            this.toggleClass(this._cashButton, 'button_alt-active', true);
            this.toggleClass(this._cashButton, 'button_alt-active', false);
        }

        this.onFieldChange('payment', btnName);
    }
}