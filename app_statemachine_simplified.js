/*
    Simplified example of a burger restaurant based on
    semaphors for state management
*/

var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');
var machina = require('machina');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var kitchenCounter = new EventEmitter();
var serviceCounter = new EventEmitter();

// CUSTOMER SERVICE AGENT

var customers = { };
var fsm = new machina.Fsm({
    namespace: 'Burgerwings',
    initialState: 'idle',
    states: {
        'idle': {
            makeOrder: function (client, orders) {
                this.transition('takingOrder');
                return client;
            },
            _onExit: function () {
                console.log('exiting state: ', this.state);
            },
            _onEnter: function () {
                console.log('entering state: ', this.state);
            }
        },
        'takingOrder': {
            _onEnter: function () {
                console.log('entering state: ', this.state);
                setTimeout(function () {
                    this.handle('orderTaken');
                }.bind(this), 2000);
            },
            orderTaken: 'waitingForCustomerOrKitchen',
            _onExit: function () {
                console.log('exiting state: ', this.state);
            }
        },
        'waitingForCustomerOrKitchen': {
            kitchenDone: 'gettingFoodFirst',
            customerPays: 'receivingPaymentFirst',
            _onExit: function () {
                console.log('exiting state: ', this.state);
            },
            _onEnter: function () {
                console.log('entering state: ', this.state);
            }
        },
        'receivingPaymentFirst': {
            next: 'waitingForFood',
            _onExit: function () {
                console.log('exiting state: ', this.state);
            },
            _onEnter: function () {
                console.log('entering state: ', this.state);
            }
        },
        'gettingFoodFirst': {
            next: 'waitingForPayment',
            _onExit: function () {
                console.log('exiting state: ', this.state);
            },
            _onEnter: function () {
                console.log('entering state: ', this.state);
            }
        },
        'waitingForPayment': {
            next: 'idle',
            _onExit: function () {
                console.log('exiting state: ', this.state);
            },
            _onEnter: function () {
                console.log('entering state: ', this.state);
            }
        },
        'waitingForFood': {
            next: 'idle',
            _onExit: function () {
                console.log('exiting state', this.state);
            },
            _onEnter: function () {
                console.log('entering state: ', this.state);
            }
        }
    },

    makeOrder: function(cid, order) {
        customers[cid] = {
            total: order.map(function(order) {return 1.0; }) // everything is 1$
                        .reduce(function(a, b) { return a + b; }, 0),
            order: order
        };
        return this.handle('makeOrder', customers[cid]);
    },
    kitchenDone: function (cid, order) {
        var result = this.handle('kitchenDone', cid, order);
        setTimeout(function () {
            serviceCounter.emit('Your food is ready', cid);
            this.handle('next');
        }.bind(this), 1000);
        return result;
    },
    customerPays: function (cid, amount) {
        if(!customers.hasOwnProperty(cid)) return null;

        var diff = customers[cid].total - amount;
        setTimeout(function () {
            this.handle('next');
        }.bind(this), 2000);
        this.handle('customerPays', cid, amount);
        return diff;
    }
});

app.post('/orders', function(req, res, next) {
    var cid = req.body.cid,
        order = req.body.order,
        customer = fsm.makeOrder(cid, order);

    if(null == customer) {
        return res.status(503).send('I will be with you in a moment\n');
    }
    kitchenCounter.emit('incomingOrder', cid, order);
    return res.status(200).send('Please pay total of ' + customer.total + '\n');
});

app.post('/orders/:cid/payments', function(req, res) {
    var cid = req.params.cid;
    var money = req.body.money;

    var difference = fsm.customerPays(cid, money);
    if (null == difference) {
        return res.status(500).send('I will be with you in a moment\n');
    }
    if(difference > 0) {
        return res.status(500).send('I will have to call the cops\n');
    }

    return res.status(200).send('Have a nice day\n');
});

kitchenCounter.on('orderDone', function(cid, orders) {
    var result = fsm.kitchenDone(cid, orders);
    if (null == result) {
        setTimeout(function(){
            kitchenCounter.emit('orderDone', cid, orders);
        }, 5000);
    }
});


// KITCHEN AGENT

kitchenCounter.on('incomingOrder', function(cid, orders) {
	var timeout = Math.floor(Math.random() * (500 - 20 + 1)) + 20;

	setTimeout(function() {
		kitchenCounter.emit('orderDone', cid, orders);
	}, timeout);
});


// EXPRESS APP

app.listen(8080, function () {
 	  console.log('Burgerwings listening on port 8080!');
});
