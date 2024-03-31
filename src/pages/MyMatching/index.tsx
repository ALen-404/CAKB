import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Modal, Pagination, Segmented, Table } from 'antd'
import { Popup, Tabs } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getGameRecordThree, getSellTradingByUser, getTradingByUser, payGame3, payGame3Fee } from '@/apis'
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
  const [currTradingData, setCurrTradingData] = useState([])
  const [segmentedValue, setSegmentedValue] = useState('99')
  const [isWinner, setIsWinner] = useState(false)
  const [isShowPwd, setIsPwd] = useState(false)
  const [payPwd, setPayPwd] = useState('')
  const [gameId, setGameId] = useState('1')

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
  let navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getGameRecordThree()
        .then((res: any) => {
          if (res.code === 200) {
            const arr = res.data.records.filter((i: { status: number }) => i.status != 5)
            const arrCom = res.data.records.filter((i: { status: number }) => i.status === 5)

            setCurrTradingData(segmentedValue === '99' ? arr : arrCom)
            setTradingData(res.data.records)
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
  }, [address, navigate, segmentedValue])

  const getStatus = (status: any) => {
    // 1：排队中，2：待支付，3：支付中，4：收益中，5：已完成,6
    switch (status) {
      case 1:
        return <p style={{ color: 'rgba(235, 168, 12, 1)' }}>排队中</p>
      case 2:
        return <p style={{ color: 'rgba(81, 100, 191, 1)' }}>待支付</p>
      case 3:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>支付中</p>
      case 4:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>收益中</p>
      case 5:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>已完成</p>
      case 6:
        return <p style={{ color: 'rgba(255, 0, 86, 1)' }}>其他</p>
      default:
        return <p style={{ color: 'rgba(235, 168, 12, 1)' }}>待支付</p>
    }
  }

  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    setTimeout(() => {
      navigate('/mySellDetails')
    }, 300)
  }

  const getFangwei = (type: any) => {
    //1：东，2：南，3：西，4：北，5：东北，6：西北，7：东南，8：西南
    switch (type) {
      case 1:
        return '东'
      case 2:
        return '南'
      case 3:
        return '西'
      case 4:
        return '北'
      case 5:
        return '东北'
      case 6:
        return '西北'
      case 7:
        return '东南'
      case 8:
        return '西南'
      default:
        return '东'
    }
  }

  const getPipeiFangwei = (type: any) => {
    //1：东，2：南，3：西，4：北，5：东北，6：西北，7：东南，8：西南
    switch (type) {
      case 1:
        return '东北、东南'
      case 2:
        return '东南、西南'
      case 3:
        return '西北、西南'
      case 4:
        return '东北、西北'
      case 5:
        return '东、北'
      case 6:
        return '西、北'
      case 7:
        return '东、南'
      case 8:
        return '西、南'
      default:
        return '东、东南'
    }
  }
  const payJifen = (gameid: any) => {
    console.log(gameid)
    setGameId(gameid)
    setIsPwd(true)
  }

  const payGame3Fees = () => {
    payGame3({ gameId: gameId, payPwd: payPwd })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('支付成功')

          setIsPwd(false)

          getGameRecordThree()
            .then((res: any) => {
              if (res.code === 200) {
                const arr = res.data.records.filter((i: { status: number }) => i.status != 5)
                const arrCom = res.data.records.filter((i: { status: number }) => i.status === 5)

                setCurrTradingData(segmentedValue === '99' ? arr : arrCom)
                setTradingData(res.data.records)
              } else {
                message.error(res.msg)
                navigate('/')
              }
            })
            .catch(() => {
              message.error('請求失敗')
              navigate('/')
            })
        } else {
          message.error(res.msg)
          setIsPwd(false)
        }
      })
      .catch(() => {
        message.error('請求失敗')
        setIsPwd(false)
      })
  }

  return (
    <LayoutElement>
      <div className="MyMatch">
        <div className="mySellTop">
          <LeftOutline
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="mySellTopTitle">我的匹配</p>
          <div></div>
        </div>
        <div className="mySellCon">
          <Segmented
            onChange={(val) => {
              setSegmentedValue(val.toString())
            }}
            options={[
              { label: '進行中', value: '99' },
              { label: '已完成', value: '4' },
            ]}
          />
          {currTradingData.map((item: any) => {
            return (
              <div className="mySellConItem">
                <div className="mySellConItemTop">
                  <p className="mySellConItemTopLeft">
                    開獎道具 <span>{getFangwei(item.bet)}</span>
                  </p>
                  <p className="mySellConItemTopRight">{getStatus(item.status)}</p>
                </div>
                <p className="mySellNum">
                  匹配道具 <span>{getPipeiFangwei(item.bet)}</span>
                </p>
                <p className="mySellNum">
                  支付總積分 <span>{item.reward}</span>
                </p>
                <p className="mySellNum">
                  匹配時間： <span>{formatDate(item.addTime)}</span>
                </p>
                <p className="mySellTime">發佈時間：{formatDate(item.addTime)}</p>
                {item.status === 2 && (
                  <>
                    <hr className="mySellTimeHr" />
                    <div className="myBots">
                      <p className="mySellNum">
                        待支付積分 <span>{item.treatReward}</span>
                      </p>
                      <Button
                        onClick={() => {
                          payJifen(item.id)
                        }}
                        className="sureBtn"
                      >
                        去支付
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* <div className="confirmBuy">
          <Link className="sureBtn" to="/pushSell">
            <Button className="sureBtn">發佈出售</Button>
          </Link>
        </div> */}
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
              onChange={(e) => {
                setPayPwd(e.target.value)
              }}
              placeholder="請輸入交易密碼"
              className="pwdBoxBot"
              type="password"
            />
            <Button
              onClick={() => {
                payGame3Fees()
              }}
              className="sureBtn"
            >
              确认支付
            </Button>
          </div>
        </Popup>
      </div>
    </LayoutElement>
  )
}

export default Home
