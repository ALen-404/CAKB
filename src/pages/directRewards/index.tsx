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

import { getRewardRecord, getSellTradingByUser, getTradingByUser } from '@/apis'
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
  const [record, setRecord] = useState<any>([])

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
      getRewardRecord({ type: 6 })
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
          <p className="netRewardsTopTitle">直推獎劉</p>
          <div></div>
        </div>
        <div className="netRewardCon">
          <div className="netRewardConBot">
            <div className="netRewardConBotTop">
              <div className="topItem">
                <p>地址</p>
              </div>
              {/* <div className="topItem">
                <p>代數</p>
              </div> */}
              {/* <div className="topItem">
                <p>質押數量</p>
              </div> */}
              <div className="topItem">
                <p>獎勵</p>
              </div>
            </div>
            <div className="netRewardConBotBot">
              {record.map((item: any) => {
                return (
                  <div className="netRewardConBotBotItem">
                    <p>
                      {item?.address?.slice(0, 4)}...
                      {item?.address?.slice(item?.address?.length - 4, item?.address?.length)}
                    </p>
                    {/* <p>一代</p> */}
                    {/* <p>11222.33</p> */}
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
