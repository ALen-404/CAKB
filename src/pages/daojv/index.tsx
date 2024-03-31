import { Line } from '@ant-design/charts'
import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Modal, Pagination, Space, Table } from 'antd'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import {
  getAssetsByConditions,
  getAssetsByUser,
  getGame3Props,
  getGameRecordThree,
  getGameSet3,
  getUpsDowns,
  getUserInfo,
  takeGame3,
} from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { copyMsg, date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import copyLink from '../../assets/image/community/copyLink.png'
import footerIcon from '../../assets/image/community/footer.png'
import getCoin from '../../assets/image/community/getCoin.png'
import rightArrow from '../../assets/image/community/rightArrow.png'
import highLevel from '../../assets/image/guessing/highLevel.png'
import jcChu from '../../assets/image/guessing/jc_chu.png'
import jcIcon from '../../assets/image/guessing/jc_icon.png'
import ZdGame from '../../assets/image/guessing/zdGame.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [isShowSetPwd, setIsShowSetPwd] = useState(true)
  const [upsDownsRecord, setUpsDownsRecord] = useState(true)
  const [gameRecord, setGameRecord] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>({})
  const navigate = useNavigate()
  const [participationIntegral, setParticipationIntegral] = useState('0')
  const [guessingType, setGuessingType] = useState('1')
  const [timeData, setTimeData] = useState<any[]>([])
  const [daojvData, setDaojvData] = useState<any[]>([])
  const [gasData, setGasData] = useState<any>('')

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)

    const hours = `0${date.getHours()}`.slice(-2)
    const minutes = `0${date.getMinutes()}`.slice(-2)
    const seconds = `0${date.getSeconds()}`.slice(-2)

    return `${month}-${day} ${hours}:${minutes}`
  }

  useEffect(() => {
    if (address) {
      getAssetsByConditions({ symbol: 'GPTH' })
        .then((res: any) => {
          if (res.code === 200) {
            setUserInfo(res.data)
          } else {
            message.error(res.msg)
            // navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          // navigate('/')
        })

      const type = localStorage.getItem('guessingType')
      setGuessingType(type || '1')
      getGame3Props()
        .then((res: any) => {
          if (res.code === 200) {
            // const initData = res.data.slice(0, 5).map((item: any) => {
            //   const parsedItem = JSON.parse(item)
            //   const date = new Date(parsedItem.time[0])
            //   const formattedDate = `${date.getFullYear()} ${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            //     date.getDate()
            //   ).padStart(2, '0')} `

            //   return { time: date, type: String(parsedItem.upsDownsQuota[0]) }
            // })
            // setUpsDownsRecord(initData)
            console.log(res.data)
            setDaojvData(res.data)
            // setUserInfo(res.data)
          } else {
            message.error(res.msg)
            // navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          // navigate('/')
        })

      getGameSet3()
        .then((res: any) => {
          if (res.code === 200) {
            setParticipationIntegral(res.data[0]?.reward)
            setTimeData(JSON.parse(res.data[0]?.gameTime || '[]'))
            setGasData(JSON.parse(res.data[0]?.charge || '[]'))
          } else {
            message.error(res.msg)
            // navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          // navigate('/')
        })

      getGameRecordThree()
        .then((res: any) => {
          if (res.code === 200) {
            setGameRecord(res.data.records)
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
  }, [address, guessingType, navigate])
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
  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    // setTimeout(() => {
    //   navigate('/confirmOrder')
    // }, 300)
  }
  const config = {
    data: upsDownsRecord,
    padding: 'auto',
    xField: 'time',
    yField: 'type',
    axis: {
      x: {
        labelFormatter: (text: Date) => {
          return `${text.getFullYear()} ${String(text.getMonth() + 1).padStart(2, '0')}-${String(
            text.getDate()
          ).padStart(2, '0')}`
        },
      },
      y: {
        labelFormatter: (text: any) => Number(text),
      },
    },
    tooltip: {
      title: '漲跌',
      items: [{ channel: 'y', valueFormatter: (d: any) => d }],
    },
    smooth: true,
  }

  const columns: any = [
    {
      title: '方位',
      dataIndex: 'bet',
      key: 'bet',
      render: (bet: any) => <p>{getFangwei(bet)}</p>,
    },
    {
      title: '時間',
      dataIndex: 'addTime',
      key: 'addTime',
      render: (text: any) => <p>{formatDate(text)}</p>,
    },
  ]

  const takeGame3s = (bet: any) => {
    takeGame3({ bet })
      .then((res: any) => {
        if (res.code === 200) {
          getGameRecordThree()
            .then((res: any) => {
              if (res.code === 200) {
                setGameRecord(res.data.records)
              } else {
                message.error(res.msg)
                navigate('/')
              }
            })
            .catch(() => {
              message.error('請求失敗')
              navigate('/')
            })

          getAssetsByConditions({ symbol: 'GPTH' })
            .then((res: any) => {
              if (res.code === 200) {
                setUserInfo(res.data)
              } else {
                message.error(res.msg)
                // navigate('/')
              }
            })
            .catch(() => {
              message.error('請求失敗')
              // navigate('/')
            })
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }

  function scientificToDecimal(num: any) {
    if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
      // 使用 Number 类型强制转换为普通数字
      var decimalNum = Number(num)
      // 将数字转换为适当格式的字符串
      console.log(decimalNum.toLocaleString('fullwide', { useGrouping: false }))

      return decimalNum.toLocaleString('fullwide', { useGrouping: false })
    } else {
      return num
    }
  }

  return (
    <LayoutElement>
      <div className="daojvBox">
        <div className="gussItemTop">
          <div className="gussItemMenuBox">
            <LeftOutline
              onClick={() => {
                navigate(-1)
              }}
              fill="#fff"
            />
            <p className="recordTopTitle">我的道具</p>
            <div>
              {/* <img
                style={{
                  width: '64px',
                  height: '36px',
                }}
                src={guessingType == '1' ? jcChu : highLevel}
                alt="jcChu"
              /> */}
            </div>
          </div>
        </div>

        <div className="daojvItemBox">
          {daojvData.map((item) => {
            return (
              <div className="daojvItem">
                <div className="daojvItemCell">
                  <p>道具</p>
                  <span>{getFangwei(item.type)}</span>
                </div>
                <div className="daojvItemCell">
                  <p>數量</p>
                  <span>{item.amount}</span>
                </div>
                <div className="daojvItemCell">
                  <p>待匹配</p>
                  <span>{item.matched}</span>
                </div>
                <div className="daojvItemCell">
                  <p>排隊中</p>
                  <span>{item.queue}</span>
                </div>
              </div>
            )
          })}
        </div>

        <p className="gussItemTitle">參與記錄</p>
        <div className="gussItemBot">
          <div className="gussItemBotItem">
            <Table pagination={false} columns={columns} dataSource={gameRecord} />
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
      </div>
    </LayoutElement>
  )
}

export default Home
