import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Input, MenuProps, message, Pagination, Radio, RadioChangeEvent, Table } from 'antd'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getPaymentMethod } from '@/apis'
import { LayoutElement } from '@/components/layout'

import Order from '../../assets/image/buy/order.png'
import Recive from '../../assets/image/buy/recive.png'
import Sale from '../../assets/image/buy/sale.png'
import Cgr from '../../assets/image/confirmOrder/cgr.png'
import Copy from '../../assets/image/confirmOrder/copy.png'
import BankCard from '../../assets/image/detailsOrder/bankCard.png'
import MethodNo from '../../assets/image/paymentMethod/methodNo.png'
import Modifi from '../../assets/image/paymentMethod/modefi.png'
import LeftArrow from '../../assets/image/swap/leftArrow.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [paymentMethodArr, setPaymentMethod] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getPaymentMethod()
        .then((res: any) => {
          if (res.code === 200) {
            setPaymentMethod(res.data)
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

  return (
    <LayoutElement>
      <div className="paymentMethod">
        <div className="paymentMethodTop">
          <LeftOutline
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="paymentMethodTopTitle">收款方式</p>
          <div></div>
        </div>
        <div className="paymentMethodCon">
          {paymentMethodArr.length > 0 ? (
            <div className="conBox">
              {paymentMethodArr.map((item, idx) => {
                return (
                  <div className="conItem">
                    <div className="conItemTop">
                      <div className="conItemTopLeft">
                        <img src={BankCard} alt="BankCard" />
                        <p>{item.bankName}</p>
                      </div>
                      <div className="conItemTopRight">
                        <Link
                          to={`/modifiBank?id=${item.id}&name=${item.realName}&cardId=${item.collectionAccount}&bank=${item.bankName}`}
                        >
                          <img src={Modifi} alt="BankCard" />
                        </Link>
                      </div>
                    </div>
                    <div className="conItemBot">
                      <p className="name">{item.realName}</p>
                      <p className="id">{item.collectionAccount}</p>
                      <p className="bank">{item.bankName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="MethodNoBox">
              <img className="MethodNo" src={MethodNo} alt="MethodNo" />
            </div>
          )}
        </div>

        <div className="confirmBuy">
          <Link to={'/addBankCard'} className="sureBtn">
            <Button className="sureBtn">添加收款方式</Button>
          </Link>
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
