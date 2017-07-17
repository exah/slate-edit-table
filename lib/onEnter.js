const insertRow = require('./transforms/insertRow');

/**
 * Insert a new row when pressing "Enter"
 */
function onEnter(event, data, state, opts) {
    if (!opts.onEnterCreateRow) return state;

    event.preventDefault();
    return insertRow(opts, state.transform()).apply();
}

module.exports = onEnter;
