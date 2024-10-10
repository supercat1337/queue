//@ts-check

//import test from "ava";
import test from "./../node_modules/ava/entrypoints/main.mjs";
import { Queue } from "../src/index.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test("test", async t => {

    var result = 0;
    
    async function task(data) {
        console.log(data);
        result += 1;
        await sleep(1000);
    }
    
    async function init() {
        
        const queue = new Queue();
        const tasks_limit = 3;
    
        queue.on("add", async (data, task_id) => {
            console.log("add", data, task_id);
    
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
            await queue.waitForQueueLimitIsFree(tasks_limit);
        }
    
        await queue.waitForCompleteAll();

    }
    
    await init();    

    if (result !== 10) {
        t.fail(result.toString() + " tasks were not completed");
    } else {
        t.pass(result.toString() + " tasks were not completed");
    }

});