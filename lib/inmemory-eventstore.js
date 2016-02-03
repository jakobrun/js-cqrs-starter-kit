'use strict';

module.exports = function() {
    const events = {};
    return {
        loadEventsFor: function (aggregateId) {
            return new Promise(function(resolve) {
                resolve(events[aggregateId] || []);
            });
        },
        saveEventsFor: function(aggregateId, eventList) {
            return new Promise(function(resolve) {
                if(!events[aggregateId]) {
                    events[aggregateId] = [];
                }
                eventList.map(e => events[aggregateId].push(e));
                resolve();
            });
        }
    };
};
