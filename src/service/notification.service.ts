import {DaftHomes} from "../model/daft-home.model";
const _ = require('underscore');
const beep = require('beepbeep')
const openurl = require('openurl')

export class NotificationService {


  static notifyNewHome(prev:DaftHomes, current:DaftHomes) {



    if(!_.isEqual(prev, current)) {
      beep(2);
      this.openNewHomes(prev, current);
    }

  }

  static openNewHomes(prev: DaftHomes, current: DaftHomes) {
      current.homes.forEach(homeCur => {
        let hasHome = false;
        prev.homes.forEach(homePrev => {
          if(homePrev.id === homeCur.id) {
            hasHome = true;
            return;
          }


        })

        if(!hasHome) openurl.open(homeCur.url);

      })
  }

}
