import { Api, ApiListResponse } from './base/api';
import { IOrder, IProduct } from '../types';

export class LarekApi extends Api {
    readonly _cdnUrl: string;

    constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this._cdnUrl = cdnUrl;
    }

    getProductsInfo(): Promise<ApiListResponse<IProduct>> {
        return this.get('/product')
            .then((data: ApiListResponse<IProduct>) => {
                return {
                    ...data,
                    items: data.items.map((item) => ({
                        ...item,
                        image: this._cdnUrl + item.image,
                    }))
                };
            });
    }

    makeOrder(order: IOrder): Promise<{ id: string, total: number}> {
        return this.post('/order', order);
    }
}