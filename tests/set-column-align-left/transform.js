module.exports = function(plugin, state) {
    return plugin.changes.setColumnAlign(state.change(), 'left', 0).apply();
};
