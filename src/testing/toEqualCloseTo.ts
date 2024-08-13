import "jest";
import CustomMatcherResult = jest.CustomMatcherResult;

expect.extend({
  toEqualCloseTo<E = any>(received: E, expected: E, precision = 6): CustomMatcherResult {
    const getType = (x: E) => Array.isArray(x) ? "array" : typeof x;
    function round(obj: E): E {
      switch (getType(obj)) {
        case 'array':
          return (obj as Array<any>).map(round) as E;
        case 'object':
          return Object.keys(obj as {[key: string]: any}).reduce((acc: {[key: string]: any}, key) => {
            acc[key] = round((obj as {[key: string]: any})[key]);
            return acc;
          }, {}) as E;
        case 'number':
          return +(obj as number).toFixed(precision) as E;
        default:
          return obj;
      }
    }
    expect(round(received)).toEqual(round(expected));

    return {
      pass: true,
      message: () => "",
    };
  },
});
