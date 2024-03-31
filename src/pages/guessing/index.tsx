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

import { getAssetsByConditions, getAssetsByUser, getGameSet, getTrading, getUserInfo, takeGame } from '@/apis'
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
import jcBanner from '../../assets/image/guessing/jc_banner.png'
import jcChu from '../../assets/image/guessing/jc_chu.png'
import jcIcon from '../../assets/image/guessing/jc_icon.png'
import jcIcon2 from '../../assets/image/guessing/jc_icon_2.png'
import zjBg from '../../assets/image/guessing/zj_bg.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [isShowSetPwd, setIsShowSetPwd] = useState(true)
  const [participationIntegral, setParticipationIntegral] = useState('0')
  const [participationIntegral2, setParticipationIntegral2] = useState('0')
  const [participationIntegral3, setParticipationIntegral3] = useState('0')
  const [timeData, setTimeData] = useState<any[]>([])
  const [timeData2, setTimeData2] = useState<any[]>([])
  const [timeData3, setTimeData3] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getAssetsByConditions({ symbol: 'GPO' })
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

      getGameSet(1)
        .then((res: any) => {
          if (res.code === 200) {
            setParticipationIntegral(res.data[0]?.participationIntegral)
            setTimeData(JSON.parse(res.data[0]?.gameTime || '[]'))
          } else {
            message.error(res.msg)
            // navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          // navigate('/')
        })
      getGameSet(2)
        .then((res: any) => {
          if (res.code === 200) {
            setParticipationIntegral2(res.data[0]?.participationIntegral)
            setTimeData2(JSON.parse(res.data[0]?.gameTime || '[]'))
          } else {
            message.error(res.msg)
            // navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          // navigate('/')
        })
      getGameSet(3)
        .then((res: any) => {
          if (res.code === 200) {
            console.log(res.data, 'res.data')
            setParticipationIntegral3(res.data[0]?.participationIntegral)
            setTimeData3(JSON.parse(res.data[0]?.gameTime || '[]'))
          } else {
            message.error(res.msg)
            // navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          // navigate('/')
        })
    }
  }, [address, navigate])

  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    // setTimeout(() => {
    //   navigate('/confirmOrder')
    // }, 300)
  }

  return (
    <LayoutElement>
      <div className="guessingBox">
        <div className="guessingTop">
          <img src={jcBanner} alt="jcBg" />
          <div className="currPoint">當前總積分：{Number(userInfo?.usable || '0').toFixed(2)}</div>
        </div>
        <div className="guessingCon">
          <div className="guessingConItem">
            <div className="guessingConItemLeft">
              <div className="conItemleftLeft">
                <img className="jcChu" src={jcChu} alt="jcChu" />
                <img className="jcIcon" src={jcIcon} alt="jcIcon" />
              </div>
              <div className="conItemleftRight">
                <p className="game">漲跌遊戲</p>
                <p className="time">
                  遊戲時間：
                  {timeData.map((item) => {
                    return `${new BigNumber(item.startTime).div(60 * 60 * 1000).toFixed(0)}:00-${new BigNumber(
                      item.stopTime
                    )
                      .div(60 * 60 * 1000)
                      .toFixed(0)}:00 `
                  })}
                </p>
                {/* <p className="venue">場次：2場</p> */}
              </div>
            </div>
            <div className="guessingConItemRight">
              <p>最低參與積分：{participationIntegral}</p>
              <div
                onClick={() => {
                  localStorage.setItem('guessingType', '1')
                  navigate('/guessingItem')
                }}
              >
                去參與
              </div>
            </div>
          </div>
          <div className="guessingConItem">
            <div className="guessingConItemLeft">
              <div className="conItemleftLeft">
                <img className="jcChu" src={highLevel} alt="jcChu" />
                <img className="jcIcon" src={jcIcon} alt="jcIcon" />
              </div>
              <div className="conItemleftRight">
                <p className="game">漲跌遊戲</p>
                <p className="time">
                  遊戲時間：
                  {timeData2.map((item) => {
                    return `${new BigNumber(item.startTime).div(60 * 60 * 1000).toFixed(0)}:00-${new BigNumber(
                      item.stopTime
                    )
                      .div(60 * 60 * 1000)
                      .toFixed(0)}:00 `
                  })}
                </p>
                {/* <p className="venue">場次：2場</p> */}
              </div>
            </div>
            <div className="guessingConItemRight">
              <p>最低參與積分：{participationIntegral2}</p>
              <div
                onClick={() => {
                  localStorage.setItem('guessingType', '2')
                  navigate('/guessingItem')
                }}
              >
                去參與
              </div>
            </div>
          </div>
          <div className="guessingConItem">
            <div className="guessingConItemLeft">
              <div className="conItemleftLeft">
                <img className="jcChu" src={zjBg} alt="jcChu" />
                <img className="jcIcon" src={jcIcon} alt="jcIcon" />
              </div>
              <div className="conItemleftRight">
                <p className="game">漲跌遊戲</p>
                <p className="time">
                  遊戲時間：
                  {timeData3.map((item) => {
                    return `${new BigNumber(item.startTime).div(60 * 60 * 1000).toFixed(0)}:00-${new BigNumber(
                      item.stopTime
                    )
                      .div(60 * 60 * 1000)
                      .toFixed(0)}:00 `
                  })}
                </p>
                {/* <p className="venue">場次：2場</p> */}
              </div>
            </div>
            <div className="guessingConItemRight">
              <p>最低參與積分：{participationIntegral3}</p>
              <div
                onClick={() => {
                  localStorage.setItem('guessingType', '4')
                  navigate('/guessingItem')
                }}
              >
                去參與
              </div>
            </div>
          </div>
          <div className="guessingConItem">
            <div className="guessingConItemLeft">
              <div className="conItemleftLeft">
                <img className="jcIcon" src={jcIcon2} alt="jcIcon" />
              </div>
              <div className="conItemleftRight">
                <p className="game">方位遊戲</p>
                <p className="time">
                  遊戲時間：
                  {timeData3.map((item) => {
                    return `${new BigNumber(item.startTime).div(60 * 60 * 1000).toFixed(0)}:00-${new BigNumber(
                      item.stopTime
                    )
                      .div(60 * 60 * 1000)
                      .toFixed(0)}:00 `
                  })}
                </p>
              </div>
            </div>
            <div className="guessingConItemRight">
              <p>最低參與積分：{participationIntegral3}</p>
              <div
                onClick={() => {
                  localStorage.setItem('guessingType', '3')
                  navigate('/guessingItemByThr')
                }}
              >
                去參與
              </div>
            </div>
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
