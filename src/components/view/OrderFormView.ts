import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IOrderFormView {
    setErrors(errors?: string | number): void,
    disableNextButton(state: boolean): void,
}

export abstract class OrderFormView extends Component implements IOrderFormView{
    protected readonly _errors: HTMLSpanElement;
    protected readonly _submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._errors = ensureElement<HTMLSpanElement>('.form__errors', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    }

    protected onFieldChange(formStep: 'address' | 'contacts', name: string, value: string | null): void {
        this._events.emit('orderForm:input', {  formStep, name, value });
    }

    setErrors(errors?: string | number): void {
        this.setText(this._errors, errors || '');
    }

    disableNextButton(state: boolean): void {
        this.setDisabled(this._submitButton, state);
    }
}