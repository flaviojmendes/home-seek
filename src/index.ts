import {Command, flags} from '@oclif/command'
import {DaftService} from "./service/daft.service";
import {Dashboard} from "./view/dashboard";
import {NotificationService} from "./service/notification.service";
import {DaftHomes} from "./model/daft-home.model";
import * as fs from "fs";
import chalk from "chalk";

class HomeSeek extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    headless: flags.boolean({char: 's'}),
    // flag with a value (-u, --url=VALUE)
    url: flags.string({char: 'u', description: 'URL to Search'}),
    refresh: flags.string({char: 'r', description: 'Time to refresh the search in minutes'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(HomeSeek)


    if (!flags.url) {
      console.log(chalk.red('In order to run this app the param --url should be declared.'));
      process.exit(0);
    }

    const headless = flags.headless;


    if(headless) console.log(chalk.blue('Running in Headless mode.. \nThis app will automatically open any new home found.'));


    let daftService = new DaftService();
    const url = flags.url || '';
    const refreshTime = flags.refresh || 1;

    const timeInSeconds = Number(refreshTime) * 60;

    let dashboard = !headless ? new Dashboard() : {render: () =>{}, updateDonut: () => {}}

    let prevHomes:DaftHomes = {description: 'none', homes: []};
    let homes:DaftHomes = {description: 'none', homes: []};
    while(true) {
      NotificationService.notifyNewHome(prevHomes, homes);
      homes = await daftService.getHomes(url);

      dashboard.render(homes);

      for(let i=timeInSeconds; i > 0 ; i--) {
        dashboard.updateDonut(i, i/timeInSeconds);
        await this.sleep(1000);
      }

      prevHomes = homes;
    }

  }

  async sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


export = HomeSeek
