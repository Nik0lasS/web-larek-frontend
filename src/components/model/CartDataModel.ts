import { IEvents } from '../base/events';
import { ICartData, IProduct } from '../../types';

export class CartDataModel implements ICartData {
    protected _cartItems: IProduct[] = [];

    constructor(protected events: IEvents) {
        this.events = events;
    }

    addCartItem(product: IProduct): void {
        this._cartItems.push(product);
        this.events.emit('cart:changed');
    }

    clearCart(): void {
        this._cartItems = [];
        this.events.emit('cart:changed');
    }

    deleteCartItem(id: IProduct['id']): void {
        this._cartItems = this._cartItems.filter(ci => ci.id !== id);
        this.events.emit('cart:changed');
    }

    getCartItems(): IProduct[] {
        return this._cartItems;
    }

    getCartItemsCount(): number {
        return this._cartItems.length;
    }

    getCartItemsIds(): Array<IProduct['id']> {
        return this._cartItems
            .filter(ci => !!ci.price)
            .map(ci => ci.id);
    }

    getTotalCost(): number {
        return this._cartItems.reduce<number>((acc, ci) => {
            if (ci.price) {
                acc+=ci.price;
            }

            return acc;
        }, 0);
    }

    isProductInCart(id: IProduct['id']): boolean {
        return !!this._cartItems.find(ci => ci.id === id)
    }

    isZeroTotalCost(): boolean {
        return this.getTotalCost() === 0;
    }
}