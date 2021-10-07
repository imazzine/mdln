/**
 * @fileoverview Monitorable class test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbols, symbolsNS } from "../symbols";
import { errors } from "../errors";
import { logs, logNS } from "./index";
import { message } from "./message";
import construct = symbolsNS.construct;
import destruct = symbolsNS.destruct;

/**
 * Logs buffer class for tests.
 */
class TestBuffer extends logs.Buffer {}

/**
 * UID regexp.
 */
const reUID =
  /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/;

describe("Monitorable class construct", () => {
  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  let thread: null | string;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
  });

  test("instance could be created", () => {
    expect(() => {
      obj = new logs.Monitorable();
    }).not.toThrow();
    expect(logNS.undestructed.has(obj.uid)).toBeTruthy();
    expect(logNS.undestructed.get(obj.uid)).toEqual(obj);
    expect(obj.constructed).toBeTruthy();
    expect(obj.destructed).toBeFalsy();
    expect(obj.uid).toBeDefined();
    expect(reUID.test(obj.uid)).toBeTruthy();
    expect(obj.stack).toBeDefined();
    expect(typeof obj.stack === "string").toBeTruthy();
    expect(obj.stack.length).toBeGreaterThan(0);
    expect(obj.stack.indexOf("Instantiation stack")).toEqual(0);
    expect(obj.logger instanceof logs.Logger).toBeTruthy();
    expect(obj.logger.uid).toEqual(obj.uid);
    expect(obj.logger.level).toEqual(logs.Level.TRACE);
  });

  test("construct thread is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(13);
    iter = set.values();
  });

  test("checkpoint log message (1) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = checkpoint.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(1, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(checkpoint.logger.uid).toEqual(obj.uid);
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual(
      "construct",
    );
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "Monitorable",
    );
  });

  test("_uid changed log message (2) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(2, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_uid");
    expect((changed.message as message.Changed).value).toEqual(obj.uid);
  });

  test("_created changed log message (3) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(3, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_created");
    expect((changed.message as message.Changed).value).toEqual(obj.constructed);
  });

  test("_stack changed log message (4) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(4, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_stack");
    expect((changed.message as message.Changed).value).toEqual(obj.stack);
  });

  test("_logger changed log message (5) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(5, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_logger");
    expect((changed.message as message.Changed).value).toEqual(
      `{logger[${obj.logger.uid}]}`,
    );
  });

  test("_constructed changed log message (6) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(6, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructed",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_constructing changed log message (7) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(7, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructing",
    );
    expect((changed.message as message.Changed).value).toEqual(true);
  });

  test("_destructing changed log message (8) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(8, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructing",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_destructed changed log message (9) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(9, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructed",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("undestructed.set called log message (10) is valid", () => {
    // fetch first message
    const called: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(10, called);
    // assert logger
    expect(called.logger instanceof logs.Logger).toBeTruthy();
    expect(called.logger.uid).toEqual(obj.uid);
    expect(called.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(called.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(called.thread).toEqual(thread);
    // assert stack
    expect(called.stack).toBeDefined();
    expect(called.stack).toBeNull();
    // assert type
    expect(called.type).toEqual(logs.Type.called);
    // assert level
    expect(called.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(called.message).toBeDefined();
    expect(called.message instanceof message.Called).toBeTruthy();
    expect((called.message as message.Called).name).toEqual("undestructed");
    expect((called.message as message.Called).type).toEqual("Map");
    expect((called.message as message.Called).method).toEqual("set");
    expect((called.message as message.Called).args).toEqual([
      obj.uid,
      `{${obj.uid}}`,
    ]);
  });

  test("_constructing changed log message (11) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(11, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructing",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_constructed changed log message (12) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(12, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructed",
    );
    expect((changed.message as message.Changed).value).toEqual(true);
  });

  test("object constructed log message (13) is valid", () => {
    // fetch first message
    const constructed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(13, constructed);
    // assert logger
    expect(constructed.logger instanceof logs.Logger).toBeTruthy();
    expect(constructed.logger.uid).toEqual(obj.uid);
    expect(constructed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(constructed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(constructed.thread).toEqual(thread);
    // assert stack
    expect(constructed.stack).toBeDefined();
    expect(constructed.stack).toBeNull();
    // assert type
    expect(constructed.type).toEqual(logs.Type.constructed);
    // assert level
    expect(constructed.level).toEqual(logs.Level.INFO);
    // assert message
    expect(constructed.message).toBeDefined();
    expect(constructed.message instanceof message.Constructed).toBeTruthy();
  });
});

describe("TestMonitorable class construct", () => {
  /**
   * Monitorable child class to test.
   */
  class TestMonitorable extends logs.Monitorable {
    /**
     * Additional property to test logging.
     */
    public testProperty: undefined | string;

    /**
     * @override
     */
    protected [construct]() {
      super[construct]();
      this.logger.trace(logs.getCheckpoint("construct", "TestMonitorable"));

      // init additional property and log this
      this.testProperty = "testProperty value";
      this.logger.debug(
        logs.getChanged("TestMonitorable", "testProperty", this.testProperty),
      );
    }
  }

  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  let thread: null | string;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
  });

  test("instance could be created", () => {
    expect(() => {
      obj = new TestMonitorable();
    }).not.toThrow();
    expect(logNS.undestructed.has(obj.uid)).toBeTruthy();
    expect(logNS.undestructed.get(obj.uid)).toEqual(obj);
    expect(obj.constructed).toBeTruthy();
    expect(obj.destructed).toBeFalsy();
    expect(obj.uid).toBeDefined();
    expect(reUID.test(obj.uid)).toBeTruthy();
    expect(obj.stack).toBeDefined();
    expect(typeof obj.stack === "string").toBeTruthy();
    expect(obj.stack.length).toBeGreaterThan(0);
    expect(obj.stack.indexOf("Instantiation stack")).toEqual(0);
    expect(obj.logger instanceof logs.Logger).toBeTruthy();
    expect(obj.logger.uid).toEqual(obj.uid);
    expect(obj.logger.level).toEqual(logs.Level.TRACE);
  });

  test("construct thread is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(15);
    iter = set.values();
  });

  test("checkpoint log message (1) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = checkpoint.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(1, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(checkpoint.logger.uid).toEqual(obj.uid);
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual(
      "construct",
    );
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "Monitorable",
    );
  });

  test("_uid changed log message (2) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(2, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_uid");
    expect((changed.message as message.Changed).value).toEqual(obj.uid);
  });

  test("_created changed log message (3) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(3, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_created");
    expect((changed.message as message.Changed).value).toEqual(obj.constructed);
  });

  test("_stack changed log message (4) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(4, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_stack");
    expect((changed.message as message.Changed).value).toEqual(obj.stack);
  });

  test("_logger changed log message (5) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(5, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_logger");
    expect((changed.message as message.Changed).value).toEqual(
      `{logger[${obj.logger.uid}]}`,
    );
  });

  test("_constructed changed log message (6) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(6, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructed",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_constructing changed log message (7) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(7, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructing",
    );
    expect((changed.message as message.Changed).value).toEqual(true);
  });

  test("_destructing changed log message (8) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(8, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructing",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_destructed changed log message (9) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(9, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructed",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("undestructed.set called log message (10) is valid", () => {
    // fetch first message
    const called: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(10, called);
    // assert logger
    expect(called.logger instanceof logs.Logger).toBeTruthy();
    expect(called.logger.uid).toEqual(obj.uid);
    expect(called.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(called.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(called.thread).toEqual(thread);
    // assert stack
    expect(called.stack).toBeDefined();
    expect(called.stack).toBeNull();
    // assert type
    expect(called.type).toEqual(logs.Type.called);
    // assert level
    expect(called.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(called.message).toBeDefined();
    expect(called.message instanceof message.Called).toBeTruthy();
    expect((called.message as message.Called).name).toEqual("undestructed");
    expect((called.message as message.Called).type).toEqual("Map");
    expect((called.message as message.Called).method).toEqual("set");
    expect((called.message as message.Called).args).toEqual([
      obj.uid,
      `{${obj.uid}}`,
    ]);
  });

  test("checkpoint log message (11) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = checkpoint.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(11, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(checkpoint.logger.uid).toEqual(obj.uid);
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual(
      "construct",
    );
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "TestMonitorable",
    );
  });

  test("testProperty changed log message (12) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(12, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "TestMonitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "testProperty",
    );
    expect((changed.message as message.Changed).value).toEqual(
      "testProperty value",
    );
  });

  test("_constructing changed log message (13) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(13, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructing",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_constructed changed log message (14) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(14, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructed",
    );
    expect((changed.message as message.Changed).value).toEqual(true);
  });

  test("object constructed log message (15) is valid", () => {
    // fetch first message
    const constructed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(15, constructed);
    // assert logger
    expect(constructed.logger instanceof logs.Logger).toBeTruthy();
    expect(constructed.logger.uid).toEqual(obj.uid);
    expect(constructed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(constructed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(constructed.thread).toEqual(thread);
    // assert stack
    expect(constructed.stack).toBeDefined();
    expect(constructed.stack).toBeNull();
    // assert type
    expect(constructed.type).toEqual(logs.Type.constructed);
    // assert level
    expect(constructed.level).toEqual(logs.Level.INFO);
    // assert message
    expect(constructed.message).toBeDefined();
    expect(constructed.message instanceof message.Constructed).toBeTruthy();
  });
});

describe("WrongMonitorable class construct throw", () => {
  /**
   * Monitorable child class to test.
   */
  class WrongMonitorable extends logs.Monitorable {
    /**
     * Additional property to test logging.
     */
    public testProperty: undefined | string;

    /**
     * @override
     */
    protected [construct]() {
      // super[construct](); <-- no required call to the super class's method
      this.logger.trace(logs.getCheckpoint("construct", "TestMonitorable"));

      // init additional property and log this
      this.testProperty = "testProperty value";
      this.logger.debug(
        logs.getChanged("TestMonitorable", "testProperty", this.testProperty),
      );
    }
  }

  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  let thread: null | string;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
  });

  test("new WrongMonitorable() throw", () => {
    expect(() => {
      obj = new WrongMonitorable();
    }).toThrow(
      `[mln-${errors.Code.CONSTRUCT_IMPL}] ${errors.Description.CONSTRUCT_IMPL}`,
    );
  });

  test("WrongMonitorable construct thread is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(9);
    iter = set.values();
  });

  test("checkpoint log message (1) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = checkpoint.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(1, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(checkpoint.logger.uid)).toBeTruthy();
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual(
      "construct",
    );
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "Monitorable",
    );
  });

  test("_uid changed log message (2) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(2, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(changed.logger.uid)).toBeTruthy();
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_uid");
    expect((changed.message as message.Changed).value).toEqual(
      changed.logger.uid,
    );
  });

  test("_created changed log message (3) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(3, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(changed.logger.uid)).toBeTruthy();
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_created");
    expect(
      ((changed.message as message.Changed).value as Date).getTime(),
    ).toBeLessThanOrEqual(Date.now());
  });

  test("_stack changed log message (4) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(4, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(changed.logger.uid)).toBeTruthy();
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_stack");
    const stack = (changed.message as message.Changed).value as string;
    expect(typeof stack === "string").toBeTruthy();
    expect(stack.length).toBeGreaterThan(0);
    expect(stack.indexOf("Instantiation stack")).toEqual(0);
  });

  test("_logger changed log message (5) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(5, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(changed.logger.uid)).toBeTruthy();
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual("_logger");
    expect((changed.message as message.Changed).value).toEqual(
      `{logger[${changed.logger.uid}]}`,
    );
  });

  test("_constructed changed log message (6) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(6, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(changed.logger.uid)).toBeTruthy();
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_constructed",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("WrongMonitorable checkpoint log message (7) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = checkpoint.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(7, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(reUID.test(checkpoint.logger.uid)).toBeTruthy();
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual(
      "construct",
    );
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "TestMonitorable",
    );
  });

  test("WrongMonitorable testProperty changed log message (8) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(8, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(typeof changed.logger.uid === "string").toBeTruthy();
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "TestMonitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "testProperty",
    );
    expect((changed.message as message.Changed).value).toEqual(
      "testProperty value",
    );
  });

  test("WrongMonitorable error log message (9) is valid", () => {
    // fetch first message
    const error: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(9, error);
    // assert logger
    expect(error.logger instanceof logs.Logger).toBeTruthy();
    expect(typeof error.logger.uid === "string").toBeTruthy();
    expect(error.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(error.thread).toEqual(thread);
    // assert stack
    expect(error.stack).toBeDefined();
    expect(typeof error.stack === "string").toBeTruthy();
    expect((error.stack as string).length).toBeGreaterThan(0);
    expect((error.stack as string).indexOf("Error")).toEqual(0);
    // assert type
    expect(error.type).toEqual(logs.Type.error);
    // assert level
    expect(error.level).toEqual(logs.Level.ERROR);
    // assert message
    expect(error.message).toBeDefined();
    expect(error.message instanceof message.ErrorLog).toBeTruthy();
    expect((error.message as message.ErrorLog).code).toEqual(
      errors.Code.CONSTRUCT_IMPL,
    );
    expect((error.message as message.ErrorLog).message).toEqual(
      errors.Description.CONSTRUCT_IMPL,
    );
  });
});

describe("Manual Monitorable[construct] call throw", () => {
  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  const thread: null | string = null;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
  });

  test("Monitorable instance could be created", () => {
    expect(() => {
      obj = new logs.Monitorable();
    }).not.toThrow();
    expect(logNS.undestructed.has(obj.uid)).toBeTruthy();
    expect(logNS.undestructed.get(obj.uid)).toEqual(obj);
  });

  test("Monitorable[construct] call throws", () => {
    expect(() => {
      obj[construct]();
    }).toThrow(
      `[mln-${errors.Code.CONSTRUCT_CALL}] ${errors.Description.CONSTRUCT_CALL}`,
    );
  });

  test("Monitorable[construct] call is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(14);
    iter = set.values();
    for (let i = 0; i < 13; i++) {
      iter.next();
    }
  });

  test("Monitorable error log message (13) is valid", () => {
    // fetch first message
    const error: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(14, error);
    // assert logger
    expect(error.logger instanceof logs.Logger).toBeTruthy();
    expect(typeof error.logger.uid === "string").toBeTruthy();
    expect(error.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(error.thread).toEqual(thread);
    // assert stack
    expect(error.stack).toBeDefined();
    expect(typeof error.stack === "string").toBeTruthy();
    expect((error.stack as string).length).toBeGreaterThan(0);
    expect((error.stack as string).indexOf("Error")).toEqual(0);
    // assert type
    expect(error.type).toEqual(logs.Type.error);
    // assert level
    expect(error.level).toEqual(logs.Level.ERROR);
    // assert message
    expect(error.message).toBeDefined();
    expect(error.message instanceof message.ErrorLog).toBeTruthy();
    expect((error.message as message.ErrorLog).code).toEqual(
      errors.Code.CONSTRUCT_CALL,
    );
    expect((error.message as message.ErrorLog).message).toEqual(
      errors.Description.CONSTRUCT_CALL,
    );
  });
});

describe("Manual TestMonitorable[construct] call throw", () => {
  /**
   * Monitorable child class to test.
   */
  class TestMonitorable extends logs.Monitorable {
    /**
     * Additional property to test logging.
     */
    public testProperty: undefined | string;

    /**
     * @override
     */
    protected [construct]() {
      super[construct]();
      this.logger.trace(logs.getCheckpoint("construct", "TestMonitorable"));

      // init additional property and log this
      this.testProperty = "testProperty value";
      this.logger.debug(
        logs.getChanged("TestMonitorable", "testProperty", this.testProperty),
      );
    }
  }

  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  const thread: null | string = null;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
  });

  test("TestMonitorable instance could be created", () => {
    expect(() => {
      obj = new TestMonitorable();
    }).not.toThrow();
    expect(logNS.undestructed.has(obj.uid)).toBeTruthy();
    expect(logNS.undestructed.get(obj.uid)).toEqual(obj);
  });

  test("TestMonitorable[construct] call throws", () => {
    expect(() => {
      obj[construct]();
    }).toThrow(
      `[mln-${errors.Code.CONSTRUCT_CALL}] ${errors.Description.CONSTRUCT_CALL}`,
    );
  });

  test("TestMonitorable[construct] call is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(16);
    iter = set.values();
    for (let i = 0; i < 15; i++) {
      iter.next();
    }
  });

  test("TestMonitorable error log message (16) is valid", () => {
    // fetch first message
    const error: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(16, error);
    // assert logger
    expect(error.logger instanceof logs.Logger).toBeTruthy();
    expect(typeof error.logger.uid === "string").toBeTruthy();
    expect(error.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(error.thread).toEqual(thread);
    // assert stack
    expect(error.stack).toBeDefined();
    expect(typeof error.stack === "string").toBeTruthy();
    expect((error.stack as string).length).toBeGreaterThan(0);
    expect((error.stack as string).indexOf("Error")).toEqual(0);
    // assert type
    expect(error.type).toEqual(logs.Type.error);
    // assert level
    expect(error.level).toEqual(logs.Level.ERROR);
    // assert message
    expect(error.message).toBeDefined();
    expect(error.message instanceof message.ErrorLog).toBeTruthy();
    expect((error.message as message.ErrorLog).code).toEqual(
      errors.Code.CONSTRUCT_CALL,
    );
    expect((error.message as message.ErrorLog).message).toEqual(
      errors.Description.CONSTRUCT_CALL,
    );
  });
});

describe("Monitorable class destruct", () => {
  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  let thread: null | string;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
    obj = new logs.Monitorable();
  });

  test("destructor method could be called", () => {
    expect(() => {
      obj.destructor();
    }).not.toThrow();
  });

  test("destruct thread is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(19);
    iter = set.values();
    for (let i = 0; i < 13; i++) {
      iter.next();
    }
  });

  test("_destructing changed log message (14) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = changed.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(14, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructing",
    );
    expect((changed.message as message.Changed).value).toEqual(true);
  });

  test("checkpoint log message (15) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(15, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(checkpoint.logger.uid).toEqual(obj.uid);
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual("destruct");
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "Monitorable",
    );
  });

  test("undestructed.delete called log message (16) is valid", () => {
    // fetch first message
    const called: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(16, called);
    // assert logger
    expect(called.logger instanceof logs.Logger).toBeTruthy();
    expect(called.logger.uid).toEqual(obj.uid);
    expect(called.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(called.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(called.thread).toEqual(thread);
    // assert stack
    expect(called.stack).toBeDefined();
    expect(called.stack).toBeNull();
    // assert type
    expect(called.type).toEqual(logs.Type.called);
    // assert level
    expect(called.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(called.message).toBeDefined();
    expect(called.message instanceof message.Called).toBeTruthy();
    expect((called.message as message.Called).name).toEqual("undestructed");
    expect((called.message as message.Called).type).toEqual("Map");
    expect((called.message as message.Called).method).toEqual("delete");
    expect((called.message as message.Called).args).toEqual([obj.uid]);
  });

  test("_destructing changed log message (17) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(17, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructing",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_destructing changed log message (18) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(18, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructed",
    );
    expect((changed.message as message.Changed).value instanceof Date).toEqual(
      true,
    );
  });

  test("object constructed log message (19) is valid", () => {
    // fetch first message
    const destructed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(19, destructed);
    // assert logger
    expect(destructed.logger instanceof logs.Logger).toBeTruthy();
    expect(destructed.logger.uid).toEqual(obj.uid);
    expect(destructed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(destructed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(destructed.thread).toEqual(thread);
    // assert stack
    expect(destructed.stack).toBeDefined();
    expect(destructed.stack).toBeNull();
    // assert type
    expect(destructed.type).toEqual(logs.Type.destructed);
    // assert level
    expect(destructed.level).toEqual(logs.Level.INFO);
    // assert message
    expect(destructed.message).toBeDefined();
    expect(destructed.message instanceof message.Destructed).toBeTruthy();
  });

  test("object is missed in undestructable map", () => {
    expect(logNS.undestructed.get(obj.uid)).toBeUndefined();
  });

  test("destructor method warn on destructed object", () => {
    expect(() => {
      obj.destructor();
    }).not.toThrow();
  });

  test("warning is logged", () => {
    expect(set.size).toEqual(20);
  });

  test("warning log message (20) is valid", () => {
    // fetch first message
    const warning: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(20, warning);
    // assert logger
    expect(warning.logger instanceof logs.Logger).toBeTruthy();
    expect(warning.logger.uid).toEqual(obj.uid);
    expect(warning.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(warning.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(warning.thread).toBeDefined();
    expect(warning.thread).not.toBeNull();
    expect(warning.thread).not.toEqual(thread);
    // assert stacks
    expect(warning.stack).toBeNull();
    // assert type
    expect(warning.type).toEqual(logs.Type.string);
    // assert level
    expect(warning.level).toEqual(logs.Level.WARN);
    // assert message
    expect(warning.message).toEqual(`{${obj.uid}} is alredy destructed`);
  });
});

describe("TestMonitorable class destruct", () => {
  /**
   * Monitorable child class to test.
   */
  class TestMonitorable extends logs.Monitorable {
    /**
     * Additional property to test logging.
     */
    public testProperty: undefined | string;

    /**
     * @override
     */
    protected [construct]() {
      super[construct]();
      this.logger.trace(logs.getCheckpoint("construct", "TestMonitorable"));

      // init additional property and log this
      this.testProperty = "testProperty value";
      this.logger.debug(
        logs.getChanged("TestMonitorable", "testProperty", this.testProperty),
      );
    }

    /**
     * @override
     */
    protected [destruct]() {
      this.logger.trace(logs.getCheckpoint("destruct", "TestMonitorable"));

      // clear additional property and log this
      this.testProperty = undefined;
      this.logger.debug(
        logs.getChanged("TestMonitorable", "testProperty", undefined),
      );
      super[destruct]();
    }
  }

  const set: Set<logs.Log> = new Set();
  let add: jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
  let buffer: TestBuffer;
  let iter: IterableIterator<logs.Log>;
  let obj: logs.Monitorable;
  let thread: null | string;

  beforeAll(() => {
    // mock buffer for test
    buffer = new TestBuffer();
    add = jest.spyOn(buffer, "add").mockImplementation((log) => {
      set.add(log);
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }) as jest.SpyInstance<Promise<boolean>, [log: logs.Log]>;
    logs.setBuffer(buffer);
    obj = new TestMonitorable();
  });

  test("destructor method could be called", () => {
    expect(() => {
      obj.destructor();
    }).not.toThrow();
  });

  test("destruct thread is logged", () => {
    expect(add).toHaveBeenCalled();
    expect(set.size).toEqual(23);
    iter = set.values();
    for (let i = 0; i < 15; i++) {
      iter.next();
    }
  });

  test("_destructing changed log message (16) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = changed.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(16, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructing",
    );
    expect((changed.message as message.Changed).value).toEqual(true);
  });

  test("checkpoint log message (17) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(17, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(checkpoint.logger.uid).toEqual(obj.uid);
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual("destruct");
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "TestMonitorable",
    );
  });

  test("testProperty changed log message (18) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // save thread for further asserts
    thread = changed.thread;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(18, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "TestMonitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "testProperty",
    );
    expect((changed.message as message.Changed).value).toBeUndefined();
  });

  test("checkpoint log message (19) is valid", () => {
    // fetch first message
    const checkpoint: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(19, checkpoint);
    // assert logger
    expect(checkpoint.logger instanceof logs.Logger).toBeTruthy();
    expect(checkpoint.logger.uid).toEqual(obj.uid);
    expect(checkpoint.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(checkpoint.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(typeof checkpoint.thread === "string").toBeTruthy();
    expect(reUID.test(checkpoint.thread as string)).toBeTruthy();
    // assert stack
    expect(checkpoint.stack).toBeDefined();
    expect(typeof checkpoint.stack === "string").toBeTruthy();
    expect((checkpoint.stack as string).length).toBeGreaterThan(0);
    expect((checkpoint.stack as string).indexOf("Checkpoint")).toEqual(0);
    // assert type
    expect(checkpoint.type).toEqual(logs.Type.checkpoint);
    // assert level
    expect(checkpoint.level).toEqual(logs.Level.TRACE);
    // assert message
    expect(checkpoint.message).toBeDefined();
    expect(checkpoint.message instanceof message.Checkpoint).toBeTruthy();
    expect((checkpoint.message as message.Checkpoint).name).toEqual("destruct");
    expect((checkpoint.message as message.Checkpoint).value).toEqual(
      "Monitorable",
    );
  });

  test("undestructed.delete called log message (20) is valid", () => {
    // fetch first message
    const called: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(20, called);
    // assert logger
    expect(called.logger instanceof logs.Logger).toBeTruthy();
    expect(called.logger.uid).toEqual(obj.uid);
    expect(called.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(called.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(called.thread).toEqual(thread);
    // assert stack
    expect(called.stack).toBeDefined();
    expect(called.stack).toBeNull();
    // assert type
    expect(called.type).toEqual(logs.Type.called);
    // assert level
    expect(called.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(called.message).toBeDefined();
    expect(called.message instanceof message.Called).toBeTruthy();
    expect((called.message as message.Called).name).toEqual("undestructed");
    expect((called.message as message.Called).type).toEqual("Map");
    expect((called.message as message.Called).method).toEqual("delete");
    expect((called.message as message.Called).args).toEqual([obj.uid]);
  });

  test("_destructing changed log message (21) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(21, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructing",
    );
    expect((changed.message as message.Changed).value).toEqual(false);
  });

  test("_destructing changed log message (22) is valid", () => {
    // fetch first message
    const changed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(22, changed);
    // assert logger
    expect(changed.logger instanceof logs.Logger).toBeTruthy();
    expect(changed.logger.uid).toEqual(obj.uid);
    expect(changed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(changed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(changed.thread).toEqual(thread);
    // assert stack
    expect(changed.stack).toBeDefined();
    expect(changed.stack).toBeNull();
    // assert type
    expect(changed.type).toEqual(logs.Type.changed);
    // assert level
    expect(changed.level).toEqual(logs.Level.DEBUG);
    // assert message
    expect(changed.message).toBeDefined();
    expect(changed.message instanceof message.Changed).toBeTruthy();
    expect((changed.message as message.Changed).namespace).toEqual(
      "Monitorable",
    );
    expect((changed.message as message.Changed).attribute).toEqual(
      "_destructed",
    );
    expect((changed.message as message.Changed).value instanceof Date).toEqual(
      true,
    );
  });

  test("object constructed log message (23) is valid", () => {
    // fetch first message
    const destructed: logs.Log = iter.next().value as logs.Log;
    // assert buffer call
    expect(add).toHaveBeenNthCalledWith(23, destructed);
    // assert logger
    expect(destructed.logger instanceof logs.Logger).toBeTruthy();
    expect(destructed.logger.uid).toEqual(obj.uid);
    expect(destructed.logger.level).toEqual(logs.Level.TRACE);
    // assert timestamp
    expect(destructed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    // assert thread
    expect(destructed.thread).toEqual(thread);
    // assert stack
    expect(destructed.stack).toBeDefined();
    expect(destructed.stack).toBeNull();
    // assert type
    expect(destructed.type).toEqual(logs.Type.destructed);
    // assert level
    expect(destructed.level).toEqual(logs.Level.INFO);
    // assert message
    expect(destructed.message).toBeDefined();
    expect(destructed.message instanceof message.Destructed).toBeTruthy();
  });

  test("object is missed in undestructable map", () => {
    expect(logNS.undestructed.get(obj.uid)).toBeUndefined();
  });
});
