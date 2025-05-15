/**
 * Creates a function that samples calls at regular intervals and captures trailing calls.
 * - Drops calls that occur between sampling intervals
 * - Takes one call per sampling interval if available
 * - Captures the last call if no call was made during the interval
 * - Prevents infinite recursive loops by checking for identical arguments
 *
 * @param fn The function to sample
 * @param sampleInterval How often to sample calls (in ms)
 * @returns The sampled function
 */
export function createSampler<T extends (...args: any[]) => any>(fn: T, sampleInterval: number): T {
  let lastArgs: Parameters<T> | null = null;
  let lastTime = 0;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgsJSON: string | null = null; // Track last args to prevent recursive loops

  // Create a function with the same type as the input function
  const sampled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    // Skip if args are empty or undefined
    if (!args || args.length === 0 || args.every((arg) => arg === undefined)) {
      return;
    }

    // Prevent infinite loops by checking if args are identical to last call
    const argsJSON = JSON.stringify(args);

    if (argsJSON === lastArgsJSON) {
      return;
    }

    lastArgsJSON = argsJSON;
    lastArgs = args;

    // If we're within the sample interval, just store the args
    if (now - lastTime < sampleInterval) {
      // Set up trailing call if not already set
      if (!timeout) {
        timeout = setTimeout(
          () => {
            timeout = null;
            lastTime = Date.now();

            if (lastArgs) {
              fn.apply(this, lastArgs);
              lastArgs = null;
            }
          },
          sampleInterval - (now - lastTime),
        );
      }

      return;
    }

    // If we're outside the interval, execute immediately
    lastTime = now;
    fn.apply(this, args);
    lastArgs = null;
  } as T;

  return sampled;
}
