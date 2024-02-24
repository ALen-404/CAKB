import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Pagination, Table } from 'antd'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getC2cNotice, handleBuy, handleUploadPaymentVoucher } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { copyMsg } from '@/utils/formatter'

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
  const [isShowPwd, setIsPwd] = useState(false)
  const [noticeArr, setNoticeArr] = useState([])
  const [isPush, setIsPush] = useState(false)

  const [orderData, setOrderData] = useState<any>('')

  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const navigate = useNavigate()

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

  useEffect(() => {
    const currOrderDate = localStorage.getItem('currOrderDate')
    const isInitPush = localStorage.getItem('isPush')
    setIsPush(isInitPush === 'true')
    const initCurrOrderDate = JSON.parse(currOrderDate || '{}')
    console.log(initCurrOrderDate)

    setOrderData(initCurrOrderDate)
  }, [])

  useEffect(() => {
    getC2cNotice().then((res: any) => {
      setNoticeArr(res.data)
    })
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <LayoutElement>
      <div className="noticeWarp">
        <div className="noticeWarpTop">
          <LeftOutline
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="noticeWarpTopTitle">消息通知</p>
          <div></div>
        </div>
        <div className="noticeCon">
          {noticeArr.map((item: any) => {
            return (
              <div className="noticeItem">
                <div className="noticeItemTop">
                  <p>{JSON.parse(item || '{}')?.symbol}交易提醒</p>
                  <span>{formatDate(JSON.parse(item || '{}')?.Time)}</span>
                </div>
                <div className="noticeItemBot">
                  您有一筆{JSON.parse(item || '{}')?.symbol}交易狀態發生變化，請及時查看。
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
