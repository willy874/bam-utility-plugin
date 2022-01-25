declare class FileName {
    readonly data: string[];
    readonly ext: string;
    readonly name: string;
    constructor(name: string);
    transformUpperHump(): string;
    transformLowerHump(): string;
    transformKebabCase(): string;
    transformSnakeCase(): string;
}

declare class SubScriber {
    steps: Array<(data: unknown) => Promise<unknown>>;
    private err;
    private end;
    constructor();
    getErrorCallback(): ((data: unknown) => Promise<unknown>) | undefined;
    runCompleteCallback(data: unknown): Promise<unknown>;
    next(callback: (data: unknown) => Promise<unknown>): void;
    error(callback: (data: unknown) => Promise<unknown>): void;
    complete(callback: (data: unknown) => Promise<unknown>): void;
}
declare class Observable {
    subscriber: SubScriber;
    constructor(init: (callback: SubScriber) => void);
    run(first: unknown): Promise<unknown>;
}

/**
 * 清除拖拉顯示元素
 * @param {DragEvent} event
 */
declare function clearDragImage(event: DragEvent): void;
interface ViewportOffsetResult {
    left: number;
    top: number;
    right: number;
    bottom: number;
    rightIncludeBody: number;
    bottomIncludeBody: number;
}
declare function getBoundingClientRect(element: Element): DOMRect | number;
declare function getViewportOffset(element: Element): ViewportOffsetResult;
interface TransformStyle {
    rotate?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    scaleX?: string;
    scaleY?: string;
    scaleZ?: string;
    skewX?: string;
    skewY?: string;
    translateX?: string;
    translateY?: string;
    translateZ?: string;
}
declare function getTransformStyleString(transform: TransformStyle): string;

interface DeviceInfoInfo {
    isApp: boolean;
    merchant: string;
    version: string;
    platform: string;
}
declare function isApp(): DeviceInfoInfo | boolean;

interface JsonObject {
    [k: string]: JsonValue;
}
declare type JsonValue = null | boolean | string | number | JsonObject;
interface FormDataObject {
    [k: string]: FormDataValue;
}
declare type FormDataValue = JsonValue | Blob | FormDataObject;
declare function formDataFormat(data: FormDataObject): FormData;
declare function formUrlEncodedFormat(data: JsonObject): URLSearchParams;
declare function cloneJson(obj: unknown): JsonObject;

declare function isDarkMode(): boolean;
declare function isClass(value: unknown): boolean;
declare function isArrayEmpty(value: unknown): boolean;
declare function isObjectEmpty(value: unknown): boolean;
declare function isBlobEmpty(value: unknown): boolean;
declare function isStringEmpty(value: unknown): boolean;
declare function isNumberEmpty(value: unknown): boolean;
declare function isEmpty(value: unknown): boolean;
declare function isTextIncludes(data: Array<string | RegExp>, text: string): boolean;
declare function isTextExcludes(data: Array<string | RegExp>, text: string): boolean;

declare function messageFormat(message: string, data: Record<string, string>): string;
interface HttpErrorOption {
    message?: string;
    status?: number;
    url?: string;
    method?: string;
}
declare class HttpError extends Error {
    status: number;
    method: string;
    url: string;
    constructor(args?: HttpErrorOption);
}
declare function handleErrorLog(error: unknown, data?: Record<string, string>): void;
declare function handleHttpErrorLog(error: unknown): Error | HttpError;
declare function handleWarningLog(message: string | string[], data?: Record<string, string>): void;

declare function blobToBase64(blob: Blob): Promise<string>;
declare function urlToImageElement(url: string): Promise<HTMLImageElement>;
declare function transformFileSize(value: unknown): number;

interface BaseValidateOption<M> {
    message?: string;
    messageOption?: Record<keyof M, string>;
}
declare type ValidateOption<V> = V & BaseValidateOption<V>;
declare type StringResult = string | string[] | null;
declare type ValidatorHandlerResult = Promise<StringResult> | StringResult;
declare type ValidatorHandler = (value: unknown, option?: ValidateOption<never>) => ValidatorHandlerResult;
interface ValidatorHandlerList {
    [k: string]: ValidatorHandler;
}
declare type ValidateField<V> = {
    [Type in keyof V]: ValidatorHandlerOption<V[Type]>;
};
declare type ValidatorValidOption<M, V> = {
    [K in keyof M]?: ValidateField<V>;
};
declare type ValidatorHandlerOption<F> = F extends (value: unknown, option: infer A) => ValidatorHandlerResult ? A : never;
interface ErrorMessages {
    [key: string]: string[] | null;
}
declare class Validator<M> {
    readonly validatorHandler: ValidatorHandlerList;
    private readonly model;
    private readonly validateOption?;
    readonly errors: {
        [K in keyof M]?: string[];
    };
    constructor(model: M, option?: ValidatorValidOption<M, ValidatorHandlerList>);
    validate(options?: ValidatorValidOption<M, ValidatorHandlerList>): Promise<ErrorMessages>;
    setValidatorHandler(name: string, handler: ValidatorHandler): void;
    validateField(value: unknown, options?: ValidateField<ValidatorHandlerList>): Promise<string[] | null>;
    errorsToArray(): string[];
    getErrors(): {
        [K in keyof M]?: string[];
    };
    isValid(field: keyof M): boolean;
}

export { DeviceInfoInfo, FileName, FormDataObject, FormDataValue, HttpError, JsonObject, JsonValue, Observable, SubScriber, TransformStyle, ValidateField, ValidateOption, Validator, ValidatorHandler, ValidatorHandlerOption, ValidatorValidOption, ViewportOffsetResult, blobToBase64, clearDragImage, cloneJson, formDataFormat, formUrlEncodedFormat, getBoundingClientRect, getTransformStyleString, getViewportOffset, handleErrorLog, handleHttpErrorLog, handleWarningLog, isApp, isArrayEmpty, isBlobEmpty, isClass, isDarkMode, isEmpty, isNumberEmpty, isObjectEmpty, isStringEmpty, isTextExcludes, isTextIncludes, messageFormat, transformFileSize, urlToImageElement };
