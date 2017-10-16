module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();

    change.moveToRangeOf(cursorBlock);
    plugin.changes.removeTable(change);
    change.undo();

    return change;
};
