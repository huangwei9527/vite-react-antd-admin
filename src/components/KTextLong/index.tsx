import React, { FC, useState } from 'react'
import classnames from 'classnames'
import { Tooltip } from 'antd'
import styles from './index.module.less'

interface IProps {
  value: string | React.ReactNode
  className?: string
  placement?: string
  stepWidth?: number // padding等需要减除的数值
}

const TextLong: FC<IProps> = ({ value, className, placement, stepWidth }) => {
  const [visible, setVisible] = useState(false)

  const onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const currentWidth = e.currentTarget.scrollWidth + (stepWidth ?? 0)
    const parentWidth = e.currentTarget.parentElement?.offsetWidth || 0

    if (currentWidth > parentWidth) {
      setVisible(true)
    }
  }

  const onMouseLeave = () => {
    setVisible(false)
  }

  return (
    <Tooltip title={value} placement={placement as any} visible={visible ? undefined : false}>
      <div
        className={classnames(styles.content, className)}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onFocus={() => 0}
      >
        {value}
      </div>
    </Tooltip>
  )
}

export default TextLong
