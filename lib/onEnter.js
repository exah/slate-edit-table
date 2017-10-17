const insertRow = require('./changes/insertRow')

/**
 * Insert a new row when pressing "Enter"
 */
function onEnter (event, data, change, opts) {
  if (!opts.onEnterCreateRow && opts.typeDefault != null) return
  if (!opts.onEnterCreateRow) return change

  event.preventDefault()
  return insertRow(opts, change.state.change())
}

module.exports = onEnter
