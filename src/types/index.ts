export interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IUserData {
  payment: 'online' | 'atReceipt';
  email: string;
  phone: string;
  address: string;
  setDelivery(delivery: TUserDelivery): void;
  setContacts(contacts: TUserContacts): void;
  clear(): void;
}

export interface IItemsData {
  total: number;
  items: IItem[];
  preview: string | null;
  getItem(id: string): IItem;
  setItems(items: IItem[]): void;
}

export interface IOrderData {
  total: number | null;
  items: string[];
  userData: IUserData;
  addItem(id: string): void;
  removeItem(id: string): void;
  clear(): void;
  getItems(ids: string[]): IItem[];
}


export type TItemInfo = Pick<IItem, 'description' | 'image' | 'title' | 'category' | 'price'>;

export type TUserDelivery = Pick<IUserData, 'payment' | 'address'>;

export type TUserContacts = Pick<IUserData, 'email' | 'phone'>;

export type TUserOrder = Pick<IOrderData, 'total' | 'items'>;

export type TUserSuccess = Pick<IOrderData, 'total'>;