//@ts-check

//import test from "ava";
import test from "./../node_modules/ava/entrypoints/main.mjs";
import { Queue } from "../src/index.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test("add,remove", async t => {

    var result = 0;

    async function task(data) {
        console.log(data);
        result += 1;
        await sleep(1000);
    }

    async function init() {

        const queue = new Queue();
        const tasks_limit = 3;

        queue.on("add", async (task_id, data) => {
            console.log("add", task_id, data);

            await task(data);
            queue.remove(task_id);
        });

        queue.on("remove", (task_id) => {
            console.log("remove", task_id);
        });

        let counter = 0;

        while (counter < 10) {
            counter++;
            queue.add("task " + counter);
            console.log("queue.size is " + queue.size);
            await queue.waitForLessThan(tasks_limit);
        }

        await queue.waitUntilEmpty();

    }

    await init();

    if (result !== 10) {
        t.fail(result.toString() + " tasks were not completed");
    } else {
        t.pass(result.toString() + " tasks were not completed");
    }

});


test("addTaskAndRun", async t => {

    var result = 0;

    /**
     * Simulate a task that takes 1 second to complete.
     * @param {string} data - the task data
     */
    async function task(data) { // define task function
        result += 1;
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
    }

    async function errorTask(data) { 
        throw new Error("task failed");        
    }

    async function init() {

        const queue = new Queue(); // create Queue instance
        const tasks_limit = 3; // set the limit of tasks in the queue

        let counter = 0; // initialize counter

        await queue.waitUntilEmpty(); // test waitUntilEmpty when queue is empty

        while (counter < 10) { // loop until counter is 10
            counter++; // increment counter

            queue.addTaskAndRun(errorTask);

            queue.addTaskAndRun(async () => { // add task to queue and run it
                return task("task " + counter); // run the task
            });

            console.log("queue.size is " + queue.size); // log the size of the queue
            await queue.waitForLessThan(tasks_limit); // wait until the number of tasks in the queue is less than tasks_limit
        }

        await queue.waitUntilEmpty(); // wait until all tasks are completed

    }

    await init();

    if (result !== 10) {
        t.fail(result.toString() + " tasks were not completed");
    } else {
        t.pass(result.toString() + " tasks were not completed");
    }

});