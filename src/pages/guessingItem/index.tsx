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
  getGameSet,
  getUpsDowns,
  getUserInfo,
  takeGame,
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
import zjBg from '../../assets/image/guessing/zj_bg.png'

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
    const type = localStorage.getItem('guessingType')
    setGuessingType(type || '1')
    if (address) {
      getAssetsByConditions({ symbol: guessingType == '1' ? 'GPO' : guessingType == '2' ? 'GPT' : 'GPTH' })
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

      getGameSet(guessingType)
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

      getGameRecord({ type: guessingType })
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

  const takeGames = (bet: any) => {
    takeGame({ bet })
      .then((res: any) => {
        if (res.code === 200) {
          getGameRecord({ type: 1 })
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

          getAssetsByConditions({ symbol: guessingType == '1' ? 'GPO' : guessingType == '2' ? 'GPT' : 'GPTH' })
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
      <div className="gussItemBox">
        <div className="gussItemTop">
          <div className="gussItemMenuBox">
            <LeftOutline
              onClick={() => {
                navigate(-1)
              }}
              fill="#fff"
            />
            <p className="recordTopTitle">競猜</p>
            <div>
              <img
                style={{
                  width: '64px',
                  height: '36px',
                }}
                src={guessingType == '1' ? jcChu : guessingType == '2' ? highLevel : zjBg}
                alt="jcChu"
              />
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
            <div className="topTitle">漲跌圖</div>
            <Line className="topChart" {...config} />
            <div className="gasBox">
              <div className="gasItem">
                <p>手續費</p>
                <p>{new BigNumber(gasData).times(100).toString()}%</p>
              </div>
              <div className="gasItem">
                <p>手續費</p>
                <p>{new BigNumber(gasData).times(participationIntegral).toFixed(2)}</p>
              </div>
            </div>
            <div className="controlBox">
              <div
                className="controlLeft"
                onClick={() => {
                  takeGames(1)
                }}
              >
                漲
              </div>
              <div
                onClick={() => {
                  takeGames(2)
                }}
                className="controlRight"
              >
                跌
              </div>
            </div>
          </div>
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
