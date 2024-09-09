class AsyncJob {
  private maxReqNum: number // 最大异步任务数目

  private currentReqNum: number = 0 // 当前的异步任务数目

  private readyJobs: Array<() => Promise<any>> = [] // 待执行的异步任务

  constructor(maxNumber: number) {
    this.maxReqNum = maxNumber
  }

  setMaxReqNum(num: number) {
    this.maxReqNum = Math.max(num, this.maxReqNum)
  }

  execute = (asyncJob: () => Promise<any>) => {
    if (this.currentReqNum < this.maxReqNum) {
      this.currentReqNum++
      asyncJob().finally(() => {
        this.currentReqNum--
        const job = this.readyJobs.shift()
        if (job) {
          this.execute(job)
        }
      })
    } else {
      this.readyJobs.push(asyncJob)
    }
  }
}

export default AsyncJob
