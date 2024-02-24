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

import { getSellTradingByUser, getTopUpInfo, getTradingByUser, getWithdrawSx, withdrawAssets } from '@/apis'
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
  const [withdrawValue, setWithdrawValue] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawGas, setWithdrawGas] = useState('')

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
    getWithdrawSx()
      .then((resPon: any) => {
        if (resPon.code === 200) {
          setWithdrawGas(resPon.data)
        } else {
          message.error(resPon.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
    setRes(initCurrOrderDate)
  }, [])

  const handleWithdrawAssets = () => {
    withdrawAssets({
      symbol: res.symbol,
      quantity: withdrawValue,
    })
      .then((resPon: any) => {
        if (resPon.code === 200) {
          setWithdrawValue('0')
          message.success('請求成功')
        } else {
          message.error(resPon.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }

  return (
    <LayoutElement>
      <div className="withdrawBox">
        <div className="withdrawTop">
          <LeftOutline onClick={navigateTo} />
          <p className="withdrawTopTitle">提幣</p>
          <div></div>
        </div>
        <div className="withdrawContent">
          <div className="withdrawContentItem">
            <p>地址</p>
            <input
              type="text"
              onChange={(e: any) => {
                setWithdrawAddress(e.target.value)
              }}
              disabled
              value={address}
            />
          </div>
          <div className="withdrawContentItem">
            <p>數量</p>
            <input
              onChange={(e: any) => {
                setWithdrawValue(e.target.value)
              }}
              value={withdrawValue}
              type="text"
            />
            <p
              className="withdrawContentMax"
              onClick={() => {
                setWithdrawValue(res.usable)
              }}
            >
              最大
            </p>
          </div>
          <p className="withdrawContentItemText">可用數量：{res.usable}</p>
        </div>

        <div className="confirmBuy">
          <div className="confirmBuyBox">
            <p className="confirmBuyBoxTitle">到賬數量 {new BigNumber(withdrawValue || '0').times(0.97).toString()} </p>
            <p>手續費 {new BigNumber(withdrawGas).times(100).toString()}%</p>
          </div>
          <Button onClick={handleWithdrawAssets} className="sureBtn">
            確認提幣
          </Button>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
