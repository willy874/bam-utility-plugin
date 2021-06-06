class SubScriber {
  public steps: Array<(data: unknown) => Promise<unknown>>
  private err: ((data: unknown) => Promise<unknown>) | undefined
  private end: (data: unknown) => Promise<unknown>

  constructor() {
    this.steps = []
    this.end = async () => {
      return
    }
  }

  public getErrorCallback() {
    return this.err
  }

  public async runCompleteCallback(data: unknown) {
    return await this.end(data)
  }

  public next(callback: (data: unknown) => Promise<unknown>): void {
    this.steps.push(callback)
  }

  public error(callback: (data: unknown) => Promise<unknown>): void {
    this.err = callback
  }

  public complete(callback: (data: unknown) => Promise<unknown>): void {
    this.end = callback
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
    steps.push(async (data: unknown) => {
      return await this.subscriber.runCompleteCallback(data)
    })
    const errorCallback: ((err: unknown) => void) | undefined = this.subscriber.getErrorCallback()
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
