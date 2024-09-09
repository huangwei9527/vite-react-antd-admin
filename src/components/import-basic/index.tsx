import React, { FC, useState, useRef } from 'react'
import { Upload, message, Button } from 'antd'
import './index.less'

interface IProps {
  style?: object
  labelShow?: boolean //
  multiple?: boolean // 是否支持多选
  accept?: string // 支持的文件类型
  tips?: string // 上传组件中的文字提示语
  onFiles: (files: any[]) => void // 上传的文件数组
}

const Component: FC<IProps> = ({ multiple = true, labelShow = true, ...props }) => {
  const [fileList, setFileList] = useState([])
  const filesTotalSize = useRef(0)
  const state = {
    accept: props?.accept || '.xls, .xlsx',
    multiple,
    fileList,
    onRemove(file) {
      const index = fileList.findIndex(f => f.uid === file.uid)
      filesTotalSize.current -= file.size / 1024 / 1024
      setFileList(pre => {
        pre.splice(index, 1)
        props.onFiles([...pre])
        return [...pre]
      })
    },
    beforeUpload(file) {
      if (
        props.accept.split(', ').indexOf(`.${file.name.split('.')[file.name.split('.').length - 1].toLocaleLowerCase()}`) === -1
      ) {
        message.warning('不支持的上传文件，请重新选择')
        return false
      }
      let fileSize = file.size / 1024 / 1024
      if (fileSize > 20) {
        message.warning('单个文件大小不能超过20M，请重试')
        return false
      }
      if (multiple) {
        if (filesTotalSize.current + fileSize > 100) {
          message.warning('文件总大小不能超过100M，请重试')
          return false
        }
        filesTotalSize.current += fileSize
        setFileList(pre => {
          props.onFiles([...pre, file])
          return [...pre, file]
        })
      } else {
        setFileList(pre => {
          props.onFiles([file])
          return [file]
        })
      }
      return false
    }
  }

  const dragButton = (
    <div>
      <div className="tips jia">
        <i className="iconcool shangchuan"></i>
      </div>
      <div className="tips">点击或拖拽上传</div>
      <div className="tips small">{props.tips ? props.tips : `上传单个${state.accept}文件，文件大小小于20M`}</div>
    </div>
  )

  const renderClassName = () => {
    if (!multiple) {
      // 单个文件上传
      if (fileList.length > 0) {
        return 'app-import-basic-single-hasFile'
      }
    }
    return ''
  }

  return (
    <div style={props?.style} className={`app-import-basic ${renderClassName()}`}>
      {labelShow && <span className="label">导入文件：</span>}
      <Upload.Dragger {...state} style={{ width: '100%' }}>
        {dragButton}
      </Upload.Dragger>
    </div>
  )
}

export default Component
