import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Input, MenuProps, message, Pagination, Radio, RadioChangeEvent, Table } from 'antd'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getPaymentMethod, pushSell, setMail } from '@/apis'
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
  const [isShowPwd, setIsPwd] = useState(false)
  const [isChooseEmail, setIsChooseEmail] = useState(false)
  const [paymentMethodArr, setPaymentMethod] = useState<any[]>([])

  const [isShowNotice, setIsNotice] = useState(2)
  const [sellPrice, setSellPrice] = useState('')
  const [sellNum, setSellNum] = useState('')
  const [pmId, setPmId] = useState<any>('')
  const [email, setEmail] = useState<any>('')

  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues)
    setPmId(checkedValues[0])
  }

  const handleChangeNotice = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
    if (e.target.value === 1) {
      setIsChooseEmail(true)
    }
    setIsNotice(e.target.value)
  }

  const handleChangeSellPrice = (e: any) => {
    setSellPrice(e.target.value)
  }
  const handleChangeSellNum = (e: any) => {
    setSellNum(e.target.value)
  }

  const handlePush = () => {
    pushSell({
      isMail: isShowNotice,
      pmId: pmId,
      quantity: sellNum,
    }).then((res: any) => {
      if (res.code === 200) {
        message.success('發佈成功')
        setIsChooseEmail(false)
        setTimeout(() => {
          navigate(-1)
        }, 100)
      } else {
        message.error(res.msg)
      }
    })
  }

  const handleSetMail = () => {
    setMail({
      mail: email,
    }).then((res: any) => {
      if (res.code === 200) {
        handlePush()
      } else {
        message.error(res.msg)
      }
    })
  }
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getPaymentMethod().then(async (res: any) => {
        if (res.code === 200) {
          console.log(res.data)
          const data = await res.data.map((item: any, idx: any) => {
            return {
              label: (
                <div className="optionsLabel">
                  <div className="optionsLabelLeft">
                    <img src={BankCard} alt="BankCard" />
                    <p>{item.bankName}</p>
                  </div>
                  <div
                    onClick={() => {
                      navigate(
                        `/modifiBank?id=${item.id}&name=${item.realName}&cardId=${item.collectionAccount}&bank=${item.bankName}`
                      )
                    }}
                    className="optionsLabelRight"
                  >
                    <p>查看</p>
                    <img src={LeftArrow} alt="LeftArrow" />
                  </div>
                </div>
              ),
              value: item.id,
            }
          })
          console.log(data)

          setPaymentMethod(data)
        } else {
          message.error(res.msg)
          navigate('/')
        }
      })
    }
  }, [address, navigate])

  return (
    <LayoutElement>
      <div className="pushSellWrap">
        <div className="pushSellWrapTop">
          <Link to={'/mySell'}>
            <LeftOutline />
          </Link>
          <p className="pushSellWrapTopTitle">發佈出售訂單</p>
          <div></div>
        </div>
        <div className="pushSellWrapCon">
          {/* <p className="pushSellTitle">單價</p>
          <Input
            className="pushSellPriceIpt"
            onChange={handleChangeSellPrice}
            suffix="$"
            value={sellPrice}
            placeholder="請輸入單價"
          /> */}
          <div className="pushSellNum">
            <p className="pushSellNumTitle">數量</p>
            <p className="pushSellGetTitle">預計獲取 ${new BigNumber(sellPrice || 0).times(sellNum || 0).toFixed(2)}</p>
          </div>
          <Input
            onChange={handleChangeSellNum}
            className="pushSellPriceIpt"
            suffix="CGR"
            value={sellNum}
            placeholder="請輸入數量"
          />
          <p className="pushSellPaymentMethod">選擇收款方式</p>
          <div className="checkBoxPayment">
            <Checkbox.Group options={paymentMethodArr} defaultValue={[]} onChange={onChange} />
          </div>
          <div className="changeNoticeBox">
            <Radio.Group onChange={handleChangeNotice} value={isShowNotice}>
              <Radio value={1}>匹配成功通知</Radio>
            </Radio.Group>
          </div>
          <p className="tipsBox">（匹配成功後將發送消息至您的郵箱，請及時查收郵箱信息）</p>
        </div>

        <div className="confirmBuy">
          <Button onClick={handlePush} className="sureBtn">
            發佈
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
        <Popup
          visible={isChooseEmail}
          onMaskClick={() => {
            setIsChooseEmail(false)
            setIsNotice(2)
          }}
          onClose={() => {
            setIsChooseEmail(false)
            setIsNotice(2)
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
              <p className="pwdBoxTopTitle">郵箱地址</p>
              <p
                onClick={() => {
                  setIsChooseEmail(false)
                  setIsNotice(2)
                }}
                className="pwdBoxTopCancel"
              >
                取消
              </p>
            </div>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              placeholder="請輸入郵箱地址"
              className="pwdBoxBot"
              type="email"
            />
            <Button onClick={handleSetMail} className="sureBtn">
              確認添加郵箱
            </Button>
          </div>
        </Popup>
      </div>
    </LayoutElement>
  )
}

export default Home
