'use strict';
const {expect} = require('chai');
const createTabAggregate = require('../cafe/tab_aggregate');

function given(...givenEvents) {
    const tabAgg = createTabAggregate();
    givenEvents.forEach(tabAgg.apply);
    return {
        when: function(command) {
            const res = (function(){
                try {
                    return tabAgg[command.type](command);
                } catch(ex) {
                    return ex.message;
                }
            }());
            return {
                then: function(...expectedEvents) {
                    expect(res).to.eql(expectedEvents);
                },
                thenFailWith: function(errMessage) {
                    expect(res).to.equal(errMessage);
                }
            };
        }
    };
}

module.exports = {given};
