import { settings, select, templates, classNames } from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);

    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = element.querySelector(
      select.cart.toggleTrigger
    );

    thisCart.dom.productList = element.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);

    thisCart.dom.subtotalPrice = element.querySelector(
      select.cart.subtotalPrice
    );

    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);

    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);

    thisCart.dom.form = element.querySelector(select.cart.form);

    thisCart.dom.phone = element.querySelector(select.cart.phone);

    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  update() {
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;

    let totalNumber = 0;

    let subtotalPrice = 0;

    for (const product of thisCart.products) {
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }

    if (totalNumber !== 0 || subtotalPrice !== 0) {
      thisCart.totalPrice = subtotalPrice + deliveryFee;

      thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    } else {
      thisCart.totalPrice = 0;

      thisCart.dom.deliveryFee.innerHTML = 0;
    }

    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = totalNumber;

    for (const totalElement of thisCart.dom.totalPrice) {
      totalElement.innerHTML = thisCart.totalPrice;
    }
  }

  remove(cartProduct) {
    const thisCart = this;

    cartProduct.dom.wrapper.remove();

    const cartProductIndex = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(cartProductIndex, 1);

    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address,
      phone: thisCart.dom.phone,
      totalPrice: thisCart.dom.totalPrice,
      subTotalPrice: thisCart.dom.subtotalPrice,
      totalNumber: thisCart.dom.totalNumber,
      deliveryFee: thisCart.dom.deliveryFee,
      products: [],
    };

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;
