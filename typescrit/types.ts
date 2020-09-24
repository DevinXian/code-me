// 获取函数返回值
type ReturnType1<T> = T extends (...args: any[]) => infer R ? R : any;

// Promise<Number>
type ReturnNumber = ReturnType1<(args: string) => Promise<number>>

// 进一步解包Promise
type unpackPromise<T> = T extends Promise<infer R> ? R: any

// string
type str = unpackPromise<Promise<string>>;

// 相当于组合
type aliasStr = unpackPromise<ReturnType1<() => Promise<string>>>