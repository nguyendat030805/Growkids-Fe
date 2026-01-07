export const Logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[LOG]:', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]:', ...args);
  }
};