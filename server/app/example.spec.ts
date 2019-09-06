// tslint:disable:no-magic-numbers
// tslint:disable:no-console
import {assert, expect} from 'chai';

describe('A starting set of test examples to showcase test-suite behaviour', () => {
    // Defining some helper functions

    // Return a valid value after 1000ms
    const getDelayedPromise: () => Promise<string> = async (): Promise<string> => {
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve('Hi');
            }, 1000);
        });
    };
    // When called, return a promise that resolves with a number
    function* promiseGenerator(): IterableIterator<Promise<number>> {
        for (; ;) {
            yield new Promise((res) => {
                res(Math.random() * 100);
            });
        }
    }

    context('Using a beforeEach to change a variableNeedingToBeChangedEachRun', () => {
        let variableNeedingToBeChangedEachRun = 0;
        let previousValue = 0;

        beforeEach((d: Mocha.Done) => {
            // Get a promise of a value that will be later resolved
            const promiseOfValue =  promiseGenerator().next();
            // Assign a value to our object
            promiseOfValue.value.then((v) => {
                variableNeedingToBeChangedEachRun = v;
                d();
            });
        });
        // N.B: Probably won't work if tests are shuffled in execution order.
        // AVOID tests that have dependencies on other tests.
        // i.e: each test should contain it's proper setup (or use beforeEach
        // to initialize/reset the state of a variable)
        it('should be a certain value on run #1', () => {
            console.log(variableNeedingToBeChangedEachRun);
            expect(variableNeedingToBeChangedEachRun).to.be.greaterThan(0);
            previousValue = variableNeedingToBeChangedEachRun;
        });
        it('should be a (most probably different) value on run #2', () => {
            console.log(variableNeedingToBeChangedEachRun);
            expect(variableNeedingToBeChangedEachRun).to.be.greaterThan(0).and.not.eq(previousValue);
        });
    });

    it('should complete a 100% sure test with done called', (done) => {
        assert.ok(true);
        done();
    });

    it('should complete an async test by returning a promise and NOT SPECIFYING A DONE FUNCTION', async () => {
        return getDelayedPromise().then((v: string) => {
            expect(v).to.be.of.length.at.least(2, 'message from getPromise should be at least 2 of length');
            expect(v).not.to.be.of.length.at.least(4, 'message from getPromise should have a length smaller than 4');
        });
    });
    context('Tests having a Mocha.Done callback parameter', () => {
        // If a parameter (done) is passed to `it`, we MUST call it and NOT RETURN a Promise
        it('will pass if calling done ', (done: Mocha.Done) => {
            getDelayedPromise().then((v: string) => {
                done();
            });
        });
        it('will fail if calling done AND returning a promise', (done: Mocha.Done) => {
            // Message from mocha:
            // Error: Resolution method is overspecified. Specify a callback *or* return a Promise; not both.
            return getDelayedPromise().then((v: string) => {
                done();
            });
        });
        it('will fail if calling done multiple times', (done: Mocha.Done) => {
            done();
            done();
        });
        it('will fail by timeout if done is never called', (done: Mocha.Done) => {
            getDelayedPromise().finally(() => {
                // Nothing
            });
        });
    });
    context('Tests containing promise rejections', () => {
        it('will fail test when returning a rejected promise', async () => {
            return Promise.reject('Something went wrong');
        });

        it('will pass test if returning a rejected promise that is later catched', async () => {
            return Promise.reject('Something went wrong').catch((reason: string) => {
                // Do nothing in our catch. From the test's point of view, nothing went wrong
            });
        });

        it('will fail test if returning a promise rejected that calls assert.fail', async () => {
            return Promise.reject('Something went wrong').catch((reason: string) => assert.fail(reason));
        });

        it('will pass test if no return value', () => {
            Promise.reject('Simply to test a wrong value');
        });
    });
});
