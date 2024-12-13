import { IEvents } from '../base/events';
import { IOrder, IOrderData, OrNullValue, TOrderFieldsInfo } from '../../types';
import { formFieldsNameMap } from '../../utils/constants';

const defaultOrderValues: OrNullValue<IOrder> = {
    payment: null,
    email: null,
    phone: null,
    address: null,
    total: null,
    items: null,
};

const defaultOrderErrorsValues: Record<keyof TOrderFieldsInfo, string> = {
    payment: '',
    email: '',
    phone: '',
    address: '',
};

export class FormDataModel implements IOrderData{
    protected _data: OrNullValue<IOrder> = {
        ...defaultOrderValues,
    };
    protected _errors: Record<keyof TOrderFieldsInfo, string> = {
        ...defaultOrderErrorsValues,
    };

    constructor(protected events: IEvents) {
        this.events = events;
    }

    clearOrderData() {
        this._data = defaultOrderValues;
        this._errors = defaultOrderErrorsValues;
    }

    deleteFieldError(fieldName: keyof TOrderFieldsInfo): void {
        this._errors[fieldName] = '';
    }

    getAddressValue(): IOrder['address'] | null {
        return this._data.address;
    }

    getEmailValue(): IOrder['email'] | null {
        return this._data.email;
    }

    getErrors(): Record<keyof TOrderFieldsInfo, string> {
        return this._errors;
    }

    getPaymentValue(): IOrder['payment'] | null {
        return this._data.payment;
    }

    getPhoneValue(): IOrder['phone'] | null {
        return this._data.phone;
    }

    setAddressValue(value: IOrder['address'] | null): void {
        this._data.address = value;
    }

    setEmailValue(value: IOrder['email'] | null): void {
        this._data.email = value;
    }

    setFieldError(fieldName: keyof TOrderFieldsInfo, error: string): void {
        this._errors[fieldName] = error;
    }

    setPaymentValue(value: IOrder['payment'] | null): void {
        this._data.payment = value;
    }

    setPhoneValue(value: IOrder['phone'] | null): void {
        this._data.phone = value;
    }

    setProductsIds(ids: IOrder['items'] | null): void {
        this._data.items = ids;
    }

    setTotalCost(value: IOrder['total'] | null): void {
        this._data.total = value;
    }

    validateFormFields(): void {
        Object.entries({
            email: this.getEmailValue(),
            phone: this.getPhoneValue(),
            payment: this.getPaymentValue(),
            address: this.getAddressValue(),
        }).forEach(([key, value]) => {
            this.setFieldError(
                key as keyof TOrderFieldsInfo,
                value ? '' : `Поле ${formFieldsNameMap[key]} должно быть заполнено`,
            );
        });
    }

    getOrderData(): OrNullValue<IOrder> {
        return this._data;
    }
}