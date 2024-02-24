import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Pagination, Segmented, Table } from 'antd'
import { Popup, Tabs } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getSellTradingByUser, getTopUpInfo, getTradingByUser, getUserInfo, setPassword } from '@/apis'
import { LayoutElement } from '@/components/layout'

import Order from '../../assets/image/buy/order.png'
import Recive from '../../assets/image/buy/recive.png'
import Sale from '../../assets/image/buy/sale.png'
import Cgr from '../../assets/image/confirmOrder/cgr.png'
import Copy from '../../assets/image/confirmOrder/copy.png'
import BankCard from '../../assets/image/detailsOrder/bankCard.png'
import LeftArrow from '../../assets/image/swap/leftArrow.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [res, setRes] = useState<any>({})
  const [payPwdValue, setpayPwdValue] = useState('')
  const [payPwdAddress, setpayPwdAddress] = useState('')
  const [isShowSetPwd, setIsShowSetPwd] = useState(false)
  const [setedPwd, setSetedPwd] = useState('')

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)

    const hours = `0${date.getHours()}`.slice(-2)
    const minutes = `0${date.getMinutes()}`.slice(-2)
    const seconds = `0${date.getSeconds()}`.slice(-2)

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const navigate = useNavigate()

  const navigateTo = (item: any) => {
    setTimeout(() => {
      navigate(-1)
    }, 300)
  }

  useEffect(() => {
    const currOrderDate = localStorage.getItem('currAssets')
    const initCurrOrderDate = JSON.parse(currOrderDate || '{}')
    setRes(initCurrOrderDate)

    getUserInfo()
      .then((res: any) => {
        if (res.code === 200) {
          if (res?.data?.transactionPassword) {
            setSetedPwd(res?.data?.transactionPassword)
            setIsShowSetPwd(true)
          } else {
            setIsShowSetPwd(false)
          }
          // setOrderDate(res.data.records)
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }, [])

  const setPwdHandle = () => {
    if (payPwdAddress !== payPwdValue) {
      message.error('兩次輸入密碼不一致')
      return
    }
    setPassword({
      newPassword: payPwdAddress,
      oldPassword: payPwdValue,
    })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('設置成功')

          setTimeout(() => {
            navigate(-1)
          }, 300)
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }

  return (
    <LayoutElement>
      <div className="payPwdBox">
        <div className="payPwdTop">
          <LeftOutline onClick={navigateTo} />
          <p className="payPwdTopTitle">交易密碼</p>
          <div></div>
        </div>
        {isShowSetPwd ? (
          <div className="payPwdContent">
            <div className="payPwdContentItem">
              <p>交易密碼</p>
              <div className="herfLinkBox">
                <input type="password" disabled value={setedPwd} />
                <p
                  onClick={() => {
                    navigate('/mdfPayPwd')
                  }}
                  className="herfLink"
                >
                  修改交易密碼
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="payPwdContent">
              <div className="payPwdContentItem">
                <p>交易密碼</p>
                <input
                  type="password"
                  onChange={(e: any) => {
                    setpayPwdAddress(e.target.value)
                  }}
                  value={payPwdAddress}
                />
              </div>
              <div className="payPwdContentItem">
                <p>確認交易密碼</p>
                <input
                  onChange={(e: any) => {
                    setpayPwdValue(e.target.value)
                  }}
                  value={payPwdValue}
                  type="password"
                />
              </div>
            </div>

            <div className="confirmBuy">
              <div className="confirmBuyBox">
                <p className="confirmBuyBoxTitle">注意：這是交易密碼使用介紹</p>
              </div>
              <Button onClick={setPwdHandle} className="sureBtn">
                提交
              </Button>
            </div>
          </>
        )}
      </div>
    </LayoutElement>
  )
}

export default Home
