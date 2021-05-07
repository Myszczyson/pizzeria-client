import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor (element){  // need to add another variable to store clicked tables ID
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.tableSelected = null;
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.dateWrapperWidget.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dateWrapperWidget.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam
      ],
    };

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking + '?'
                                     + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event   + '?'
                                     + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event   + '?'
                                     + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([booking, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(booking, eventsCurrent, eventsRepeat);
      });
  }

  parseData(booking, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of booking){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.dateWrapperWidget.minDate;
    const maxDate = thisBooking.dateWrapperWidget.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    // console.log(thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.dateWrapperWidget.value;
    thisBooking.hour = thisBooking.dom.hourInput.value;

    let allAvailable = false;

    const activeTable = thisBooking.dom.allTables.querySelector(select.booking.tableActive);
    if(activeTable) activeTable.classList.remove(classNames.booking.tableOpen);
    thisBooking.tableSelected = null;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.bookingTable.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(element){ // need to add another variable to store clicked tables ID
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.dateWrapper = thisBooking.dom.wrapper.querySelector(select.datePicker.wrapper);
    thisBooking.dom.dateInput = thisBooking.dom.wrapper.querySelector(select.datePicker.input);

    thisBooking.dom.hourWrapper = thisBooking.dom.wrapper.querySelector(select.hourPicker.wrapper);
    thisBooking.dom.hourInput = thisBooking.dom.wrapper.querySelector(select.hourPicker.input);
    thisBooking.dom.hourOutput = thisBooking.dom.wrapper.querySelector(select.hourPicker.output);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.allTables = thisBooking.dom.wrapper.querySelector(select.booking.tableDiv);

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);

    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );

    thisBooking.dom.peopleAmount.addEventListener('click', function(){

    });

    thisBooking.hoursWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );

    thisBooking.dom.hoursAmount.addEventListener('click', function(){

    });

    thisBooking.dateWrapperWidget = new DatePicker(
      thisBooking.dom.dateWrapper
    );

    thisBooking.dom.dateWrapper.addEventListener('click', function(){

    });

    thisBooking.hourWrapperWidget = new HourPicker(
      thisBooking.dom.hourWrapper
    );

    thisBooking.dom.hourWrapper.addEventListener('click', function(){

    });

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    thisBooking.dom.allTables.addEventListener('click', function(event) {
      if(event.target.classList.contains(classNames.booking.table)) {
        thisBooking.handleTable(event.target);
      }
    });

    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  handleTable(table){
    const thisBooking = this;

    if(table.classList.contains(classNames.booking.tableBooked)) {
      alert('This table is already taken');
    } else {

      const activeTable = thisBooking.dom.allTables.querySelector(select.booking.tableActive);
      if(activeTable && activeTable !== table) activeTable.classList.remove(classNames.booking.tableOpen);

      if(table.classList.contains(classNames.booking.tableOpen)) {
        table.classList.remove(classNames.booking.tableOpen);
        thisBooking.tableSelected = null;
      } else {
        table.classList.add(classNames.booking.tableOpen);
        thisBooking.tableSelected = parseInt(table.getAttribute('data-table'));
      }
    }
  }

  sendBooking(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: thisBooking.dom.dateInput.value,
      hour: thisBooking.dom.hourOutput.innerHTML,
      table: thisBooking.tableSelected,
      duration: parseInt(thisBooking.hoursWidget.value),
      ppl: parseInt(thisBooking.peopleWidget.value),
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value
    };



    for (const starter of thisBooking.dom.starters) {
      if(!starter.checked) continue;
      payload.starters.push(starter.value);
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
        console.log(parsedResponse);
        thisBooking.makeBooked(parsedResponse.date, parsedResponse.hour, parsedResponse.duration, parsedResponse.table);
        thisBooking.updateDOM();
      });
  }
}

export default Booking;
