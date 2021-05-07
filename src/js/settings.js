export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product', // CODE ADDED
    bookingWidget: '#template-booking-widget',
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',
    booking: '.booking-wrapper',
    home: '.home-page'
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount', // CODE CHANGED
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
  },
  // CODE ADDED START
  datePicker: {
    wrapper: '.date-picker',
    input: `input[name="date"]`,
  },
  hourPicker: {
    wrapper: '.hour-picker',
    input: 'input[type="range"]',
    output: '.output',
  },
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice:
      '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tableDiv: '.floor-plan',
    tables: '.floor-plan .table',
    tableActive: '.table.selected',
    phone: '[name="phone"]',
    address: '[name="address"]',
    starters: '[name="starter"]',
    form: '.booking-form'
  },
  nav: {
    links: '.main-nav a, .panel a',
  },
  // CODE ADDED END
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  booking: {
    loading: 'loading',
    table: 'table',
    tableBooked: 'booked',
    tableOpen: 'selected',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  },
  // CODE ADDED END
};

export const settings = {
  hours: {
    open: 12,
    close: 24,
  },
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  }, // CODE CHANGED
  datePicker: {
    maxDaysInFuture: 14,
  },
  // CODE ADDED START
  cart: {
    defaultDeliveryFee: 20,
  },
  bookingTable: {                      // ZMIENILEM NAZWE Z BOOKING NA BOOKINGTABLE BO ESLINT NIE POZWALA NA TAKIE SAMO NAZEWNICTWO
    tableIdAttribute: 'data-table',
  },
  // CODE ADDED END
  db: {
    url: '//localhost:3131',
    product: 'product',
    order: 'order',
    booking: 'booking',
    event: 'event',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },
};

export const templates = {
  menuProduct: Handlebars.compile(
    document.querySelector(select.templateOf.menuProduct).innerHTML
  ),
  // CODE ADDED START
  cartProduct: Handlebars.compile(
    document.querySelector(select.templateOf.cartProduct).innerHTML
  ),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
  // CODE ADDED END
};
