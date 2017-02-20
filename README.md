# Burger wings

## What is it?

A collection of example apps to illustrate different approaches to handle states and events in node.js. The focus is on finite state machines.

## How to run it

1. (obviously) have a more or less current version node in your path. (We used docker with ```docker run -it --rm -p 8080:8080 --volume "$(pwd)":/src node:latest bash```)
2. install dependencies via npm ```npm install```
3. start app by running ```node ./app_statemachine_simplified.js```

## How to try it

You can play the customer by sending http posts to */customers* and */:customer_id/payments* to your localhost on port 8080

* `curl curl -X POST -H "Content-Type: application/json" -d '{"cid":"c1","order":["coke","fries"]}' localhost:8080/orders`
* `curl -X POST -H "Content-Type: application/json" -d '{"money":2}' localhost:8080/orders/c1/payments
`
* `curl -X POST -H "Content-Type: application/json" -d '{"money":2}' localhost:8080/orders/cunknown/payments`
* `curl -X POST -H "Content-Type: application/json" -d '{"cid":"c2","order":["milkshake","onion rings"]}' localhost:8080/orders`
* `curl -X POST -H "Content-Type: application/json" -d '{"money":0}' localhost:8080/orders/c2/payments`


## Further reading

* [Introduction to finite state machines and Node.js](http://www.robert-drummond.com/2015/04/21/event-driven-programming-finite-state-machines-and-nodejs/)
* [Good read about why developers still shy away from finite state machines] (http://www.skorks.com/2011/09/why-developers-never-use-state-machines/)
* Popular node.js finite state machine frameworks
 * [machina](https://www.npmjs.com/package/machina)
 * [stately.js](https://www.npmjs.com/package/stately.js)
 * [state.js](https://www.npmjs.com/package/state.js)
 * [fsm](https://www.npmjs.com/package/fsm)
* [Example for using fsm in connection management] (http://code.dougneiner.com/presentations/machina/#session/1/slide/36)
* [Overview of different realtime APIs] (http://blog.fanout.io/2015/04/02/realtime-api-design-guide/)
