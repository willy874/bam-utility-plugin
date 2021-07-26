export class SubScriber {
  public steps: Array<(data: unknown) => Promise<unknown>>
  private err: ((data: unknown) => Promise<unknown>) | undefined
  private end: (data: unknown) => Promise<unknown>

  constructor() {
    this.steps = []
    this.end = async () => {
      return
    }
  }

  public getErrorCallback(): ((data: unknown) => Promise<unknown>) | undefined {
    return this.err
  }

  public async runCompleteCallback(data: unknown): Promise<unknown> {
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

  run(first: unknown): Promise<unknown> {
    return new Promise((resolve: (data: unknown) => void, reject: (data: unknown) => void) => {
      const steps: Array<(data: unknown) => Promise<unknown>> = this.subscriber.steps
      steps.push(async (data: unknown) => {
        const completResult: unknown = await this.subscriber.runCompleteCallback(data)
        resolve(completResult)
        return completResult
      })
      const errorCallback: ((err: unknown) => void) | undefined = this.subscriber.getErrorCallback()
      const action = (index = 0, data: unknown = first): void => {
        if (steps[index]) {
          const promise: Promise<unknown> = steps[index](data)
          promise
            .then((res: unknown) => {
              action(index + 1, res)
            })
            .catch((err: unknown) => {
              if (errorCallback) errorCallback(err)
              reject(err)
            })
        }
      }
      action()
    })
  }
}
