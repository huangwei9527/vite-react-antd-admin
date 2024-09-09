import { DialogBase } from '../dialog-info'

export default function DialogPromiseConfirm(opt): Promise<boolean> {
  return new Promise(resolve => {
    DialogBase({
      ...opt,
      onOk: next => {
        next(true)
        resolve(true)
      },
      onCancel() {
        resolve(false)
      }
    })
  })
}
