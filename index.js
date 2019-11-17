let fs = require('fs')
let fgd = require('./fgd/')

let items = fgd('files/tf-puddy.fgd')

// Apply base to all items and then remove base classes
let applyBase = item => {
  let match = item.parameters && item.parameters.find(x => x.name === 'base')
  if (match) {
    match.values.forEach(value => {
      let base = items.find(x => x.name === value)
      if (base.parameters && base.parameters.find(x => x.name === 'base')) base = applyBase(base)
      let props = ['properties', 'flags', 'outputs', 'inputs']
      props.forEach(prop => {
        if (base[prop]) {
          if (!item[prop]) item[prop] = []
          for (let i = 0; i < base[prop].length; i++) {
            if (!item[prop].some(x => x === base[prop][i])) item[prop].push(base[prop][i])
          }
        }
      })
    })
    if (!item.parameters.length) delete item.parameters
  }
  return item
}
items = items.map(x => applyBase(x)).filter(x => x.type !== 'BaseClass').map(x => {
  if (x.parameters) {
    let index = x.parameters.findIndex(x => x.name === 'base')
    if (index !== -1) x.parameters.splice(index, 1)
    if (!x.parameters.length) delete x.parameters
  }
  return x
})

fs.writeFileSync('fgd.json', JSON.stringify(items, null, 2))
