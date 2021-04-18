import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    thisApp.activatePage(thisApp.pages[0].id);

  },

  activatePage: function(pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching*/
    for(let page of thisApp.pages){
      page.classList.toogle(classNames.pages.active, page.id == pageId);
    }

    /* add class "active" to matching links, remove from non-matching*/
    for(let link of thisApp.navLinks){
      link.classList.toogle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.product) {
      new Product(
        thisApp.data.product[productData].id,
        thisApp.data.product[productData]
      );
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
  },

  init: function () {
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        // save parsedResponse as thisApp.data.products
        thisApp.data.product = parsedResponse;
        // execute initMenu method
        thisApp.initMenu();
      });
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },
};

app.init();