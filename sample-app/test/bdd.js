'use strict';
const {expect} = require('chai');
const createTabAggregate = require('../cafe/tab_aggregate')

function given(...givenEvents) {
    const tabAgg = createTabAggregate();
    givenEvents.forEach(tabAgg.apply);
    return {
        when: function(command) {
            const events = tabAgg[command.type](command);
            return {
                then: function(...expectedEvents) {
                    expect(events).to.eql(expectedEvents);
                }
            };
        }
    };
}

function when(command) {

}

module.exports = {given};
