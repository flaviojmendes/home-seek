import {DaftHome, DaftHomes} from "../model/daft-home.model";

const rp = require('request-promise');
const $ = require('cheerio');

export class DaftService {

  BASE_URL = 'https://www.daft.ie';

  description:string = '';

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

    let daftHomes: DaftHomes = {
      description: this.description,
      homes: homes
    }


    return daftHomes
  }

  private async getHomesByOffset(searchUrl: string, offset:number) {
    let homesByOffset: DaftHome[] = [];

    let html;
    try {
      const HTTP_PROXY = process.env.HTTP_PROXY || process.env.http_proxy;
      let proxiedRequest = HTTP_PROXY ?
        rp.defaults({ proxy: HTTP_PROXY, strictSSL: false }) :
        rp.defaults({ strictSSL: false });
      html = await proxiedRequest.get(searchUrl + '&offset=' + offset);

      this.description = offset == 0 ?
        await $('#search_sentence > h1', html).text().trim().replace(/ +(?= )/g, '') :
        this.description;

      // html = await rp(searchUrl + '&offset=' + offset);
    } catch(e) {
      console.log(e);
    }

    let jsonHtml = await $('#sr_content > tbody > tr > td:nth-child(1)', html)

    if(!jsonHtml[0]) return homesByOffset;

    let children = jsonHtml[0].children;

    children.forEach((child: any) => {
      if (child.type === 'tag' && this.isBox(child)) {
        let title = $('div > div.PropertyInformationCommonStyles__addressCopy.calculate-truncation-plugin > a', child).text().trim().replace(/ +(?= )/g, '');
        let url = this.BASE_URL + $('div > div.PropertyInformationCommonStyles__addressCopy.calculate-truncation-plugin > a', child).attr('href');
        let price = $('div > div.PropertyInformationCommonStyles__propertyPrice > a > strong', child).text().trim().split(' ')[0];
        let home: DaftHome = {id: Buffer.from(title).toString('base64'), title: title, price: price, url: url};
        homesByOffset.push(home);
      }
    });

    return homesByOffset;
  }

  isBox(child:any) {
    if(child.attribs && child.attribs.class && child.attribs.class.includes('PropertyCardContainer__container')) {
      return true
    }
  }



}


