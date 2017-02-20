/*
    Simplified example of a burger restaurant based on
    semaphors for state management
*/

var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var kitchenCounter = new EventEmitter(); // simplified streaming api kitchen to service
var serviceCounter = new EventEmitter();  // simplified streaming api push service to customer

var customers = { };

// CUSTOMER SERVICE AGENT

var serviceIsBusy = false

app.post('/orders', function(req, res, next) {
	var cid = req.body.cid,
	order = req.body.order;

    if (serviceIsBusy) {
        return res.status(500).send('I will be with you in a moment');
    }

    var total = orders.map(function(order) { return order.priceEuro; })
										.reduce(function(a, b) { return a + b; }, 0);
	customers[cid] = {
		total: total
	};
    kitchenCounter.emit('incomingOrder', cid, orders);
	return res.status(200).send("Please pay total now " + total);
});

app.post('/orders/:cid/payments', function(req, res) {
	var cid = req.params.cid;
    var money = req.body.money;

    if (serviceIsBusy) {
        return res.status(500).send('I will be with you in a moment');
    }

    if (money >= customer[cid].total) {
        return res.status(200).send('Have a nice day');
    } else {
        return res.status(500).send('I will have to call the cops');
    }
});

kitchenCounter.on('orderDone', function(cid, orders) {
    if (serviceIsBusy) {
        setTimeout(function(){
            kitchenCounter.emit('orderDone', cid, orders);
        }, 5000)
    } else {
        serviceIsBusy = true
        setTimeout(function() {
            serviceIsBusy = false
            serviceCounter.emit('Your food is ready', cid);
        }, 10000);
    }
});


// KITCHEN AGENT

kitchenCounter.on('incomingOrder', function(cid, orders) {
	var timeout = Math.floor(Math.random() * (500 - 20 + 1)) + 20;

	setTimeout(function() {
		kitchenCounter.emit('orderDone', cid, orders);
	}, timeout);
});


app.listen(3000, function () {
 	  console.log('Burgerwings listening on port 3000!');
});
