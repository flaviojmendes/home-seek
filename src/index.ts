import {Command, flags} from '@oclif/command'
import {DaftService} from "./service/daft.service";
import {Dashboard} from "./view/dashboard";

class HomeSeek extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-u, --url=VALUE)
    name: flags.string({char: 'u', description: 'URL to Search'}),
    refresh: flags.string({char: 'r', description: 'Time to refresh the search in minutes'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(HomeSeek)
    let daftService = new DaftService();
    const url = flags.name || 'https://www.daft.ie/dublin-city/residential-property-for-rent/blackrock,cabinteely,carpenterstown,carrickmines,churchtown,dalkey,deans-grange,donnybrook,dun-laoghaire,dundrum,foxrock,goatstown,killiney,leopardstown,monkstown,sandycove,sandyford,stepaside,stillorgan/?mxp=2000&mnb=2&mnbt=2&advanced=1&cc_id=ct1&a_id%5B0%5D=188&a_id%5B1%5D=194&a_id%5B2%5D=196&a_id%5B3%5D=197&a_id%5B4%5D=201&a_id%5B5%5D=212&a_id%5B6%5D=214&a_id%5B7%5D=218&a_id%5B8%5D=222&a_id%5B9%5D=224&a_id%5B10%5D=231&a_id%5B11%5D=236&a_id%5B12%5D=249&a_id%5B13%5D=258&a_id%5B14%5D=265&a_id%5B15%5D=287&a_id%5B16%5D=288&a_id%5B17%5D=292&a_id%5B18%5D=293&ignored_agents%5B0%5D=1551&s%5Bmxp%5D=2000&s%5Bmnb%5D=2&s%5Bmnbt%5D=2&s%5Badvanced%5D=1&s%5Bignored_agents%5D%5B0%5D=1551&s%5Bsort_by%5D=date&s%5Bsort_type%5D=d&searchSource=rental'
    const refreshTime = flags.refresh || 1


    let dashboard = new Dashboard();

    while(true) {
      let homes = await daftService.getHomes(url);
      dashboard.render(homes)
      await this.sleep(Number(refreshTime) * 60000)
    }

  }

  async sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


export = HomeSeek
