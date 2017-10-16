
module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();

    state = change.moveToRangeOf(cursorBlock);

    state = plugin.changes.removeColumn(state.change());

    state = state.change().undo();

    return state;
};
