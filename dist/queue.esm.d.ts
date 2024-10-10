/**
 * Queue class. This class is used to manage the tasks in the queue.
 * It emits events when tasks are added or removed.
 */
export class Queue {
    /**
     * Subscribe to events on the Queue. This method is a direct passthrough to the EventEmitter's on method.
     * @param {"add"|"remove"} event - name of the event to listen to
     * @param {Function} listener - function that will be called when the event is emitted
     * @returns {Function} unsubscriber function that can be used to unsubscribe from the event
     */
    on(event: "add" | "remove", listener: Function): Function;
    /**
     * Add a task to the queue and return its task ID. This method emits an "add" event with the data and the task ID.
     * @param {...any} data
     * @returns {number} task ID
     */
    add(...data: any[]): number;
    /**
     * Remove a task from the queue by its task ID. This method emits a "remove" event with the task ID.
     * @param {number} task_id
     */
    remove(task_id: number): void;
    /**
     * The number of tasks in the queue
     * @type {number}
     * @readonly
     */
    readonly get size(): number;
    /**
     * Wait until the number of task id's in the queue is less than queue_limit
     * @param {number} queue_limit sets the limit of the number of tasks in the queue
     * @param {number} [wait_time=50] sets the time to wait until the number of tasks in the queue is less than queue_limit
     * @returns {Promise<void>}
     */
    waitForQueueLimitIsFree(queue_limit: number, wait_time?: number): Promise<void>;
    /**
     * Wait until all tasks are completed
     * @returns {Promise<void>}
     */
    waitForCompleteAll(): Promise<void>;
    #private;
}
//# sourceMappingURL=queue.esm.d.ts.map