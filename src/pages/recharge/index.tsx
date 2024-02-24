import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Pagination, Segmented, Table } from 'antd'
import { Popup, Tabs } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { erc20ABI, useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'
import { fetchFeeData, writeContract } from 'wagmi/actions'

import { getSellTradingByUser, getTopUpInfo, getTradingByUser } from '@/apis'
import { erc20TokenABI } from '@/apis/erc20TokenABI'
import { LayoutElement } from '@/components/layout'
import { copyMsg } from '@/utils/formatter'
import useTransfer from '@/utils/use-transfer'

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
  const [tradingData, setTradingData] = useState<any>({})
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
  useEffect(() => {
    if (address) {
      getTopUpInfo()
        .then((res: any) => {
          if (res.code === 200) {
            console.log(res.data)
            setTradingData(res.data)
          } else {
            message.error(res.msg)
          }
        })
        .catch(() => {
          message.error('請求失敗')
        })
    }
  }, [address, segmentedValue])

  const navigate = useNavigate()

  const navigateTo = () => {
    setTimeout(() => {
      navigate(-1)
    }, 300)
  }
  const [withdrawValue, setWithdrawValue] = useState('')

  const currAssets = localStorage.getItem('currAssets')
  const initCurrAssets = JSON.parse(currAssets || '')
  const onTransfer = useTransfer({
    value: withdrawValue || '0',
    tokenAddress: initCurrAssets.contractAddr,
    sendAddress: tradingData.address,
  })
  const handleRecharge = async () => {
    onTransfer()
  }

  return (
    <LayoutElement>
      <div className="rechargeBox">
        <div className="rechargeTop">
          <LeftOutline onClick={navigateTo} />
          <p className="rechargeTopTitle">充幣</p>
          <div></div>
        </div>
        {/* <div className="rechargeContent">
          <div className="rechargeContentItem">
            <p>充幣地址</p>
            <div
              onClick={() => {
                copyMsg(res?.address, '複製成功')
              }}
              className="rechargeAddressBox"
            >
              <p>{res?.address}</p>
              <img src={Copy} alt="" />
            </div>
          </div>
          <div className="rechargeContentItem">
            <p>充幣地址二維碼</p>
            <div className="rechargeAddressImgBox">
              <img src={'data:image/png;base64,' + res?.addressCode} alt="" />
            </div>
          </div>
        </div> */}
        <div className="withdrawContent">
          <div className="withdrawContentItem">
            <p>數量</p>
            <input
              onChange={(e: any) => {
                setWithdrawValue(e.target.value)
              }}
              value={withdrawValue}
              type="text"
            />
          </div>
        </div>
        <div className="confirmBuy">
          <Button onClick={handleRecharge} className="sureBtn">
            確認充值
          </Button>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
