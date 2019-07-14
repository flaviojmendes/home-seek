import {DaftHome} from "../model/daft-home.model";
var blessed = require('blessed')
var contrib = require('blessed-contrib')
const open = require('open');

export class Dashboard {

  screen = blessed.screen()
  grid = new contrib.grid({rows:12, cols: 12, screen: this.screen})
  table:any = this.grid.set(0, 0, 6, 12, blessed.ListTable, this.createListTable("left", 0, true));
  markdownLatest = this.grid.set(6, 3, 3, 9, contrib.markdown)
  markdownSummary = this.grid.set(6,0,3,3, contrib.markdown)

  render(homes: DaftHome[]) {
    let screen = this.screen;
    let table = this.table;
    //allow control the table with the keyboard
    table.focus()
    this.generateTable(homes,table)



    // Summary
    let markdownSummary = this.markdownSummary
    markdownSummary.setMarkdown('# Last Update \n '+ new Date().toLocaleString()
     + '\n\n# Total Found \n ' + homes.length)

    // Latest Found
    let markdownLatest = this.markdownLatest;
    let latest = homes[0];
    markdownLatest.setMarkdown('# Latest Found \n '
      + '`' +  latest.price+ '`' + ' - ' + latest.title  + '\n '
     + latest.url)


    screen.key(['escape', 'q', 'C-c'], function(ch:any, key:any) {
      return process.exit(0);
    });

    // Open article
    screen.key(["enter"], () => {
      let selected = homes[table.selected - 1];
      markdownLatest.setMarkdown('# Latest Found \n '
        + '`' +  selected.price+ '`' + ' - ' + selected.title  + '\n '
        + selected.url)
      screen.render();
      open(selected.url);
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

}
