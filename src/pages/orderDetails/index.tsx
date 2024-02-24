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

import { handleBuy, handleUploadPaymentVoucher } from '@/apis'
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
  const [isPush, setIsPush] = useState(false)

  const [orderData, setOrderData] = useState<any>('')

  const [timeLeft, setTimeLeft] = useState(30 * 60)

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
    setOrderData(initCurrOrderDate)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(timer)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  const navigate = useNavigate()

  const confirmPayment = () => {
    handleUploadPaymentVoucher({
      tid: orderData.id,
      urls: [localStorage.getItem('pushImg')],
    })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('等待賣家審核')
          navigate('/buyCGR')
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('購買失敗')
      })
  }

  return (
    <LayoutElement>
      <div className="orderDetailsWarp">
        <div className="orderDetailsWarpTop">
          <Link to={`/confirmOrder`}>
            <LeftOutline />
          </Link>
          <p className="orderDetailsWarpTopTitle">訂單詳情</p>
          <div></div>
        </div>
        <div className="orderDetailsWarpCon">
          <p className="orderDetailsWarpConTitle">請付款</p>
          <p className="orderDetailsWarpConTitleInfo">
            請在 <span>{formatTime(timeLeft)}</span> 內付款給賣家
          </p>
          <div className="orderDetailsWarpConBox">
            <div className="orderDetailsWarpConBoxTop">
              <img src={Cgr} alt="Cgr" />
              <p>
                <span>購買 </span>CGR
              </p>
            </div>
            <div className="orderDetailsWarpConTop">
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">總額</p>
                <p className="cellValue">
                  $ {new BigNumber(orderData.amount || 0).times(orderData.price || 0).toFixed(2)}
                </p>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">單價</p>
                <p className="cellValueTwo">$ {new BigNumber(orderData.price || 0).toFixed(2)}</p>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">數量</p>
                <p className="cellValueTwo">{orderData.amount} CGR</p>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">訂單號</p>
                <div className="cellValueBox">
                  <p>{orderData.id}</p>
                  <img
                    onClick={() => {
                      copyMsg(orderData.id, '複製成功')
                    }}
                    src={Copy}
                    alt="Copy"
                  />
                </div>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">賣家地址</p>
                <div className="cellValueBox">
                  <p>
                    {orderData.fromAddress?.slice(0, 4)}...
                    {orderData.fromAddress?.slice(orderData.fromAddress?.length - 4, orderData.fromAddress?.length)}
                  </p>
                  <img
                    onClick={() => {
                      copyMsg(orderData.fromAddress, '複製成功')
                    }}
                    src={Copy}
                    alt="Copy"
                  />
                </div>
              </div>
            </div>
            <div className="orderDetailsWarpConBot">
              <div className="orderDetailsWarpConBotSelect">
                <p className="cellTitle">選擇支付方式</p>
                <div className="cellValueSelect">
                  <img className="BankCard" src={BankCard} alt="BankCard" />
                  <p>銀行卡1</p>
                  <img src={LeftArrow} alt="LeftArrow" />
                </div>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">收款人姓名</p>
                <div className="cellValueBox">
                  <p>{orderData.realName}</p>
                  <img
                    onClick={() => {
                      copyMsg(orderData.realName, '複製成功')
                    }}
                    src={Copy}
                    alt="Copy"
                  />
                </div>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">銀行帳號/卡號</p>
                <div className="cellValueBox">
                  <p>{orderData.collectionAccount}</p>
                  <img
                    onClick={() => {
                      copyMsg(orderData.collectionAccount, '複製成功')
                    }}
                    src={Copy}
                    alt="Copy"
                  />
                </div>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">銀行名稱</p>
                <p className="cellValueTwo">{orderData.bankName}</p>
              </div>
              <div className="orderDetailsWarpConCell">
                <p className="cellTitle">下單時間</p>
                <p className="cellValueTwo">{formatDate(orderData.startTime)}</p>
              </div>
            </div>
            <div className="orderDetailsWarpConFooter">
              <p className="ConFooterLeft">上傳支付憑證</p>
              <Link to={'/upload'}>
                <div className="ConFooterRight">
                  {isPush ? <p className="pushed">已上傳</p> : <p>未上傳</p>}

                  <img src={LeftArrow} alt="LeftArrow" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="confirmBuy">
          <Link to={'/buyCGR'}>
            <Button className="cancelOrder">取消訂單</Button>
          </Link>
          <Button disabled={!isPush} onClick={confirmPayment} className={isPush ? 'sureBtn' : 'sureBtn disBtn'}>
            我已付款成功
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
            <input placeholder="請輸入交易密碼" className="pwdBoxBot" type="text" />
            <Button
              onClick={() => {
                setIsPwd(true)
              }}
              className="sureBtn"
            >
              资产不足
            </Button>
          </div>
        </Popup>
      </div>
    </LayoutElement>
  )
}

export default Home
