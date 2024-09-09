import React, { FC } from 'react'
import styles from './index.module.less'

const FilterRefresh: FC<any> = props => {
  return (
    <div {...props} className={styles.refresh}>
      <i className="iconfont icon-shuaxin" /> {props?.label || '刷新'}
    </div>
  )
}

export default FilterRefresh
