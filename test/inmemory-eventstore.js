'use strict';
const eventStore = require('../lib/inmemory-eventstore');
const uuid = require('node-uuid');
const expect = require('chai').expect;

describe('inmemory-eventstore', function() {
    it('should return empty list when there are no events in the store', function() {
        return eventStore().loadEventsFor(uuid.v4()).then(function(res) {
            expect(res.length).to.equal(0);
        });
    });

    it('should add events', function() {
        const store = eventStore();
        const aggregateId = uuid.v4();
        const events = [{
            eventId: uuid.v4(),
            data: 'test1'
        }, {
            eventId: uuid.v4(),
            data: 'test2'
        }];
        return store.saveEventsFor(aggregateId, events).then(function() {
            return store.loadEventsFor(aggregateId);
        }).then(function(res) {
            expect(res).to.eql(events);
        })
    });
});
