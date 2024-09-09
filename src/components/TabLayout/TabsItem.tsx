import React, { FC, useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.less'

const TabsItem = props => {
  const { isActive, children } = props
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!hasLoaded && isActive) {
      setHasLoaded(true)
    }
  }, [isActive])

  return <div className={classNames(styles.tabsItemWrapper, {[styles.isActive]: isActive})}>{hasLoaded ? children : null}</div>
}

TabsItem.defaultProps = {
  isActive: false
}
TabsItem.displayName = 'TabsItem'
export default TabsItem
