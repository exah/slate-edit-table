const expect = require('expect');

module.exports = function(plugin, state) {
    const blockStart = state.document.getDescendant('anchor');
    const blockEnd = state.document.getDescendant('anchor');

    const withCursor = state.change()
        .collapseToStartOf(blockStart)
        .extendToEndOf(blockEnd)
        ;

    const result = plugin.onKeyDown(
        {
            preventDefault() {},
            stopPropagation() {}
        },
        { key: 'backspace' },
        withCursor
    );

    expect(result).toBe(undefined);

    return state;
};
