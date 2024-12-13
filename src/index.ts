import './scss/styles.scss';
import {LarekApi} from "./components/larekApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {ProductsDataModel} from "./components/model/ProductsDataModel";
import {CartDataModel} from "./components/model/CartDataModel";
import {FormDataModel} from "./components/model/FormDataModel";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {MainPageView} from "./components/view/MainPageView";
import {CartView} from "./components/view/CartView";
import {ModalView} from "./components/view/ModalView";
import {OrderFormContactView} from "./components/view/OrderFormContactView";
import {OrderFormAddressView} from "./components/view/OrderFormAddressView";
import {OrderSuccessView} from "./components/view/OrderSuccessView";
import { ProductView }  from './components/view/ProductView';

const larekApi = new LarekApi(API_URL, CDN_URL);
const events = new EventEmitter();

// экземпляры моделей данных
const productsDataModel = new ProductsDataModel(events);
const cartDataModel = new CartDataModel(events);
const formDataModel = new FormDataModel(events);

// элементы темплейтов
const productGalleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productDetailsTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// экземпляры вьюх
const mainPageView = new MainPageView(events);
const cartView = new CartView(cloneTemplate(cartTemplate), events);
const modalView = new ModalView(modalTemplate, events);
const orderFormAddressView = new OrderFormAddressView(cloneTemplate(orderAddressTemplate), events);
const orderFormContactView = new OrderFormContactView(cloneTemplate(orderContactsTemplate), events);
const orderSuccessView = new OrderSuccessView(cloneTemplate(orderSuccessTemplate), events);

// слушатели событий
events.on(
    'products:changed',
    () => {
        const products = productsDataModel.getProducts();
        const productsElements = products.map(p => {
            const product = new ProductView(
                cloneTemplate(productGalleryTemplate),
                events,
                {
                    onProductClick: () => {
                        events.emit('product:select', { id: p.id });
                    },
                },
            );

            // заполняем данные продукта
            product.setTitle(p.title);
            product.setCategory(p.category);
            product.setImageComponentContent(p.image);
            product.setPrice(p.price ? `${p.price} синапсов` : 'Бесценно');

            return product.render();
        });

        mainPageView.setProducts(productsElements);
    },
);

// при открытии приложения инициируем подгрузку продуктов
larekApi.getProductsInfo()
    .then(({items}) => {
        productsDataModel.setProducts(items);
    })
    .catch(e => {
        console.error(e);
    });
