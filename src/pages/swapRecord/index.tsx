import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Input, message, Pagination, Table } from 'antd'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link } from 'react-router-dom'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getExchangeRecord } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import Cgz from '../../assets/image/assets/cgz.png'
import Cgr from '../../assets/image/swap/cgr.png'
import DownArrow from '../../assets/image/swap/downArrow.png'
import LeftArrow from '../../assets/image/swap/leftArrow.png'
import Price from '../../assets/image/swap/price.png'
import SwapImg from '../../assets/image/swap/swap.png'
import Usdt from '../../assets/image/swap/usdt.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [swapRecord, setSwapRecord] = useState<any>([])

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

  const getStatus = (status: any) => {
    switch (status) {
      case 1:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>交易成功</p>
      case 2:
        return <p style={{ color: 'rgba(255, 0, 11, 1)' }}>交易失敗</p>
      default:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>交易成功</p>
    }
  }

  const getCoin = (symbol: any) => {
    switch (symbol) {
      case 'USDT':
        return {
          icon: Usdt,
        }
      case 'CGR':
        return {
          icon: Cgr,
        }
      case 'CGZ':
        return {
          icon: Cgz,
        }
      default:
        return {
          icon: Usdt,
        }
    }
  }

  useEffect(() => {
    getExchangeRecord().then((res: any) => {
      setSwapRecord(res.data.records.filter((item: any) => item.toSymbol !== 'GPO' && item.formSymbol !== 'GPO'))
    })
  }, [])
  return (
    <LayoutElement>
      <div className="swapWrap">
        <div className="recordBox">
          <div className="recordTop">
            <Link to={'/swap'}>
              <LeftOutline />
            </Link>
            <p className="recordTopTitle">兌換記錄</p>
            <div></div>
          </div>
          {swapRecord.map((item: any) => {
            return (
              <div className="recordCon">
                <div className="recordConCell">
                  <p className="recordConCellTitle">消耗</p>
                  <img src={getCoin(item.formSymbol).icon} alt="usdt" />
                  <p>
                    {item.fromAmount} {item.formSymbol}
                  </p>
                </div>
                <div className="recordConCell recordConCell2">
                  <p className="recordConCellTitle">消耗</p>
                  <img src={getCoin(item.toSymbol).icon} alt="usdt" />
                  <p>
                    {item.toAmount} {item.toSymbol}
                  </p>
                </div>
                <div className="recordConBot">
                  <p className="time">{formatDate(item.addtime)}</p>
                  <div className="status">{getStatus(item.status)}</div>
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
