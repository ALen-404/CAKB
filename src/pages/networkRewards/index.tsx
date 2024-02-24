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

import { getDictyosome, getRewardRecord, getSellTradingByUser, getTradingByUser } from '@/apis'
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
  const [record, setRecord] = useState([])
  const [netData, setNetData] = useState<any>({})

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

  useEffect(() => {
    if (address) {
      getRewardRecord({ type: 7 })
        .then((res: any) => {
          if (res.code === 200) {
            console.log(res.data)

            setRecord(res.data.records)
          } else {
            message.error(res.msg)
            navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          navigate('/')
        })

      getDictyosome()
        .then((res: any) => {
          if (res.code === 200) {
            setNetData(res.data)
          } else {
            message.error(res.msg)
          }
        })
        .catch(() => {
          message.error('請求失敗')
        })
    }
  }, [address, navigate])

  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    setTimeout(() => {
      navigate('/mySellDetails')
    }, 300)
  }

  return (
    <LayoutElement>
      <div className="netRewards">
        <div className="netRewardsTop">
          <LeftOutline
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="netRewardsTopTitle">網體獎勵</p>
          <div></div>
        </div>
        <div className="netRewardCon">
          <div className="netRewardConTop">
            <div className="netRewardConTopItem">
              <p className="netRewardConTopItemTitle">矩陣人數</p>
              <p className="netRewardConTopItemNum">{netData?.activeUser}</p>
            </div>
            <div className="netRewardConTopItem">
              <p className="netRewardConTopItemTitle">網體級別</p>
              <p className="netRewardConTopItemNum">{netData?.grade}</p>
            </div>
            <div className="netRewardConTopItem">
              <p className="netRewardConTopItemTitle">分紅比例</p>
              <p className="netRewardConTopItemNum">{netData?.incentiveRatio}</p>
            </div>
            <div className="netRewardConTopItem">
              <p className="netRewardConTopItemTitle">網體總分紅</p>
              <p className="netRewardConTopItemNum">{netData?.netReward}</p>
            </div>
          </div>
          <div className="netRewardConBot">
            <div className="netRewardConBotTop">
              <div className="topItem">
                <p>日期</p>
              </div>
              <div className="topItem">
                <p>級別</p>
              </div>
              <div className="topItem">
                <p>網體分紅</p>
              </div>
            </div>
            <div className="netRewardConBotBot">
              {record.map((item: any) => {
                return (
                  <div className="netRewardConBotBotItem">
                    <p>{formatDate(item.addTime)}</p>
                    <p>國代網體</p>
                    <p>{item.amount}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <p></p>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
