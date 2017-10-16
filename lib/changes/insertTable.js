const createTable = require('../createTable');

/**
 * Insert a new table
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} columns
 * @param {Number} rows
 * @return {Slate.Transform}
 */
function insertTable(opts, change, columns = 2, rows = 2) {
    const { state } = change;

    if (!state.selection.startKey) return change;

    // Create the table node
    const fillWithEmptyText = (x, y) => '';
    const table = createTable(opts, columns, rows, fillWithEmptyText);

    return change.insertBlock(table);
}

module.exports = insertTable;
