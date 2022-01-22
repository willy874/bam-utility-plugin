class FileName {
    constructor(name) {
        this.data = [];
        const last = name.lastIndexOf('.');
        this.ext = last >= 0 ? name.substring(last) : '';
        this.name = name.replace(this.ext, '');
        let index = 0;
        let isBlack = false;
        for (let i = 0; i < this.name.length; i++) {
            const str = this.name[i];
            if (i === 0) {
                index = this.data.push(str);
            }
            else if (/\.|-|_|\s/.test(str)) {
                isBlack = true;
            }
            else if (isBlack) {
                isBlack = false;
                index = this.data.push(str);
            }
            else if (/[A-Z]/.test(str)) {
                index = this.data.push(str);
            }
            else {
                this.data[index - 1] += str;
            }
        }
    }
    transformUpperHump() {
        return this.data.filter(s => s).map((s) => s[0].toUpperCase() + s.substring(1)).join('');
    }
    transformLowerHump() {
        return this.data.filter(s => s).map((s, i) => {
            if (i === 0) {
                return s[0].toLowerCase() + s.substring(1);
            }
            return s[0].toUpperCase() + s.substring(1);
        }).join('');
    }
    transformKebabCase() {
        return this.data.join('-');
    }
    transformSnakeCase() {
        return this.data.join('_');
    }
}

class SubScriber {
    constructor() {
        this.steps = [];
        this.end = async () => {
            return;
        };
    }
    getErrorCallback() {
        return this.err;
    }
    async runCompleteCallback(data) {
        return await this.end(data);
    }
    next(callback) {
        this.steps.push(callback);
    }
    error(callback) {
        this.err = callback;
    }
    complete(callback) {
        this.end = callback;
    }
}
class Observable {
    constructor(init) {
        this.subscriber = new SubScriber();
        init(this.subscriber);
    }
    run(first) {
        return new Promise((resolve, reject) => {
            const steps = this.subscriber.steps;
            steps.push(async (data) => {
                const completResult = await this.subscriber.runCompleteCallback(data);
                resolve(completResult);
                return completResult;
            });
            const errorCallback = this.subscriber.getErrorCallback();
            const action = (index = 0, data = first) => {
                if (steps[index]) {
                    const promise = steps[index](data);
                    promise
                        .then((res) => {
                        action(index + 1, res);
                    })
                        .catch((err) => {
                        if (errorCallback)
                            errorCallback(err);
                        reject(err);
                    });
                }
            };
            action();
        });
    }
}

function conditionData(value, defaultValue) {
    return value === defaultValue ? defaultValue : value || defaultValue;
}
const png1px = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTItMTNUMDc6MTc6MjkrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmNmN2U5MjFjLTZjZTEtMzk0Yy1hNmU4LWIzZjA0NmRmOWJkMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpjZjdlOTIxYy02Y2UxLTM5NGMtYTZlOC1iM2YwNDZkZjliZDAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZjdlOTIxYy02Y2UxLTM5NGMtYTZlOC1iM2YwNDZkZjliZDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNmN2U5MjFjLTZjZTEtMzk0Yy1hNmU4LWIzZjA0NmRmOWJkMCIgc3RFdnQ6d2hlbj0iMjAyMS0xMi0xM1QwNzoxNzoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj3/j7AAAAAMSURBVAgdY/j//z8ABf4C/p/KLRMAAAAASUVORK5CYII=';
/**
 * 清除拖拉顯示元素
 * @param {DragEvent} event
 */
function clearDragImage(event) {
    if (event.dataTransfer) {
        const img = new Image();
        img.src = png1px;
        event.dataTransfer.setDragImage(img, 0, 0);
    }
}
function getBoundingClientRect(element) {
    if (!element || !element.getBoundingClientRect) {
        return 0;
    }
    return element.getBoundingClientRect();
}
function getViewportOffset(element) {
    const doc = document.documentElement;
    const docScrollLeft = doc.scrollLeft;
    const docScrollTop = doc.scrollTop;
    const docClientLeft = doc.clientLeft;
    const docClientTop = doc.clientTop;
    const pageXOffset = window.pageXOffset;
    const pageYOffset = window.pageYOffset;
    const box = getBoundingClientRect(element);
    const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box;
    const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
    const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
    const offsetLeft = retLeft + pageXOffset;
    const offsetTop = rectTop + pageYOffset;
    const left = offsetLeft - scrollLeft;
    const top = offsetTop - scrollTop;
    const clientWidth = window.document.documentElement.clientWidth;
    const clientHeight = window.document.documentElement.clientHeight;
    return {
        left: left,
        top: top,
        right: clientWidth - rectWidth - left,
        bottom: clientHeight - rectHeight - top,
        rightIncludeBody: clientWidth - left,
        bottomIncludeBody: clientHeight - top,
    };
}
function getTransformStyleString(transform) {
    return `
  ${transform.rotate === undefined ? '' : `rotate(${conditionData(transform.rotate, 0)})`}
  ${transform.rotateX === undefined ? '' : `rotateX(${conditionData(transform.rotateX, 0)})`}
  ${transform.rotateY === undefined ? '' : `rotateY(${conditionData(transform.rotateY, 0)})`}
  ${transform.rotateZ === undefined ? '' : `rotateZ(${conditionData(transform.rotateZ, 0)})`}
  ${transform.scaleX === undefined ? '' : `scaleX(${conditionData(transform.scaleX, 1)})`}
  ${transform.scaleY === undefined ? '' : `scaleY(${conditionData(transform.scaleY, 1)})`}
  ${transform.scaleZ === undefined ? '' : `scaleZ(${conditionData(transform.scaleZ, 1)})`}
  ${transform.skewX === undefined ? '' : `skewX(${conditionData(transform.skewX, 0)})`}
  ${transform.skewY === undefined ? '' : `skewY(${conditionData(transform.skewY, 0)})`}
  ${transform.translateX === undefined ? '' : `translateX(${conditionData(transform.translateX, 0)})`}
  ${transform.translateY === undefined ? '' : `translateY(${conditionData(transform.translateY, 0)})`}
  ${transform.translateZ === undefined ? '' : `translateZ(${conditionData(transform.translateZ, 0)})`}
  `;
}

function isApp() {
    const res = window.navigator.userAgent.match(/StApp\/([a-zA-Z0-9]*)\/(\d\.\d\.\d)\/([a-zA-Z0-9]*)/);
    if (res) {
        return {
            isApp: true,
            merchant: res[1],
            version: res[2],
            platform: res[3],
        };
    }
    return false;
}

function formDataFormat(data) {
    const format = (obj, keys = []) => {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const formName = [...keys, key].map((k, i) => (i ? `[${k}]` : k)).join('');
            if (value instanceof Blob) {
                if (value instanceof File) {
                    formData.append(formName, value, value.name);
                }
                else {
                    formData.append(formName, value);
                }
            }
            else if (typeof value === 'object' && value !== null) {
                const obj = value[key];
                format(obj, [...keys, key]);
            }
            else if (value !== undefined) {
                formData.append(formName, String(value));
            }
        });
    };
    const formData = new FormData();
    format(data);
    return formData;
}
function formUrlEncodedFormat(data) {
    const queryParams = new URLSearchParams();
    for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
        }
        else if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
        }
        else {
            queryParams.append(key, String(value));
        }
    }
    return queryParams;
}
function cloneJson(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function isDarkMode() {
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches;
}
function isClass(value) {
    return Object.prototype.toString.call(value) === '[object Function]' && typeof value === 'function' && 'constructor' in value;
}
function isArrayEmpty(value) {
    return Array.isArray(value) && JSON.stringify(value.filter(Boolean)) === '[]';
}
function isObjectEmpty(value) {
    return typeof value === 'object' && value !== null && value.constructor === Object && JSON.stringify(value) === '{}';
}
function isBlobEmpty(value) {
    return value instanceof Blob && (value.size === 0 || value.type === '');
}
function isStringEmpty(value) {
    return typeof value === 'string' && /^\s*$/.test(value);
}
function isNumberEmpty(value) {
    return typeof value === 'number' && isNaN(value);
}
function isEmpty(value) {
    if (value === undefined)
        return true;
    if (value === null)
        return true;
    if (isNumberEmpty(value))
        return true;
    if (isStringEmpty(value))
        return true;
    if (isArrayEmpty(value))
        return true;
    if (isObjectEmpty(value))
        return true;
    if (isBlobEmpty(value))
        return true;
    return false;
}
function isTextIncludes(data, text) {
    for (let index = 0; index < data.length; index++) {
        const value = data[index];
        if (value instanceof RegExp) {
            if (value.test(text))
                return true;
        }
        else {
            const reg = new RegExp(String(value));
            if (reg.test(text))
                return true;
        }
    }
    return false;
}
function isTextExcludes(data, text) {
    for (let index = 0; index < data.length; index++) {
        const value = data[index];
        if (value instanceof RegExp) {
            if (value.test(text))
                return false;
        }
        else {
            const reg = new RegExp(String(value));
            if (reg.test(text))
                return false;
        }
    }
    return true;
}

function messageFormat(message, data) {
    let logMessage = message;
    for (const key in data) {
        const reg = new RegExp('{' + key + '}', 'g');
        logMessage = logMessage.replace(reg, () => data[key]);
    }
    return logMessage;
}
class HttpError extends Error {
    constructor(args = {}) {
        const message = args.message || '';
        super(message);
        this.status = args.status || 0;
        this.method = args.method?.toUpperCase() || 'GET';
        this.url = args.url || '';
    }
}
function handleErrorLog(error, data = {}) {
    if (error instanceof Error) {
        console.error(messageFormat(error.message, data));
    }
    if (typeof error === 'string') {
        console.error(messageFormat(error, data));
    }
}
function handleHttpErrorLog(error) {
    if (error instanceof HttpError) {
        console.error(`%s [%s] %s\n%s`, error.method || 'GET', error.status || 0, error.url || '', error.message);
        return error;
    }
    if (error instanceof Error) {
        handleErrorLog(error);
        return error;
    }
    return new Error('The function param name of error is not Error().');
}
function handleWarningLog(message, data = {}) {
    if (message instanceof Array) {
        console.error(...message);
    }
    if (typeof message === 'string') {
        console.warn(messageFormat(message, data));
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (result instanceof ArrayBuffer) {
                resolve(JSON.stringify(result));
            }
            else {
                resolve(result || '');
            }
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsDataURL(blob);
    });
}
function urlToImageElement(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            requestAnimationFrame(() => {
                resolve(img);
            });
        };
        img.onerror = (e) => {
            reject(e);
        };
        img.src = url;
    });
}
function transformFileSize(value) {
    if (typeof value === 'string') {
        const size = value.replace(/\s+/g, '').toUpperCase();
        if (/KB$/.test(size)) {
            const num = Number(size.replace(/KB$/, ''));
            return num * 10 ** 3;
        }
        if (/MB$/.test(size)) {
            const num = Number(size.replace(/MB$/, ''));
            return num * 10 ** 6;
        }
        if (/GB$/.test(size)) {
            const num = Number(size.replace(/GB$/, ''));
            return num * 10 ** 9;
        }
        if (/TB$/.test(size)) {
            const num = Number(size.replace(/TB$/, ''));
            return num * 10 ** 12;
        }
        return Number(size);
    }
    if (typeof value === 'number') {
        return value;
    }
    return NaN;
}

export { FileName, HttpError, Observable, SubScriber, blobToBase64, clearDragImage, cloneJson, formDataFormat, formUrlEncodedFormat, getBoundingClientRect, getTransformStyleString, getViewportOffset, handleErrorLog, handleHttpErrorLog, handleWarningLog, isApp, isArrayEmpty, isBlobEmpty, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, messageFormat, transformFileSize, urlToImageElement };
