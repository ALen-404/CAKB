import { message } from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi'

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import routes from '~react-pages'

import { getUserInfo, loginDapp } from './apis'

import './react-i18next/i18n'

function Redirect({ to }: { to: string }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

function App() {
  const { toasts } = useToast()
  const { address, isConnected } = useAccount()
  const location = useLocation()
  const [parAddress, setParAddress] = useState('')
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()

  useEffect(() => {
    if (chain?.id !== 56 && switchNetwork) {
      switchNetwork(56)
    }
  }, [chain?.id, switchNetwork])
  useEffect(() => {
    // 解析URL参数
    const params = new URLSearchParams(location.search)
    const addressParam = params.get('address')

    // 检查参数是否存在
    if (addressParam) {
      // 参数存在时的处理逻辑
      setParAddress(addressParam)
    } else {
      // 参数不存在时的处理逻辑
      console.log('Address parameter does not exist.')
    }
  }, [location.search])

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'CGR:LOGIN',
  })
  useEffect(() => {
    if (!address) {
      return
    }

    if (address !== localStorage.getItem('signAddress')) {
      signMessage()
      localStorage.setItem('signAddress', address)
      return
    }
    getUserInfo()
      .then((res: any) => {
        if (res.code === 200) {
          localStorage.setItem('signAddress', address)
          // setOrderDate(res.data.records)
        } else {
          signMessage()
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }, [signMessage, address])

  useEffect(() => {
    if (isSuccess) {
      loginDapp({
        parentAddr: parAddress,
        sign: data,
        userAddr: address,
      }).then((res: any) => {
        if (res.code === 200) {
          console.log(res.data)
          localStorage.setItem('authorization', res.data?.loginToken)
        } else {
          message.error(res.msg)
        }
      })
    }
  }, [address, data, isSuccess, parAddress])
  return (
    <>
      {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
      <ToastProvider duration={2000}>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    </>
  )
}

export default App
