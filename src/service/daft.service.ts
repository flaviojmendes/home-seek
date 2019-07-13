import chalk from "chalk";
import ora = require("ora");
import {DaftHome} from "../model/daft-home.model";

const rp = require('request-promise')
const $ = require('cheerio')

export class DaftService {

  BASE_URL = 'https://www.daft.ie'
  async getHomes(searchUrl: string) {

    let homes: DaftHome[] = [];


    let homesByOffset = await this.getHomesByOffset(searchUrl, 0);
    homes = homes.concat(homesByOffset);

    let offset = homes.length;

    while(homesByOffset.length > 0) {
      homesByOffset = await this.getHomesByOffset(searchUrl, offset);
      homes = homes.concat(homesByOffset);
      offset = homes.length;
    }


    return homes
  }

  private async getHomesByOffset(searchUrl: string, offset:number) {
    let homesByOffset: DaftHome[] = [];

    let html = await rp(searchUrl+ '&offset=' + offset)
    let jsonHtml = await $('#sr_content > tbody > tr > td:nth-child(1)', html)

    if(!jsonHtml[0]) return homesByOffset;

    let children = jsonHtml[0].children;

    children.forEach((child: any) => {
      if (child.type === 'tag' && this.isBox(child)) {
        let title = $('div.search_result_title_box > h2 > a', child).text().trim().replace(/ +(?= )/g, '');
        let url = this.BASE_URL + $('div.search_result_title_box > h2 > a', child).attr('href');
        let price = $('div.text-block > div.info-box > strong', child).text().trim().split(' ')[0];
        let home: DaftHome = {title: title, price: price, url: url};
        homesByOffset.push(home);
      }
    });

    return homesByOffset;
  }

  isBox(child:any) {
    if(child.attribs && child.attribs.class && child.attribs.class.includes('box')) {
      return true
    }
  }



}


