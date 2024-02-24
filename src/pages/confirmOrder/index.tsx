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

import { handleBuy } from '@/apis'
import { LayoutElement } from '@/components/layout'

import Order from '../../assets/image/buy/order.png'
import Recive from '../../assets/image/buy/recive.png'
import Sale from '../../assets/image/buy/sale.png'
import Cgr from '../../assets/image/confirmOrder/cgr.png'
import Copy from '../../assets/image/confirmOrder/copy.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [orderData, setOrderData] = useState<any>('')
  const location = useLocation()

  const navigate = useNavigate()
  useEffect(() => {
    const currOrderDate = localStorage.getItem('currOrderDate')
    const initCurrOrderDate = JSON.parse(currOrderDate || '{}')
    setOrderData(initCurrOrderDate)
  }, [])

  const redirectToReceiver = () => {
    handleBuy({ tid: orderData.id }).then((res: any) => {
      if (res.code === 200) {
        navigate(`/orderDetails`)
      } else {
        message.error(res.msg)
      }
    })
  }
  return (
    <LayoutElement>
      <div className="confirmWrap">
        <div className="confirmWrapTop">
          <Link to={`/buyCGR`}>
            <LeftOutline />
          </Link>
          <p className="confirmWrapTopTitle">確認訂單</p>
          <div></div>
        </div>
        <div className="confirmWrapCon">
          <p className="confirmWrapConTitle">確認購買信息</p>
          <div className="confirmWrapConBox">
            <div className="confirmWrapConBoxTop">
              <img src={Cgr} alt="Cgr" />
              <p>
                <span>購買 </span>CGR
              </p>
            </div>
            <div className="confirmWrapConCell">
              <p className="cellTitle">總額</p>
              <p className="cellValue">
                $ {new BigNumber(orderData.amount || 0).times(orderData.price || 0).toFixed(2)}
              </p>
            </div>
            <div className="confirmWrapConCell">
              <p className="cellTitle">單價</p>
              <p className="cellValueTwo">$ {new BigNumber(orderData.price || 0).toFixed(2)}</p>
            </div>
            <div className="confirmWrapConCell">
              <p className="cellTitle">數量</p>
              <p className="cellValueTwo">{orderData.amount}</p>
            </div>
            <div className="confirmWrapConCell">
              <p className="cellTitle">賣家地址</p>
              <div className="cellValueBox">
                <p>
                  {orderData.fromAddress?.slice(0, 4)}...
                  {orderData.fromAddress?.slice(orderData.fromAddress?.length - 4, orderData.fromAddress?.length)}
                </p>
                <img src={Copy} alt="Copy" />
              </div>
            </div>
          </div>
        </div>

        <div className="confirmBuy">
          <Button onClick={redirectToReceiver} className="sureBtn">
            确认购买
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
