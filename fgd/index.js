let fs = require('fs')

// ugliest parser i've written so far
function main (path, include) {
  let trm = x => x.trim().startsWith('"') && x.trim().endsWith('"') ? x.trim().substring(1, x.trim().length - 1) : x.trim()
  let file = fs.readFileSync(path, { encoding: 'utf-8' })
  let lines = file.split('\r\n').map(x => {
    if (x.indexOf('//') >= 0) x = x.substr(0, x.indexOf('//'))
    return x.replace(/\t/g, ' ')
  }).filter(x => x.trim() !== '')
  let items = []
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (line.startsWith('@include')) {
      let fgd = line.split(' ')[1]
      if (fgd) lines.splice(i, 1, ...main(path + '/../' + trm(fgd), true))
    } else if (!include) {
      if (line.startsWith('@')) {
        let attribs = []
        let type = line.match(/@\w+/)[0].substr(1)
        let parts = line.substr(type.length + 1).split('=').map(x => x.trim())
        let name = parts[1]
        let desc
        if (name && name.indexOf(':') >= 0) {
          let pointer = name.indexOf(':')
          desc = name.substr(pointer)
          if (desc) {
            if (desc.trim() === ':' && lines[i + 1].trim().startsWith('"')) desc = lines[++i].trim()
            else desc = desc.substr(1).trim()
            while (lines[i].trim().endsWith('+')) desc += lines[++i].trim()
            desc = trm(desc).replace(/" \+"/g, '')
          }
          name = name.substr(0, pointer).trim()
        }
        if (desc) desc = trm(desc.replace('[]', '').replace(/" ?\+ ?"/g, ''))
        if (name) name = trm(name.replace('[]', ''))
        parts = parts[0].match(/(\w+)|\(.*?\)/g) || []
        if (parts.includes('halfgridsnap')) parts.splice(parts.findIndex(x => x === 'halfgridsnap') + 1, 0, '()')
        parts.forEach((part, index, array) => {
          if (index % 2 === 0) {
            if (!array[index + 1]) array[index + 1] = ''
            let parts = array[index + 1].substring(1, array[index + 1].length - 1).split(/,\s+|,/)
            let values = []
            parts.forEach((x, i) => {
              if (x.indexOf(' ') >= 0) values.push(...x.split(' '))
              else values.push(x)
            })
            let numform = x => x && !isNaN(x) ? Number(x) : x
            attribs.push({
              name: part,
              values: values.map(x => numform(trm(x))).filter(x => x !== '')
            })
          }
        })
        if (!attribs.length) attribs = undefined
        while (items.some(x => x.name === name)) items.splice(items.findIndex(x => x.name === name), 1)
        items.push({ name: name, type: type, description: desc, parameters: attribs })
      } else if (!(line.startsWith('[') || line.startsWith(']'))) {
        let stack = line
        while (lines[i].endsWith('+')) stack += lines[++i].trim()
        let def = stack.match(/(?:[^:"]+|"[^"]*")+/g)[2] || ''
        stack = stack.match(/(?:[^:"]+|"[^"]*")+/g).map(x => trm(x))
        let match = stack[0].match(/(\w+)\((.*?)\)/) || []
        let numform = x => x && !isNaN(x) && !def.trim().startsWith('"') ? Number(x) : x
        let choices = {}
        let one = line.match(/ ?= ?\[(.*)\]/)
        if (one) one = one[1]
        if (one || (stack[stack.length - 1] && stack[stack.length - 1].endsWith('='))) {
          while (true) {
            if (!one && lines[++i].trim() === ']') break
            if (lines[i].trim() === '[') continue
            let parts = one || lines[i]
            parts = parts.match(/(?:[^:"]+|"[^"]*")+/g).map(x => trm(x))
            if (one || stack[stack.length - 1].startsWith('spawnflags')) {
              if (choices.constructor !== Array) choices = []
              choices.push({
                title: parts[1],
                value: numform(parts[0]),
                enabled: !!Number(parts[2])
              })
            } else choices[parts[0]] = parts[1]
            if (one) break
          }
        } else choices = undefined
        let desc = x => stack[x] ? trm(stack[x].replace(/" ?\+ ?"| =$/gm, '')) : stack[3] === '' ? '' : undefined
        if (stack[0].startsWith('input ')) {
          if (!items[items.length - 1].inputs) items[items.length - 1].inputs = []
          items[items.length - 1].inputs.push({ name: match[1], description: desc(1), type: match[2].trim() })
        } else if (stack[0].startsWith('output ')) {
          if (!items[items.length - 1].outputs) items[items.length - 1].outputs = []
          items[items.length - 1].outputs.push({ name: match[1], description: desc(1), type: match[2] })
        } else if (match[1] === 'spawnflags') {
          items[items.length - 1].flags = choices && choices.constructor === Array ? choices : []
        } else {
          if (!items[items.length - 1].properties) items[items.length - 1].properties = []
          if (stack[2] && stack[2].endsWith('=')) stack[2] = trm(stack[2].substr(0, stack[2].length - 1))
          if (match.length && stack.length) {
            items[items.length - 1].properties.push({
              type: match[2] ? match[2].toLowerCase() : match[2],
              name: match[1],
              title: stack[1],
              description: desc(3),
              deflt: def.trim() === '""' ? '' : numform(stack[2]) === 0 ? 0 : numform(stack[2]) || undefined,
              choices: choices
            })
          }
        }
      }
    }
  }
  if (include) return lines
  items = items.filter(x => !['mapsize', 'AutoVisGroup', 'MaterialExclusion'].includes(x.type))
  return items
}

module.exports = main
