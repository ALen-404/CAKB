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

import { getSellTradingByUser, getTradingByUser } from '@/apis'
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
  const [tradingData, setTradingData] = useState([])
  const [segmentedValue, setSegmentedValue] = useState('99')

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
  let navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getSellTradingByUser({ status: segmentedValue })
        .then((res: any) => {
          if (res.code === 200) {
            setTradingData(res.data.records)
          } else {
            message.error(res.msg)
            navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          navigate('/')
        })
    }
  }, [address, navigate, segmentedValue])

  const getStatus = (status: any) => {
    switch (status) {
      case 1:
        return <p style={{ color: 'rgba(235, 168, 12, 1)' }}>待匹配</p>
      case 2:
        return <p style={{ color: 'rgba(81, 100, 191, 1)' }}>等待買家付款</p>
      case 3:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>待放行</p>
      case 4:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>已完成</p>
      case 5:
        return '已取消'
      case 6:
        return <p style={{ color: 'rgba(255, 0, 86, 1)' }}>申訴中</p>
      default:
        return <p style={{ color: 'rgba(235, 168, 12, 1)' }}>待匹配</p>
    }
  }

  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    setTimeout(() => {
      navigate('/mySellDetails')
    }, 300)
  }

  return (
    <LayoutElement>
      <div className="mySell">
        <div className="mySellTop">
          <Link to={'/buyCGR'}>
            <LeftOutline />
          </Link>
          <p className="mySellTopTitle">我的出售</p>
          <div></div>
        </div>
        <div className="mySellCon">
          <Segmented
            onChange={(val) => {
              setSegmentedValue(val.toString())
            }}
            options={[
              { label: '進行中', value: '99' },
              { label: '已完成', value: '4' },
            ]}
          />
          {tradingData.map((item: any) => {
            return (
              <div
                onClick={() => {
                  navigateTo(item)
                }}
                className="mySellConItem"
              >
                <div className="mySellConItemTop">
                  <p className="mySellConItemTopLeft">
                    單價 <span>$ {new BigNumber(item.price).toFixed(2)}</span>
                  </p>
                  <p className="mySellConItemTopRight">{getStatus(item.status)}</p>
                </div>
                <p className="mySellNum">
                  數量 <span>{item.amount} CGR</span>
                </p>
                <p className="mySellTime">發佈時間：{formatDate(item.startTime)}</p>
              </div>
            )
          })}
        </div>

        <div className="confirmBuy">
          <Link className="sureBtn" to="/pushSell">
            <Button className="sureBtn">發佈出售</Button>
          </Link>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
