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
  getGameRecord,
  getGameRecordThree,
  getGameRecordThreeKJ,
  getGameSet3,
  getUpsDowns,
  getUserInfo,
  payGame3Fee,
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
  const [upsdowns, setUpsdowns] = useState('1')
  const [isWinner, setIsWinner] = useState(false)
  const [isNotWinner, setIsNotWinner] = useState(false)
  const [gameRecord, setGameRecord] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>({})
  const navigate = useNavigate()
  const [participationIntegral, setParticipationIntegral] = useState('0')
  const [guessingType, setGuessingType] = useState('1')
  const [payPwd, setPayPwd] = useState('')

  const [gameId, setGameId] = useState('1')
  const [timeData, setTimeData] = useState<any[]>([])
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
      getUpsDowns({ type: guessingType })
        .then((res: any) => {
          if (res.code === 200) {
            const initData = res.data.slice(0, 5).map((item: any) => {
              const parsedItem = JSON.parse(item)
              const date = new Date(parsedItem.time[0])
              const formattedDate = `${date.getFullYear()} ${String(date.getMonth() + 1).padStart(2, '0')}-${String(
                date.getDate()
              ).padStart(2, '0')} `

              return { time: date, type: String(parsedItem.upsDownsQuota[0]) }
            })
            setUpsDownsRecord(initData)
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
            setUpsdowns(res.data[0]?.upsdowns)
            setGameId(res.data[0]?.id)
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

      getGameRecordThreeKJ({ id: gameId })
        .then((res: any) => {
          if (res.code === 200) {
            const initArr = res.data.map((item: any) => {
              return JSON.parse(item)
            })
            console.log(initArr)

            setGameRecord(initArr)
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
  }, [address, gameId, guessingType, navigate])

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
      title: '時間',
      dataIndex: 'addTime',
      key: 'addTime',
      render: (text: any) => <p>{formatDate(text)}</p>,
    },
    {
      title: '選擇方向',
      dataIndex: 'bet',
      key: 'bet',
      render: (bet: any) => <p>{bet === 1 ? '涨' : '跌'}</p>,
    },
    {
      title: '實際方向',
      dataIndex: 'draw',
      key: 'draw',
      render: (draw: any) => <p>{draw ? (draw === 1 ? '涨' : '跌') : '--'}</p>,
    },
    {
      title: '獎勵',
      dataIndex: 'reward',
      key: 'reward',
    },
  ]

  const takeGame3s = () => {
    takeGame3({ gameId })
      .then((res: any) => {
        if (res.code === 200) {
          setIsWinner(true)
          getGameRecord({ type: 1 })
            .then((res: any) => {
              if (res.code === 200) {
                setIsWinner(true)
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
                setIsWinner(true)
                // navigate('/')
              }
            })
            .catch(() => {
              message.error('請求失敗')
              // navigate('/')
            })
        } else if (res.code === 522) {
          setIsNotWinner(true)
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }

  const payGame3Fees = () => {
    payGame3Fee({ gameId: gameId, payPwd: payPwd })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('支付成功')

          setIsPwd(false)
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

  return (
    <LayoutElement>
      <div className="gussItemBox">
        <div className="gussItemTop">
          <div className="gussItemMenuBox">
            <LeftOutline
              onClick={() => {
                navigate(-1)
              }}
              fill="#fff"
            />
            <p className="recordTopTitle">方位玩法</p>
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
          <img className="ZdGame" src={ZdGame} alt="jcBg" />
          <div className="ZdGameBoxTop">
            <p className="ZdGameBox">進行中</p>
            <p className="ZdGameInfo">
              游戏時間：
              {timeData.map((item) => {
                return `${new BigNumber(item.startTime).div(60 * 60 * 1000).toFixed(0)}:00-${new BigNumber(
                  item.stopTime
                )
                  .div(60 * 60 * 1000)
                  .toFixed(0)}:00 `
              })}
            </p>
          </div>
          <div className="balance">{scientificToDecimal(userInfo?.usable || '0')}</div>
          <div className="gussItemTopRecharge">
            <p>遊戲積分</p>

            <div className="gussItemBtnBox">
              <div
                onClick={() => {
                  navigate('/transfer')
                }}
              >
                <p>劃轉</p>
              </div>
              <div
                onClick={() => {
                  navigate('/rechargeJi')
                }}
              >
                <p>充值</p>
              </div>
            </div>
          </div>
        </div>
        <div className="gussItemCon">
          <div className="gussItemConItem">
            <div className="topTitle">方位圖</div>
            {/* <Line className="topChart" {...config} /> */}
            <div className="fangweiBox">
              <div className="fangweiBoxItem">北</div>
              <div className="fangweiBoxItem">東北</div>
              <div className="fangweiBoxItem">東</div>
              <div className="fangweiBoxItem">西北</div>
              <div
                className="fangweiBoxItem shengcheng"
                onClick={() => {
                  takeGame3s()
                }}
              >
                開始匹配
              </div>
              <div className="fangweiBoxItem">東南</div>
              <div className="fangweiBoxItem">西</div>
              <div className="fangweiBoxItem">西南</div>
              <div className="fangweiBoxItem">南</div>
            </div>

            <div className="controlBox">
              <div
                className="controlLeft"
                onClick={() => {
                  navigate('/daojv')
                }}
              >
                我的道具
              </div>
              <div
                onClick={() => {
                  navigate('/MyMatching')
                }}
                className="controlRight"
              >
                我的匹配
              </div>
            </div>
          </div>
        </div>
        <p className="gussItemTitle">方位生成記錄</p>
        <div className="gussItemBotByThree">
          {gameRecord.map((item) => {
            return (
              <div className="gussItemBotItem">
                <div className="gussItemBotItemCell">
                  <p>時間</p>
                  <span>{formatDate(item.time[0])}</span>
                </div>
                <div className="gussItemBotItemCell">
                  <p>方位</p>
                  <span>{getFangwei(item.upsdowns[0])}</span>
                </div>
              </div>
            )
          })}
        </div>

        <Modal
          title=""
          open={isNotWinner}
          onOk={() => {
            takeGame3s()
            setIsNotWinner(false)
          }}
          className="modalTips"
          onCancel={() => {
            setIsNotWinner(false)
          }}
          okText={'再來一次'}
          cancelText={'取消'}
        >
          <p className="modalTipsTitle">提示</p>
          <p className="modalTipsTitleInfo">很遺憾，您未搶到道具！</p>
        </Modal>
        <Modal
          title=""
          open={isWinner}
          onOk={() => {
            setIsWinner(false)
            setIsPwd(true)
          }}
          className="modalTips"
          onCancel={() => {
            setIsWinner(false)
          }}
          okText={'確定'}
          cancelText={'取消'}
        >
          <p className="modalTipsTitle">獲取道具</p>
          <div className="fangweiBoxItem">{getFangwei(upsdowns)}</div>
          <p className="modalTipsTitleInfo">您還需支付手續費：10積分</p>
        </Modal>

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
