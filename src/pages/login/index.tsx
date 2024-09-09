import classNames from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import { Button, Form, Input, message, Spin } from 'antd'
import { KeyOutlined, LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import cavasBg2 from './canvasBg2.js'
import loginLeftImage from '../../assets/images/login-left.png'
import { useAppSelector } from '@/store/redux-hooks'
import { defaultThemeColor } from '@/const'
import awaitWrapper from '@/utils/awaitWrapper'
import { apiDoLogin, apiGetValidatecode } from './api'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateSystemInitDataAttr } from '@/store/modules/appSlice'

const Layout: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { themeColor } = useAppSelector(s => s.localCache)
  const [loading, setLoading] = useState(false)
  const [loadingCode, setLoadingCode] = useState(false)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    code: '',
    validateCode: ''
  })
  const [codeImage, setCodeImage] = useState('')
  useEffect(() => {
    // 初始化背景
    cavasBg2('login-bg', 'login-bg-inner')
    // 获取验证码
    getValidatecode()
  }, [])

  const handleFormValueChange = changedValues => {
    setFormData(pre => {
      return {
        ...pre,
        ...changedValues
      }
    })
  }
  // 登录
  const handleLogin = () => {
    form
      .validateFields()
      .then(() => {
        setLoading(true)
        apiDoLogin(formData)
          .then(res => {
            dispatch(
              updateSystemInitDataAttr({
                ...res.data.userInfo,
                permisson: res.data.permisson || []
              })
            )
            navigate('/home')
          })
          .finally(() => {
            setLoading(true)
          })
      })
      .catch(() => {
        message.error('请完善登录表单！')
      })
  }

  // 获取验证码
  const getValidatecode = async () => {
    setLoadingCode(true)
    handleFormValueChange({ code: '', validateCode: '' })
    const [err, res] = await awaitWrapper(apiGetValidatecode({}))
    if (err || !res?.data) {
      setLoadingCode(false)
      return
    }
    setCodeImage(res.data.image || '')
    handleFormValueChange({ validateCode: res.data.validateCode })
    setLoadingCode(false)
  }
  return (
    <div className={styles.wrapper}>
      <div id="login-bg" className={styles.loginBg}>
        <div id="login-bg-inner" className={styles.loginBgInner}></div>
      </div>
      <div className={styles.loginFormWrapper}>
        <div className={styles.loginFormLeft}>
          <img src={loginLeftImage} alt="" />
        </div>
        <div className={styles.loginFormRight}>
          <div className={styles.loginFormTitle}>hello !</div>
          <div className={styles.loginFormTitleTips}>欢迎来到xxxx管理系统！</div>
          <div className={styles.loginForm}>
            <Form form={form} name="basic" initialValues={{ remember: true }} onFieldsChange={handleFormValueChange}>
              <Form.Item name="username" rules={[{ required: true, message: '账号不能为空' }]}>
                <Input value={formData.username} className={styles.loginInput} size="large" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
                <Input.Password value={formData.password} className={styles.loginInput} size="large" prefix={<LockOutlined />} />
              </Form.Item>
              <div>
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: '验证码不能为空' }]}
                  className={classNames(styles.loginInput, styles.code)}
                >
                  <Input
                    value={formData.code}
                    className={styles.loginInput}
                    size="large"
                    prefix={<KeyOutlined />}
                    onPressEnter={handleLogin}
                  />
                </Form.Item>
                <div className={styles.codeImage}>
                  <div className={styles.inner} onClick={getValidatecode}>
                    {loadingCode && <Spin className={styles.codeImageLoading} indicator={<LoadingOutlined spin />} />}
                    {codeImage && <img src={codeImage} alt="" />}
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <div className={styles.loginOptBtn}>
            <Button
              onClick={handleLogin}
              loading={loading}
              className={classNames(styles.loginBtn, { [styles.isDefaultTheme]: themeColor === defaultThemeColor })}
              type="primary"
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
