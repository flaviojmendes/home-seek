import {DaftHome, DaftHomes} from "../model/daft-home.model";
import chalk from "chalk";
var blessed = require('blessed')
var contrib = require('blessed-contrib')
const openurl = require('openurl');

export class Dashboard {

  screen = blessed.screen()
  grid = new contrib.grid({rows:12, cols: 12, screen: this.screen})
  table:any = this.grid.set(0, 0, 6, 12, blessed.ListTable, this.createListTable("left", 0, true));
  markdownSummary = this.grid.set(6,3,3,9, blessed.text, {style: {border: {fg: '#6c97f5'}}})
  markdownLastUpdate = this.grid.set(6, 0, 3, 3, blessed.text, {style: {border: {fg: '#6c97f5'}}})
  markdownLatest = this.grid.set(9, 0, 3, 9, blessed.text,{style: {border: {fg: '#6c97f5'}}})
  donutNextUpdate = this.grid.set(9,9,3,3, contrib.donut,{
    label: 'Refresh Rate',
    radius: 12,
    arcWidth: 4,
    remainColor: 'black',
    yPadding: 0,
    style: {border: {fg: '#6c97f5'}}

  })
  homes:DaftHome[] = []

  constructor() {
    // Open article
    this.screen.key(["enter"], () => {
      let itemToShow = this.table.selected == 1 ? 0 : this.table.selected - 1;
      let selected = this.homes[itemToShow];
      openurl.open(selected.url)
    });

  }

  render(daftHomes: DaftHomes) {
    let screen = this.screen;
    let table = this.table;
    //allow control the table with the keyboard
    table.focus()

    this.homes = daftHomes.homes;

    this.generateTable()



    // Summary
    let markdownSummary = this.markdownSummary
    markdownSummary.setContent(chalk.rgb(245, 243, 108).bold('Description \n ') + chalk.rgb(66, 164, 245)(daftHomes.description))

    // Last Update
    let markdownLastUpdate = this.markdownLastUpdate;
    markdownLastUpdate.setContent(chalk.bold.yellow('Last Update \n ')
      + chalk.rgb(66, 164, 245).bold(new Date().toLocaleString()) + '\n\n'
      + chalk.bold.rgb(245, 243, 108)('Total Found \n ')
      + chalk.rgb(66, 164, 245).bold(this.homes.length + ''));

  // Latest Found
    let markdownLatest = this.markdownLatest;
    let latest = this.homes[0];
    markdownLatest.setContent(chalk.rgb(245, 243, 108).bold('Latest Found \n ')
      + chalk.rgb(66, 129, 245).bold(latest.price) + ' - ' + chalk.rgb(66, 164, 245)(latest.title)  + '\n '
     + chalk.rgb(66, 245, 158)(latest.url))


    let donutNextUpdate = this.donutNextUpdate;

    screen.key(['escape', 'q', 'C-c'], function(ch:any, key:any) {
      return process.exit(0);
    });



    screen.key(["up"], () => {
      let itemToShow = table.selected == 1 ? 0 : table.selected - 2;
      let selected = this.homes[itemToShow];
      markdownLatest.setContent(chalk.rgb(245, 243, 108).bold('Selected Home\n ')
        + chalk.rgb(66, 129, 245).bold(selected.price) + ' - ' + chalk.rgb(66, 164, 245)(selected.title)  + '\n '
        + chalk.rgb(66, 245, 158)(selected.url))

      screen.render();
    });

    screen.key(["down"], () => {
      let itemToShow = table.selected == this.homes.length ? this.homes.length - 1 : table.selected;
      let selected = this.homes[itemToShow];
      markdownLatest.setContent(chalk.rgb(245, 243, 108).bold('Selected Home\n ')
        + chalk.rgb(66, 129, 245).bold(selected.price) + ' - ' + chalk.rgb(66, 164, 245)(selected.title)  + '\n '
        + chalk.rgb(66, 245, 158)(selected.url))
      screen.render();
    });

    screen.on('resize', function() {
      table.emit('attach');
      markdownLatest.emit('attach');
      markdownSummary.emit('attach');
      donutNextUpdate.emit('attach');

    });

    screen.render()
  }



  createListTable(alignment:string, padding:number = 0, isInteractive:boolean = false) {
    return {
      keys: true,
      align: alignment,
      selectedFg: "white",
      selectedBg: "blue",
      interactive: isInteractive, // Makes the list table scrollable
      padding: padding,
      style: {
          fg: 'white',
        border: {
          fg: '#6c97f5'
        },
        cell: {
          selected: {
            fg: "black",
            bg: "#f5f26c"
          }
        },
        header: {
          fg: "#f5f26c",
          bold: true
        }
      },
      columnSpacing: 1
    };
  }


  /**
   * Populates the Results Table
   * @param homes
   */
  generateTable() {
    var data:any = [['Title', 'Price', 'URL']]

    this.homes.forEach(home => {
      var row = []
      row.push(home.title.substr(0,79))
      row.push(home.price)
      row.push(home.url)
      data.push(row)
    })

    this.table.setData(data)
  }

  updateDonut(time: number, percent: number) {
    const label = 'Next update in ' + time + 's';
    this.donutNextUpdate.setData([
      {percent: percent, label: label, color: 'yellow'}
    ])
    this.screen.render();
  }

}
