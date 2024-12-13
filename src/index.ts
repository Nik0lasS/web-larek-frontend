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
import { IOrder } from './types';

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
const orderFormAddressView = new OrderFormAddressView(
    cloneTemplate(orderAddressTemplate), 
    events, 
    () => {
      events.emit('orderFormContacts:open')
    },
);
const orderFormContactView = new OrderFormContactView(
    cloneTemplate(orderContactsTemplate), 
    events,
    () => {
      events.emit('orderForm:submit')
    },
);
const orderSuccessView = new OrderSuccessView(cloneTemplate(orderSuccessTemplate), events);

// слушатели событий

// при успешной подгрузке товаров с сервера наполняем главную страницу
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
                        productsDataModel.setPreviewId(p.id);
                    },
                },
            );

            // заполняем данные продукта
            product.setTitle(p.title);
            product.setCategory(p.category);
            product.setImageComponentContent(p.image);
            product.setPrice(p.price);

            return product.render();
        });

        mainPageView.setProducts(productsElements);
    },
);

// при клике на карточку открываем описание в модалке
events.on('productPreviewId:changed', () => {
  const productId = productsDataModel.getPreviewId();

  if (productId) {
      const product = productsDataModel.getProductById(productId);
      const isProductInCart = cartDataModel.isProductInCart(productId);
      const productView = new ProductView(
          cloneTemplate(productDetailsTemplate),
          events,
          {
              onActionButtonClick: () => {
                  if (isProductInCart) {
                      cartDataModel.deleteCartItem(productId);
                  } else {
                      cartDataModel.addCartItem(product);
                  }

                  productsDataModel.setPreviewId(null);
                  modalView.close();
              },
          },
      );

      productView.setPrice(product.price);
      productView.setActionButtonTextContent(isProductInCart ? 'Из корзины' : 'В корзину');
      productView.setCategory(product.category);
      productView.setTitle(product.title);
      productView.setDescription(product.description);
      productView.setImageComponentContent(product.image);

      modalView.setContent(productView.render());
      modalView.open();
  }
});

// блок/разблок основного интерфейса при открытии/закрытии модалки
events.on('modal:open', () => {
  mainPageView.toggleLocked(true);
});

events.on('modal:close', () => {
  mainPageView.toggleLocked(false);
});

// при изменении содержимого корзины
events.on('cart:changed', () => {
  mainPageView.setCartCounter(cartDataModel.getCartItemsCount());
  cartView.setTotalPrice(cartDataModel.getTotalCost());
  cartView.disableMakeOrderButtonState(cartDataModel.isZeroTotalCost());
  cartView.setCartItems(cartDataModel.getCartItems().map((p, i) => {
      const productView = new ProductView(
          cloneTemplate(productCartTemplate),
          events,
          {
              onActionButtonClick: () => {
                  cartDataModel.deleteCartItem(p.id);
              },
          },
      );

      productView.setIndex(i + 1);
      productView.setTitle(p.title);
      productView.setPrice(p.price);

      return productView.render()
  }));
});

// при клике на иконку корзины
events.on('cart:open', () => {
  cartView.disableMakeOrderButtonState(cartDataModel.isZeroTotalCost());
  modalView.setContent(cartView.render());
  modalView.open();
});

// при клике на кнопку оформления заказа из корзины
events.on('orderFormAddress:open', () => {
  modalView.close();

  formDataModel.setTotalCost(cartDataModel.getTotalCost());
  formDataModel.setProductsIds(cartDataModel.getCartItemsIds());

  modalView.setContent(orderFormAddressView.render());
  modalView.open();
});

// при клике на кнопку "Далее" на первом шаге формы заказа
events.on('orderFormContacts:open', () => {
  modalView.close();
  modalView.setContent(orderFormContactView.render());
  modalView.open();
});

// при изменении полей форм
events.on<{
  formStep: 'address' | 'contacts',
  name: string,
  value: string | null,
}>('orderForm:input', ({ formStep, name, value }) => {
  switch (name) {
      case 'address':
          formDataModel.setAddressValue(value);
          break;
      case 'payment':
          formDataModel.setPaymentValue(value as IOrder['payment']);
          break;
      case 'email':
          formDataModel.setEmailValue(value);
          break;
      case 'phone':
          formDataModel.setPhoneValue(value);
          break;
      default:
          // no default
  }

  formDataModel.validateFormFields();

  const allErrors = formDataModel.getErrors();
  const keysForStep = formStep === 'address' ? ['payment', 'address'] : ['email', 'phone'];
  const errorsForStep = Object.entries(allErrors).reduce((acc, item) => {
      const [key, value] = item;

      if (keysForStep.includes(key) && value) {
          acc.push(value);
      }

      return acc;
  }, []);

  if (formStep === 'address') {
      if (errorsForStep.length) {
          orderFormAddressView.setErrors(errorsForStep.join(', '));
          orderFormAddressView.disableNextButton(true);
      } else {
          orderFormAddressView.setErrors('');
          orderFormAddressView.disableNextButton(false);
      }
  } else {
      if (errorsForStep.length) {
          orderFormContactView.setErrors(errorsForStep.join(', '));
          orderFormContactView.disableNextButton(true);
      } else {
          orderFormContactView.setErrors('');
          orderFormContactView.disableNextButton(false);
      }
  }
});

// при клике на кнопку "Оплатить" на втором шаге формы заказа
events.on('orderForm:submit', () => {
  const orderData = formDataModel.getOrderData();

  // чтобы не нажать несколько раз "Оплатить" во время выполнения запроса
  orderFormContactView.disableNextButton(true);

  larekApi.makeOrder(orderData as IOrder)
      .then(({total}) => {
          orderFormContactView.disableNextButton(false);
          modalView.close();

          orderSuccessView.setTotalPrice(total);

          cartDataModel.clearCart();
          formDataModel.clearOrderData();

          modalView.setContent(orderSuccessView.render());
          modalView.open();
      })
      .catch(e => {
          orderFormContactView.disableNextButton(false);
          console.error(e);
      });
});

// при клике на кнопку "За новыми покупками!"
events.on('orderFormSuccess:goShopping', () => {
  modalView.close();
});

// при открытии приложения инициируем подгрузку продуктов
larekApi.getProductsInfo()
    .then(({items}) => {
        productsDataModel.setProducts(items);
    })
    .catch(e => {
        console.error(e);
    });
