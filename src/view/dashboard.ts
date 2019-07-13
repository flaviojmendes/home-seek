import {DaftHome} from "../model/daft-home.model";

const HOME_TABLE_OPTS = { keys: true
  , fg: 'white'
  , selectedFg: 'white'
  , selectedBg: 'blue'
  , interactive: true
  , label: 'Homes Found'
  , height: "50%"
  , width: "100%"
  , border: {type: "line", fg: "cyan"}
  , columnSpacing: 10 //in chars
  , columnWidth: [80, 7, 100] /*in chars*/
  }

export class Dashboard {


  render(homes: DaftHome[]) {
    var blessed = require('blessed')
      , contrib = require('blessed-contrib')
      , screen = blessed.screen()
      , grid = new contrib.grid({rows:12, cols: 12, screen: screen})


    let table = grid.set(0, 0, 6, 12, contrib.table, HOME_TABLE_OPTS);
    //allow control the table with the keyboard
    table.focus()
    this.generateTable(homes,table)


    // Summary
    let markdownSummary = grid.set(6,0,3,3, contrib.markdown)
    markdownSummary.setMarkdown('# Last Update \n '+ new Date().toLocaleString()
     + '\n\n# Total Found \n ' + homes.length)

    // Latest Found
    let markdownLatest = grid.set(6, 3, 3, 9, contrib.markdown)
    let latest = homes[0];
    markdownLatest.setMarkdown('# Latest Found \n '
      + '`' +  latest.price+ '`' + ' - ' + latest.title  + '\n '
     + latest.url)


    screen.key(['escape', 'q', 'C-c'], function(ch:any, key:any) {
      return process.exit(0);
    });

    screen.on('resize', function() {
      table.emit('attach');
      markdownLatest.emit('attach');
      markdownSummary.emit('attach');

    });

    screen.render()
  }

  /**
   * Populates the Results Table
   * @param homes
   */
  generateTable(homes: DaftHome[], table:any) {
    var data:any = []

    homes.forEach(home => {
      var row = []
      row.push(home.title.substr(0,79))
      row.push(home.price)
      row.push(home.url)
      data.push(row)
    })

    table.setData({headers: ['Title', 'Price', 'URL'], data: data})
  }

}
