import {Command, flags} from '@oclif/command'
import {DaftService} from "./service/daft.service";
import {Dashboard} from "./view/dashboard";
import {NotificationService} from "./service/notification.service";
import {DaftHomes} from "./model/daft-home.model";

class HomeSeek extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
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
      console.log('--url should be provided.');
      process.exit(0);
    }

    let daftService = new DaftService();
    const url = flags.url || '';
    const refreshTime = flags.refresh || 1;


    let dashboard = new Dashboard();
    let prevHomes:DaftHomes = {description: 'none', homes: []};
    let homes:DaftHomes = {description: 'none', homes: []};
    while(true) {
      NotificationService.notifyNewHome(homes, prevHomes);
      homes = await daftService.getHomes(url);
      dashboard.render(homes);
      await this.sleep(Number(refreshTime) * 60000);
      prevHomes = homes;
    }

  }

  async sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


export = HomeSeek
