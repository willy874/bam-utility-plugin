class SubScriber {
  steps: Array<() => Promise<unknown>>
  err: (() => unknown) | undefined

  constructor() {
    this.steps = []
  }

  next(callback: () => Promise<unknown>): void {
    this.steps.push(callback)
  }

  error(callback: () => Promise<unknown>): void {
    this.err = callback
  }
}

export class Observable {
  subscriber: SubScriber

  constructor(init: (callback: SubScriber) => void) {
    this.subscriber = new SubScriber()
    init(this.subscriber)
  }

  run(): void {
    const steps: Array<(data: unknown) => Promise<unknown>> = this.subscriber.steps
    const errorCallback: ((err: unknown) => void) | undefined = this.subscriber.err
    const action = (index = 0, data: unknown = undefined): void => {
      if (steps[index]) {
        const promise: Promise<unknown> = steps[index](data)
        promise
          .then((res: unknown) => {
            action(index + 1, res)
          })
          .catch((err: unknown) => {
            if (errorCallback) errorCallback(err)
          })
      }
    }
    action()
  }
}
