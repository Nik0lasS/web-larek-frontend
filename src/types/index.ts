export interface IProduct {
  id: string,
  description: string,
  image: string,
  title: string,
  category: string,
  price: number | null,
}

export interface IOrder {
  payment: 'card' | 'cash',
  email: string,
  phone: string,
  address: string,
  total: number,
  items: Array<IProduct['id']>,
}

// по факту могут не понадобиться в дальнейшем, были выведены
// во время анализа используемых данных по макетам
export type TOrderAddressInfo = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactInfo = Pick<IOrder, 'email' | 'phone'>;
export type TOrderFieldsInfo = TOrderAddressInfo & TOrderContactInfo;

export interface IProductsData {
  _products: IProduct[],
  _previewId: IProduct['id'] | null,
  // для работы с продуктами
  setProducts(products: IProduct[]): void,
  getProducts(): IProduct[],
  getProductById(id: IProduct['id']): IProduct,
  // для работы с id карточки для превью деталей
  setPreviewId(id: IProduct['id'] | null): void,
  getPreviewId(): IProduct['id'] | null,
}

export interface ICartData {
  _cartItems: IProduct[],
  // для изменения массива содержимого корзины
  clearCart(): void,
  addCartItem(product: IProduct): void,
  deleteCartItem(id: IProduct['id']): void,
  // не мутирующие методы для работы с содержимым корзины
  getCartItems(): IProduct[],
  isProductInCart(id: IProduct['id']): boolean,
  getCartItemsIds(): Array<IProduct['id']>,
  getCartItemsCount(): number,
  getTotalCost(): number,
  validateTotalCost(): boolean,
}

// Аналог Partial<T>, но любое значение из T может быть null
type OrNullValue<T extends object> = {
  [P in keyof T]?: T[P] | null;
};

export interface IOrderData {
  _data: OrNullValue<IOrder>,
  _errors: Record<keyof TOrderFieldsInfo, string>,
  // для работы с ошибками
  validateFormFields(values: OrNullValue<TOrderFieldsInfo>): boolean,
  setFieldError(fieldName: keyof TOrderFieldsInfo, error: string): void,
  deleteFieldError(fieldName: keyof TOrderFieldsInfo): void,
  getErrors(): Record<keyof TOrderFieldsInfo, string>,
  // для работы с данными из формы
  getPaymentValue(): IOrder['payment'] | null,
  setPaymentValue(value: IOrder['payment'] | null): void,
  getAddressValue(): IOrder['address'] | null,
  setAddressValue(value: IOrder['address'] | null): void,
  getEmailValue(): IOrder['email'] | null,
  setEmailValue(value: IOrder['email'] | null): void,
  getPhoneValue(): IOrder['phone'] | null,
  setPhoneValue(value: IOrder['phone'] | null): void,
  // для работы с остальными данными заказа
  setProductsIds(ids: IOrder['items'] | null): void,
  setTotalCost(value: IOrder['total'] | null): void,
  // общий метод очистки данных заказа
  clearOrderData(): void,
}