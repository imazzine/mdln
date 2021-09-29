/**
 * @fileoverview Declaration of the logs Buffer class.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { symbolsNS } from "../../symbols";
import { level } from "../level";
import { logger as ns } from "./Log";
import { debounce } from "throttle-debounce";
export namespace logger {
  import Log = ns.Log;
  import Level = level.Level;
  import _timeout = symbolsNS._timeout;
  import _buffer = symbolsNS._buffer;
  import _errors = symbolsNS._errors;
  import _debouncer = symbolsNS._debouncer;
  import sync = symbolsNS.sync;
  let canUpdate = true;

  /**
   * Logs buffer class.
   */
  export class Buffer {
    /**
     * Sync debouncer timeout, ms.
     */
    private [_timeout] = 250;

    /**
     * Logs buffer.
     */
    private [_buffer]: Set<Log> = new Set();

    /**
     * Failed in sync logs buffer.
     */
    private [_errors]: Set<Log> = new Set();

    /**
     * Sync debouncer.
     */
    private [_debouncer] = debounce(this[_timeout], async () => {
      const logs: Set<Log> =
        this[_errors].size === 0
          ? this[_buffer]
          : new Set([...this[_errors], ...this[_buffer]]);
      this[_buffer] = new Set();
      this[_errors] = new Set();
      try {
        await this[sync](logs);
      } catch (error) {
        this[_errors] = logs;
        throw error;
      }
    });

    /**
     * Set sync debouncer timeout.
     * @param timeout Timeout in ms.
     */
    public set timeout(timeout: number) {
      this[_timeout] = timeout;
    }

    /**
     * Return sync debouncer timeout in ms.
     */
    public get timeout(): number {
      return this[_timeout];
    }

    /**
     * Default sync function.
     */
    protected async [sync](logs: Set<Log>): Promise<void> {
      return new Promise((resolve) => {
        logs.forEach((log: Log) => {
          if (log.logger.level === Level.NONE) {
            return;
          } else {
            switch (log.level) {
              case Level.TRACE:
                if (log.logger.level == Level.TRACE) {
                  console.log(log);
                }
                break;
              case Level.DEBUG:
                if (log.logger.level <= Level.DEBUG) {
                  console.log(log);
                }
                break;
              case Level.INFO:
                if (log.logger.level <= Level.INFO) {
                  console.log(log);
                }
                break;
              case Level.WARN:
                if (log.logger.level <= Level.WARN) {
                  console.log(log);
                }
                break;
              case Level.ERROR:
                if (log.logger.level <= Level.ERROR) {
                  console.log(log);
                }
                break;
              case Level.FATAL:
                console.log(log);
                break;
            }
            return;
          }
        });
        resolve();
      });
    }

    /**
     * Adds log to the buffer.
     * @param log Log to add.
     */
    public async add(log: Log): Promise<boolean> {
      canUpdate = false;
      this[_buffer].add(log);
      try {
        await this[_debouncer]();
      } catch (error) {
        console.error(`Logging sync failed: ${error as string}`);
        return false;
      }
      return true;
    }
  }

  /**
   * Logs buffer object.
   */
  export let buffer: logger.Buffer = new logger.Buffer();

  /**
   * Replace buffer object which logger will internally use. Do nothing if
   * {@link logs.Buffer.add | logs.Buffer#add } was already called or `buf` is not an
   * object constructed from the {@link logs.Buffer} child class.
   * @param buffer New buffer object.
   */
  export function setBuffer(buf: logger.Buffer): boolean {
    if (buf instanceof logger.Buffer && canUpdate) {
      buffer = buf;
      return true;
    }
    return false;
  }
}
