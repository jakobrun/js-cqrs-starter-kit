'use strict';
const testId = require('node-uuid').v4();
const chefTodoList = require('../readmodels/chef-todo-list.js');
const {foodOrdered, foodPrepared} = require('../cafe/events');
const expect = require('chai').expect;

function createTestFood1() {
    return {
        menuNumber: 16,
        description: 'Beef Noodles',
        price: 7.5,
        type: 'food'
    };
}

function createTestFood2() {
    return {
        menuNumber: 25,
        description: 'Vegetable Curry',
        price: 6.0,
        type: 'food'
    };
}

describe('chef todo list', function() {
    it('should add ordered food to the todo list', function() {
        const food1 = createTestFood1();
        const todoList = chefTodoList();
        todoList.apply(foodOrdered({
            tabId: testId,
            items: [food1]
        }));
        expect(todoList.list()).to.eql([{
            tabId: testId,
            items: [{
                menuNumber: food1.menuNumber,
                description: food1.description
            }]
        }]);
    });

    it('should remove prepared food', function() {
        const food2 = createTestFood2();
        const todoList = chefTodoList();
        todoList.apply(foodOrdered({
            tabId: testId,
            items: [food2]
        }));
        todoList.apply(foodPrepared({
            tabId: testId,
            menuNumbers: [food2.menuNumber]
        }));
        expect(todoList.list()).to.eql([]);
    });
});
