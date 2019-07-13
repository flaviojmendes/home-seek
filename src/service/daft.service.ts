import chalk from "chalk";
import ora = require("ora");

const rp = require('request-promise')
const $ = require('cheerio')

export class DaftService {

  BASE_URL = 'https://www.daft.ie'
  async getHomes(searchUrl: string) {
    const spinner = ora('Loading unicorns').start();

    let html = await rp(searchUrl)
    let jsonHtml = await $('#sr_content > tbody > tr > td:nth-child(1)', html)

    let children = jsonHtml[0].children;

    let totalResults = 0;
    let result = '\n';
    children.forEach((child:any) => {
      if(child.type === 'tag' && this.isBox(child)) {

        let title = $('div.search_result_title_box > h2 > a', child).text().trim();
        let url = this.BASE_URL + $('div.search_result_title_box > h2 > a', child).attr('href');
        let price = $('div.text-block > div.info-box > strong', child).text().trim();
        result = result.concat(chalk.blue.bold(title) + '\n');
        result = result.concat(url + '\n');
        result = result.concat(price + '\n');
        result = result.concat('-------------------------------' + '\n')
        totalResults++;
      }
    });

    result = result.concat(chalk.bgWhite.black('TOTAL RESULTS: ' + totalResults + ' at ' + new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString() + '\n'));
    spinner.stop();
    console.log(result);
    return jsonHtml
  }

  isBox(child:any) {
    if(child.attribs && child.attribs.class && child.attribs.class.includes('box')) {
      return true
    }
  }



}


