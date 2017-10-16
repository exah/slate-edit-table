const test = require('ava');
const fs = require('fs');
const path = require('path');
const { State } = require('slate');
const readMetadata = require('read-metadata');

const EditList = require('../lib');
const tests = fs.readdirSync(__dirname);
const resolve = (...p) => path.resolve(__dirname, ...p);
const plugin = EditList();

tests.filter(testName => testName !== 'snapshots').forEach((testName) => {
    if (testName[0] === '.' || path.extname(testName).length > 0) return;

    test(testName, (t) => {
        const doc = readMetadata.sync(resolve(testName, 'input.yaml'));
        const runChange = require(resolve(testName, 'transform.js'));

        const state = State.fromJSON(doc);
        const change = runChange(plugin, state);
        const changedDoc = change.state.toJSON();

        t.snapshot(changedDoc);
    });
});
