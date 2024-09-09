import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getPageData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, Space } from 'antd'
import {
  ClusterOutlined,
  MailOutlined,
  ManOutlined,
  MobileOutlined,
  PhoneOutlined,
  TabletOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import defaultUserImg from '@/assets/images/default-header.jpg'
const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { userInfo } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    dispatch(getPageData())
  }, [])

  return (
    <div className={classnames('app-page1', styles.wrapper)}>
      <div className={styles.left}>
        <div className={styles.infoPanel}>
          <div className={styles.title}>基本信息</div>
          <div className={styles.content}>
            <div className={styles.userH}>
              <img src={systemInitData.avatar || defaultUserImg} alt="" />
            </div>
            <div className={styles.userName}>
              黄维{' '}
              <span className={styles.gender}>
                <ManOutlined />
              </span>
            </div>
            <div className={styles.userInfoDetail}>
              <div className={styles.label}>
                <UserOutlined />
                用户名
              </div>
              <div className={styles.value}>huangwei</div>
            </div>
            <div className={styles.userInfoDetail}>
              <div className={styles.label}>
                <MobileOutlined />
                手机
              </div>
              <div className={styles.value}>188****8888</div>
            </div>
            <div className={styles.userInfoDetail}>
              <div className={styles.label}>
                <MailOutlined />
                邮箱
              </div>
              <div className={styles.value}>12***44@qq.com</div>
            </div>
            <div className={styles.userInfoDetail}>
              <div className={styles.label}>
                <ClusterOutlined />
                部门
              </div>
              <div className={styles.value}>xxx部</div>
            </div>
            <div className={styles.userInfoDetail}>
              <div className={styles.label}>
                <TeamOutlined />
                角色
              </div>
              <div className={styles.value}>admin</div>
            </div>
          </div>
          <div className={styles.infoPanelFooter}>注册于 2024-080-12</div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.infoPanel}>
          <div className={styles.title}>安全设置</div>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.title}>其他信息</div>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.title}>其他信息2</div>
        </div>
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
