let fs = require('fs')
let fgd = require('./fgd/')

let items = fgd('files/tf.fgd')

// Apply base to all items and then remove base classes
for (let i = 0; i < items.length; i++) {
  let item = items[i]
  if (item.parameters) {
    let match = item.parameters.find(x => x.name === 'base')
    if (match) {
      match.values.forEach(value => {
        let base = items.find(x => x.name === value)
        let props = ['properties', 'flags', 'outputs', 'inputs']
        for (let j = 0; j < props.length; j++) {
          let prop = props[j]
          if (base[prop]) {
            if (!item[prop]) item[prop] = []
            for (let k = 0; k < base[prop].length; k++) {
              if (!item[prop].some(x => x === base[prop][k])) item[prop].push(base[prop][k])
            }
          }
        }
      })
      item.parameters.splice(item.parameters.findIndex(x => x.name === 'base'), 1)
      if (!item.parameters.length) delete item.parameters
    }
  }
}

items = items.filter(x => x.type !== 'BaseClass')

fs.writeFileSync('fgd.json', JSON.stringify(items, null, 2))
