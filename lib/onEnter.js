const insertRow = require('./changes/insertRow');

/**
 * Insert a new row when pressing "Enter"
 */
function onEnter(event, data, state, opts) {
    if (!opts.onEnterCreateRow && opts.typeDefault != null) return;
    if (!opts.onEnterCreateRow) return state;

    event.preventDefault();
    return insertRow(opts, state.change()).apply();
}

module.exports = onEnter;
