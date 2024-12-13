import { Api, ApiListResponse } from './base/api';
import { IOrder, IProduct } from '../types';

interface ILarekApi {
    getProductsInfo(): Promise<ApiListResponse<IProduct>>,
    makeOrder(order: IOrder): Promise<{ id: string, total: number}>,
}

export class LarekApi extends Api implements ILarekApi {

    constructor(baseUrl: string, private readonly _cdnUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProductsInfo() {
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

    makeOrder(order: IOrder) {
        return this.post('/order', order)
            .then((data: { id: string, total: number}) => data);
    }
}