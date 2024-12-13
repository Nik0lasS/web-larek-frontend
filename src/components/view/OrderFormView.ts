import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export abstract class OrderFormView extends Component {
    protected readonly _errors: HTMLSpanElement;
    protected readonly _submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._errors = ensureElement<HTMLSpanElement>('.form__errors', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    }

    protected onFieldChange(name: string, value: string | null): void {
        this._events.emit('orderForm:input', { name, value });
    }

    protected setErrors(errors?: string | number): void {
        this.setText(this._errors, errors || '');
    }

    protected setMakeNextButtonState(state: boolean): void {
        this.setDisabled(this._submitButton, state);
    }
}