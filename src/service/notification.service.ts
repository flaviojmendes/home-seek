import {DaftHomes} from "../model/daft-home.model";
const _ = require('underscore');
const beep = require('beepbeep')
const notifier = require('node-notifier');


export class NotificationService {


  static notifyNewHome(prev:DaftHomes, current:DaftHomes) {

    if(!_.isEqual(prev, current)) {
      beep(2);
      notifier.notify({
        title: 'Home Seek',
        message: 'Hey, something changed in your results!'
      });
    }

  }

}
