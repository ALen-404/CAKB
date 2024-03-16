import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, InputNumber, MenuProps, message, Pagination, Segmented, Table } from 'antd'
import { Popup, Tabs } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { erc20ABI, useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'
import { fetchFeeData, writeContract } from 'wagmi/actions'

import {
  getExchangePrice,
  getSellTradingByUser,
  getTopUpInfo,
  getTradingByUser,
  handleSwap,
  verifyPassword,
} from '@/apis'
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
  const [tradingData, setTradingData] = useState<any>('')
  const [segmentedValue, setSegmentedValue] = useState('99')
  const [isShowPwd, setIsPwd] = useState(false)
  const [payPwd, setPayPwd] = useState('')
  const [guessingType, setGuessingType] = useState('1')

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
    const type = localStorage.getItem('guessingType')
    setGuessingType(type || '1')

    if (address) {
      getExchangePrice({
        fromSymbol: guessingType == '1' ? 'GPO' : guessingType == '2' ? 'GPT' : 'GPTH',
        toSymbol: 'CGZ',
      })
        .then((res: any) => {
          if (res.code === 200) {
            console.log(res.data, 'setTradingData')
            setTradingData(res.data)
          } else {
            message.error(res.msg)
          }
        })
        .catch(() => {
          message.error('請求失敗')
        })
    }
  }, [address, guessingType, segmentedValue])

  const navigate = useNavigate()

  const navigateTo = () => {
    setTimeout(() => {
      navigate(-1)
    }, 300)
  }
  const [withdrawValue, setWithdrawValue] = useState('')

  const currAssets = localStorage.getItem('currAssets')
  const handleRecharge = async () => {
    verifyPassword({
      newPassword: payPwd,
      oldPassword: payPwd,
    })
      .then((res: any) => {
        if (res.code === 200) {
          handleSwap({
            quantity: new BigNumber(tradingData || 0).times(withdrawValue || 0).toString(),
            symbol: `CGZ/${guessingType == '1' ? 'GPO' : guessingType == '2' ? 'GPT' : 'GPTH'}`,
          })
            .then((res: any) => {
              if (res.code === 200) {
                message.success('充值成功')
                setIsPwd(false)
              } else {
                message.error(res.msg)
              }
            })
            .catch(() => {
              message.error('充值失敗')
            })
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
      <div className="rechargeBox">
        <div className="rechargeTop">
          <LeftOutline onClick={navigateTo} />
          <p className="rechargeTopTitle">充值</p>
          <div></div>
        </div>
        <div className="withdrawContent">
          <div className="withdrawContentItem">
            <p>積分數量</p>
            <InputNumber
              className="numInput"
              onChange={(e: any) => {
                setWithdrawValue(e)
              }}
              value={withdrawValue}
              type="text"
            />
          </div>
          <p className="payTips">
            您需支付：{new BigNumber(tradingData || 0).times(withdrawValue || 0).toString()} CGZ
          </p>
        </div>
        <div className="confirmBuy">
          <Button
            onClick={() => {
              setIsPwd(true)
            }}
            className="sureBtn"
          >
            充值
          </Button>
        </div>
        <Popup
          visible={isShowPwd}
          onMaskClick={() => {
            setIsPwd(false)
          }}
          onClose={() => {
            setIsPwd(false)
          }}
          bodyStyle={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            minHeight: '258px',
          }}
        >
          <div className="pwdBox">
            <div className="pwdBoxTop">
              <div></div>
              <p className="pwdBoxTopTitle">交易密碼</p>
              <p
                onClick={() => {
                  setIsPwd(false)
                }}
                className="pwdBoxTopCancel"
              >
                取消
              </p>
            </div>
            <input
              value={payPwd}
              onChange={(e) => {
                setPayPwd(e.target.value)
              }}
              type="password"
              placeholder="請輸入交易密碼"
              className="pwdBoxBot"
            />
            <Button
              onClick={() => {
                handleRecharge()
              }}
              className="sureBtn"
            >
              充值
            </Button>
          </div>
        </Popup>
      </div>
    </LayoutElement>
  )
}

export default Home
