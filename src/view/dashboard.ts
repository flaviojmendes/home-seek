import {DaftHome, DaftHomes} from "../model/daft-home.model";
var blessed = require('blessed')
var contrib = require('blessed-contrib')
const openurl = require('openurl');

export class Dashboard {

  screen = blessed.screen()
  grid = new contrib.grid({rows:12, cols: 12, screen: this.screen})
  table:any = this.grid.set(0, 0, 6, 12, blessed.ListTable, this.createListTable("left", 0, true));
  markdownSummary = this.grid.set(6,0,3,12, contrib.markdown)
  markdownLatest = this.grid.set(9, 0, 3, 9, contrib.markdown)
  donutNextUpdate = this.grid.set(9,9,3,3, contrib.donut,{
    label: 'Refresh Rate',
    radius: 12,
    arcWidth: 4,
    remainColor: 'black',
    yPadding: 0

  })



  render(daftHomes: DaftHomes) {
    let screen = this.screen;
    let table = this.table;
    //allow control the table with the keyboard
    table.focus()

    let homes: DaftHome[] = daftHomes.homes;

    this.generateTable(homes,table)



    // Summary
    let markdownSummary = this.markdownSummary
    markdownSummary.setMarkdown('Description \n ' + daftHomes.description + '\n'
      + '# Last Update \n '+ new Date().toLocaleString()
     + '\n\n# Total Found \n ' + homes.length)

    // Latest Found
    let markdownLatest = this.markdownLatest;
    let latest = homes[0];
    markdownLatest.setMarkdown('# Latest Found \n '
      + '`' +  latest.price+ '`' + ' - ' + latest.title  + '\n '
     + latest.url)


    let donutNextUpdate = this.donutNextUpdate;

    screen.key(['escape', 'q', 'C-c'], function(ch:any, key:any) {
      return process.exit(0);
    });

    // Open article
    screen.key(["enter"], () => {
      let itemToShow = table.selected == 1 ? 0 : table.selected - 2;
      let selected = homes[itemToShow];
      openurl.open(selected.url)
    });

    screen.key(["up"], () => {
      let itemToShow = table.selected == 1 ? 0 : table.selected - 2;
      let selected = homes[itemToShow];
      markdownLatest.setMarkdown('# Selected \n '
        + '`' +  selected.price+ '`' + ' - ' + selected.title  + '\n '
        + selected.url)
      screen.render();
    });

    screen.key(["down"], () => {
      let itemToShow = table.selected == homes.length ? homes.length - 1 : table.selected;
      let selected = homes[itemToShow];
      markdownLatest.setMarkdown('# Selected \n '
        + '`' +  selected.price+ '`' + ' - ' + selected.title  + '\n '
        + selected.url)
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
          fg: 'cyan'
        },
        cell: {
          selected: {
            fg: "black",
            bg: "light-yellow"
          }
        },
        header: {
          fg: "red",
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
  generateTable(homes: DaftHome[], table:any) {
    var data:any = [['Title', 'Price', 'URL']]

    homes.forEach(home => {
      var row = []
      row.push(home.title.substr(0,79))
      row.push(home.price)
      row.push(home.url)
      data.push(row)
    })

    table.setData(data)
  }

  updateDonut(time: number, percent: number) {
    const label = 'Next update in ' + time + 's';
    this.donutNextUpdate.setData([
      {percent: percent, label: label, color: 'cyan'}
    ])
    this.screen.render();
  }

}
