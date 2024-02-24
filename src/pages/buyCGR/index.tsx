import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Modal, Pagination, Table } from 'antd'
import { Popup } from 'antd-mobile'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getTrading, getUserInfo } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import Order from '../../assets/image/buy/order.png'
import Recive from '../../assets/image/buy/recive.png'
import Sale from '../../assets/image/buy/sale.png'
import Search from '../../assets/image/buy/search.png'
import SortTop from '../../assets/image/buy/sortTop.png'
import DownArrow from '../../assets/image/swap/downArrow.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [isShowSetPwd, setIsShowSetPwd] = useState(false)
  const [isShowSetPayMethod, setIsShowSetPayMethod] = useState(false)
  const [orderDate, setOrderDate] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getTrading()
        .then((res: any) => {
          if (res.code === 200) {
            console.log(res.data)
            setOrderDate(res.data.records.filter((item: any) => item.fromAddress !== address))
          } else {
            message.error(res.msg)
            navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          navigate('/')
        })

      getUserInfo()
        .then((res: any) => {
          if (res.code === 200) {
            console.log(res.data)
            if (res?.data?.paymentMethods?.length > 0) {
              setIsShowSetPayMethod(false)
            } else {
              setIsShowSetPayMethod(true)
            }
            if (res?.data?.transactionPassword) {
              setIsShowSetPwd(false)
            } else {
              setIsShowSetPwd(true)
            }
            // setOrderDate(res.data.records)
          } else {
            message.error(res.msg)
          }
        })
        .catch(() => {
          message.error('請求失敗')
        })
    }
  }, [address, navigate, setIsShowSetPayMethod])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to={'/myOrder'}>我的訂單</Link>,
      icon: (
        <img
          style={{
            width: '21px',
            marginRight: '7px',
          }}
          src={Order}
          alt="Order"
        ></img>
      ),
    },
    {
      key: '2',
      label: <Link to={'/paymentMethod'}>收款方式</Link>,
      icon: (
        <img
          style={{
            width: '21px',
            marginRight: '7px',
          }}
          src={Recive}
          alt="Order"
        ></img>
      ),
    },
    {
      key: '3',
      label: <Link to={'/mySell'}>我的出售</Link>,
      icon: (
        <img
          style={{
            width: '21px',
            marginRight: '7px',
          }}
          src={Sale}
          alt="Order"
        ></img>
      ),
    },
  ]

  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    setTimeout(() => {
      navigate('/confirmOrder')
    }, 300)
  }

  return (
    <LayoutElement>
      <div className="BuySwap">
        <div className="BuySwapBox">
          <div className="BuySwapBoxTop">
            <div className="BuySwapBoxTopTitleBox">
              <p>購買CGR</p>
              <Dropdown menu={{ items }}>
                <div className="more">
                  <p>更多</p>
                  <img src={DownArrow} alt="DownArrow" />
                </div>
              </Dropdown>
            </div>
            <div className="BuySwapBoxTopBot">
              <div className="time">
                <p>時間</p>
                <img src={SortTop} alt="SortTop" />
              </div>
              <div className="price">
                <p>單價</p>
                <img src={DownArrow} alt="DownArrow" />
              </div>
              <div className="numBox">
                <p>數量</p>
                <img src={SortTop} alt="SortTop" />
              </div>
              <div className="search">
                <Input
                  size="large"
                  placeholder="large size"
                  prefix={
                    <>
                      <img src={Search} alt="Search" />
                    </>
                  }
                />
              </div>
            </div>
          </div>
          <div className="BuySwapBoxCon">
            {orderDate?.map((item: any) => {
              return (
                <div className="BuySwapBoxConItem">
                  <div className="BuySwapBoxConItemTop">
                    <div className="avatar">
                      {item.fromAddress?.slice(item.fromAddress?.length - 4, item.fromAddress?.length)}
                    </div>
                    <p>
                      {item.fromAddress?.slice(0, 4)}...
                      {item.fromAddress?.slice(item.fromAddress?.length - 4, item.fromAddress?.length)}
                    </p>
                  </div>
                  <p className="priceTitle">單價</p>
                  <p className="priceNum">${item.price}</p>
                  <div className="BuySwapBoxConItemBot">
                    <p>
                      <span>數量 </span> {item.amount} CGR
                    </p>

                    <Button
                      onClick={() => {
                        navigateTo(item)
                      }}
                      className="buyBtn"
                    >
                      購買
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
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
        <Modal
          title=""
          open={isShowSetPayMethod}
          onOk={() => {
            navigate('/paymentMethod')
          }}
          className="modalTips"
          onCancel={() => {
            setIsShowSetPayMethod(false)
          }}
          okText={'去設置'}
          cancelText={'取消'}
        >
          <p className="modalTipsTitle">提示</p>
          <p className="modalTipsTitleInfo">您還未設置收款方式，請先設置！</p>
        </Modal>
        <Modal
          title=""
          open={isShowSetPwd}
          onOk={() => {
            navigate('/payPwd')
          }}
          className="modalTips"
          onCancel={() => {
            setIsShowSetPwd(false)
          }}
          okText={'去設置'}
          cancelText={'取消'}
        >
          <p className="modalTipsTitle">提示</p>
          <p className="modalTipsTitleInfo">您還未設置交易密碼，請先設置！</p>
        </Modal>
      </div>
    </LayoutElement>
  )
}

export default Home
