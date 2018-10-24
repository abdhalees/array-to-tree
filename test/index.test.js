const fs = require('fs');
const should = require('chai').should();
const getTree = require('../index');

describe('compare tree with expected outout', () => {
  it('should equal to expected output', () => {
    const input = JSON.parse(fs.readFileSync('./input'));
    const output = JSON.parse(fs.readFileSync('./output'));
    getTree(input).should.eql(output);
  });
});
