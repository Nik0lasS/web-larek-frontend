import { IEvents } from '../base/events';
import { IProduct, IProductsData } from '../../types';

export class ProductsDataModel implements IProductsData{
    protected _products: IProduct[] = [];
    protected _previewId: IProduct['id'] | null = null;

    constructor(protected events: IEvents) {
        this.events = events;
    }

    getPreviewId(): IProduct['id'] | null {
        return this._previewId;
    }

    getProductById(id: IProduct['id']): IProduct {
        return this._products.find(p => p.id === id);
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    setPreviewId(id: IProduct['id'] | null): void {
        this._previewId = id;

        if (id) {
            this.events.emit<{ id: IProduct['id'] }>('product:select', { id });
        }
    }

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('products:changed');
    }
}