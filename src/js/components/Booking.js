import { select, templates, settings } from '../settings.js';
import utils from '../utils.js'
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor (element){
    const thisBooking = this;


    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const params = {
      booking: [
        settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.dom.dateWrapper.minDate),
        settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dom.dateWrapper.maxDate)
      ],
      eventsCurrent: [

      ],
      eventsRepeat: [

      ],
    }
    console.log('getData params', params);
    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking + '?'
                                     + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event   + '?'
                                     + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event   + '?'
                                     + params.eventsRepeat.join('&'),
    };
  }

  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.dateWrapper = document.querySelector(select.datePicker.wrapper);
    thisBooking.dom.hourWrapper = document.querySelector(select.hourPicker.wrapper);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );

    thisBooking.dom.peopleAmount.addEventListener('click', function(){

    });

    thisBooking.dom.hoursWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );

    thisBooking.dom.hoursAmount.addEventListener('click', function(){

    });

    thisBooking.dom.dateWrapperWidget = new DatePicker(
      thisBooking.dom.dateWrapper
    );

    thisBooking.dom.dateWrapper.addEventListener('click', function(){

    });

    thisBooking.dom.hourWrapperWidget = new HourPicker(
      thisBooking.dom.hourWrapper
    );

    thisBooking.dom.hourWrapper.addEventListener('click', function(){

    });
  }
}

export default Booking;
