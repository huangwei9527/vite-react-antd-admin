import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getPageData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, Space } from 'antd'
import welcome from '@/assets/images/welcome.png'

const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { loading } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    dispatch(getPageData())
  }, [])

  return (
    <div className={classnames('app-page1', styles.wrapper)}>
      <img src={welcome} alt="welcome" />
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
