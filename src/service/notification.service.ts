import {DaftHomes} from "../model/daft-home.model";
const _ = require('underscore');
const beep = require('beepbeep')
const openurl = require('openurl')
const notifier = require('node-notifier');

export class NotificationService {


  static notifyNewHome(prev:DaftHomes, current:DaftHomes) {

    if(!_.isEqual(prev, current)) {
      notifier.notify(
        {
          title: 'Home Seek',
          message: 'There is a new home!!!',
          sound: true,
          wait: true
        },
        function(err:any, response:any) {
          beep(2);
        }
      );
      this.openNewHomes(prev, current);
      return true;
    }

    return false;

  }

  static openNewHomes(prev: DaftHomes, current: DaftHomes) {
      current.homes.forEach(homeCur => {
        let hasHome = false;
        prev.homes.forEach(homePrev => {
          if(homePrev.id === homeCur.id) {
            hasHome = true;
          }
        });

        if(!hasHome) openurl.open(homeCur.url);

      })
  }

}
