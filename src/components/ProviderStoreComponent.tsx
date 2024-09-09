import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
import ProviderAntdConfig from './ProviderAntdConfig'
export default Component => (props: any) => {
  let PComponent = ProviderAntdConfig(Component)
  return (
    <ReduxProvider store={store}>
      <PComponent {...props} />
    </ReduxProvider>
  )
}
