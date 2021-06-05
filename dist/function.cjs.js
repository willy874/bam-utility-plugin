'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 大小寫與連接符無法混用，連接符的優先級比駝峰高
 */
class FileName {
    constructor(name) {
        this.data = [];
        const type = /\./.test(name) ? 'file' : 'none';
        const getExt = () => {
            const file = name.split('.');
            return file[file.length - 1];
        };
        const getFile = () => {
            const file = name.split('.');
            file.splice(file.length - 1, 1);
            return file.join('');
        };
        this.ext = type === 'none' ? 'none' : getExt();
        this.name = type === 'none' ? name : getFile();
        if (/[A-Z]/.test(this.name)) {
            const arr = this.name.split('');
            arr.forEach((s, i) => {
                if (/[A-Z]/.test(s)) {
                    arr[i] = '-' + s.toLowerCase();
                }
                this.data = arr
                    .join('')
                    .split('-')
                    .filter((p) => p);
            });
        }
        else if (/\.|-|_|\s/.test(this.name)) {
            const allow = ['.', '-', '_', '', '\r', '\t', '\n', '\f'];
            const arr = this.name.split('');
            arr.forEach((s, i) => {
                if (allow.includes(s)) {
                    arr[i] = '-';
                }
            });
            this.data = arr.join('').split('-');
        }
        else {
            this.data = [this.name];
        }
    }
    ConverBigHump() {
        const arr = [];
        this.data.forEach((s) => {
            if (s[0]) {
                arr.push(s[0].toUpperCase() + s.substring(1));
            }
        });
        return arr.join('');
    }
    ConverLittleHump() {
        const arr = [];
        this.data.forEach((s) => {
            if (s[0]) {
                if (arr.length === 0) {
                    arr.push(s.toLowerCase());
                }
                else {
                    arr.push(s[0].toUpperCase() + s.substring(1));
                }
            }
        });
        return arr.join('');
    }
}

class SubScriber {
    constructor() {
        this.steps = [];
    }
    next(callback) {
        this.steps.push(callback);
    }
    error(callback) {
        this.err = callback;
    }
}
class Observable {
    constructor(init) {
        this.subscriber = new SubScriber();
        init(this.subscriber);
    }
    run() {
        const steps = this.subscriber.steps;
        const errorCallback = this.subscriber.err;
        const action = (index = 0, data = undefined) => {
            if (steps[index]) {
                const promise = steps[index](data);
                promise
                    .then((res) => {
                    action(index + 1, res);
                })
                    .catch((err) => {
                    if (errorCallback)
                        errorCallback(err);
                });
            }
        };
        action();
    }
}

const valueString = function (value, type = 'json') {
    switch (true) {
        case value === undefined:
            return 'undefined';
        case value === null:
            return 'null';
        case value === 0:
            return '0';
        case value === '':
            return "''";
        case isNaN(Number(value)):
            return 'NaN';
        case typeof value === 'string':
            return `'${value}'`;
        case typeof value === 'function':
            return (value + '').replace(/\\{2}?/g, '');
        case typeof value === 'object' && !Array.isArray(value):
            if (value instanceof Array) {
                return type === 'sql' && value instanceof Array
                    ? `[${value.map((v) => valueString(v)).join(',')}]`
                    : `(${value.map((v) => valueString(v)).join(',')})`;
            }
            return JSON.stringify(value).replace(/\\{2}?/g, '');
        default:
            return value + '';
    }
};

exports.FileName = FileName;
exports.Observable = Observable;
exports.valueString = valueString;
