import { Input, message, Modal, Pagination, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link } from 'react-router-dom'
import { useAccount, useBalance, useNetwork, useSignMessage } from 'wagmi'

import { baoTransfer, getBind, getPledgeRankList, getPond, getUser, loginDapp, withdrawal } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { NetworkSwitcher } from '@/components/SwitchNetworks'
import { useToast } from '@/components/ui/use-toast'
import { WalletModal } from '@/components/WalletModal'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { useCopyToClipboard } from '@/hooks/useCopy'
import { ellipsis, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'

import binance from '../assets/image/index/binance.png'
import BitKeep from '../assets/image/index/bitkeep.png'
import cakeBot from '../assets/image/index/cakeBot.png'
import GitHub from '../assets/image/index/github.png'
import imToken from '../assets/image/index/imToken.png'
import metamask from '../assets/image/index/metamask.png'
import Mt from '../assets/image/index/mt.png'
import RankRecord from '../assets/image/index/rankRecord.png'
import Telegram from '../assets/image/index/telegram.png'
import topBackground from '../assets/image/index/topBackground.png'
import topEthIcon from '../assets/image/index/topEthIcon.png'
import Tp from '../assets/image/index/tp.png'
import Twitter from '../assets/image/index/twitter.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()

  const [mustShow, setMustShow] = useState(false)
  const [parentAddress, setParentAddress] = useState('')
  const [isCurrenToken, setIsCurrenToken] = useState('CAKE')
  const [userInfo, setUserInfo] = useState<any>({})
  const [pondInfo, setPondInfo] = useState<any>({})
  const [rankCondown, setRankCondown] = useState<any>({})
  const [poolCondown, setPoolCondown] = useState<any>({})
  const [rankList, setRankList] = useState<any>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [withdrawValue, setWithdrawValue] = useState('')
  const [isGoOutModalOpen, setIsGoOutModalOpen] = useState(false)
  const [goOutValue, setGoOutValue] = useState('')

  const handleChangeParentAddress = (e: any) => {
    setParentAddress(e.target.value)
  }
  interface DataType {
    rank: string
    stakeNum: string
    address: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (res, _, index) => {
        return <p>{index + 1}</p>
      },
    },
    {
      title: '地址',
      dataIndex: 'userAddr',
      key: 'address',
      render: (res) => {
        return <p>{ellipsis({ startLength: 4, endLength: 4 })(res)}</p>
      },
    },
    {
      title: '质押数量',
      dataIndex: 'pledgeCake',
      key: 'stakeNum',
      render: (res) => {
        return <p>{getCoinDisplay(formatAmountByApi(res))}</p>
      },
    },
  ]

  const partnersData = [
    {
      label: 'imToken',
      key: 'imToken',
      img: imToken,
    },
    {
      label: 'BitKeep',
      key: 'BitKeep',
      img: BitKeep,
    },
    {
      label: 'Binance',
      key: 'binance',
      img: binance,
    },
    {
      label: 'Token Pocket',
      key: 'Tp',
      img: Tp,
    },
    {
      label: 'Metamask',
      key: 'metamask',
      img: metamask,
    },
    {
      label: 'My token',
      key: 'Mt',
      img: Mt,
    },
  ]
  const aboutData = [
    {
      label: 'Twitter',
      key: 'Twitter',
      img: Twitter,
    },
    {
      label: 'Telegram',
      key: 'Telegram',
      img: Telegram,
    },
    {
      label: 'GitHub',
      key: 'GitHub',
      img: GitHub,
    },
  ]
  const [_, copy] = useCopyToClipboard()
  const { toast } = useToast()
  const { chain } = useNetwork()

  const cakbTokenBalance = useBalance({
    address,
    token: getCakbAddress(chain?.id),
    watch: true,
  })

  const { signMessage, data, isSuccess } = useSignMessage({
    message: 'CAKBDAPP:LOGIN',
  })

  const loging = async () => {
    await signMessage()
  }
  useEffect(() => {
    if (isSuccess) {
      loginDapp({
        parentAddr: parentAddress,
        sign: data,
        userAddr: address,
      }).then((res: any) => {
        if (res.code === 200) {
          setMustShow(false)
          localStorage.setItem('authorization', res.data?.authorization)
          setUserInfo(res.data)
        } else {
          message.error(res.msg)
        }
      })
      setTimeout(() => {
        getPond().then((res: any) => {
          if (res.code === 200) {
            setPondInfo(res.data)
          } else {
            message.error(res.msg)
          }
        })
        getPledgeRankList(1, 10).then((res: any) => {
          if (res.code === 200) {
            console.log(res.data)
            setRankList(res.data?.records)
          } else {
            message.error(res.msg)
          }
        })
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])
  useEffect(() => {
    const anchor = location.search.substring(1)

    if (address) {
      getBind(address).then((res: any) => {
        if (res.code === 200) {
          if (!res.data) {
            setMustShow(true)
            if (anchor) {
              const anchorObj = anchor.split('=')
              console.log(anchorObj)
              if (anchorObj[1]) {
                const moreAnchor = anchorObj[1].split('&')
                if (moreAnchor[0]) {
                  setParentAddress(moreAnchor[0])
                } else {
                  setParentAddress(anchorObj[1])
                }
              }
            }
            return
          }
          getPledgeRankList(1, 10).then((res: any) => {
            if (res.code === 200) {
              console.log(res.data)
              setRankList(res.data?.records)
            } else {
              message.error(res.msg)
              signMessage()
            }
          })
        } else {
          message.error(res.msg)
          setMustShow(true)
        }
      })
    }
  }, [address, setMustShow, signMessage])
  useEffect(() => {
    getUser().then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])
  useEffect(() => {
    getPond().then((res: any) => {
      if (res.code === 200) {
        setPondInfo(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const calculateRemainingTime = (targetHour: number) => {
    const now = new Date()
    const targetTime = new Date(now)
    targetTime.setHours(targetHour, 0, 0, 0)

    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    const timeDifference = targetTime.getTime() - now.getTime()
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

    return {
      hours: hours >= 10 ? hours : `0${hours}`,
      minutes: minutes >= 10 ? minutes : `0${minutes}`,
      seconds: seconds >= 10 ? seconds : `0${seconds}`,
    }
  }

  useEffect(() => {
    const timerID = setInterval(() => {
      const initCondown = calculateRemainingTime(20)
      const initPoolCondown = calculateRemainingTime(0)
      setRankCondown(initCondown)
      setPoolCondown(initPoolCondown)
    }, 1000)
  }, [])

  useEffect(() => {
    getPledgeRankList(1, 10).then((res: any) => {
      if (res.code === 200) {
        console.log(res.data)
        setRankList(res.data?.records)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const handleSureGoOut = () => {
    baoTransfer(goOutValue, 0, address).then((res: any) => {
      if (res.code === 200) {
        setIsGoOutModalOpen(false)
        setGoOutValue('0')
        getUser().then((res: any) => {
          if (res.code === 200) {
            setUserInfo(res.data)
          } else {
            message.error(res.msg)
          }
        })
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
  }

  const handlePageChange = (res: any) => {
    getPledgeRankList(res, 10).then((res: any) => {
      if (res.code === 200) {
        setRankList(res.data?.records)
      } else {
        message.error(res.msg)
      }
    })
  }
  const handleChangeWithdrawValue = (e: any) => {
    setWithdrawValue(e.target.value)
  }
  const handleChangeGoOutValue = (e: any) => {
    setGoOutValue(e.target.value)
  }
  const handleSureWithdraw = () => {
    withdrawal(withdrawValue, address).then((res: any) => {
      if (res.code === 200) {
        message.success(res.msg)
        setWithdrawValue('')
        setIsModalOpen(false)
      } else {
        message.error(res.msg)
        setWithdrawValue('')
        setIsModalOpen(false)
      }
    })
  }
  const handleMaxWithdraw = () => {
    setWithdrawValue(formatAmountByApi(userInfo.balanceCake))
  }
  const handleMaxGoOut = () => {
    setGoOutValue(formatAmountByApi(userInfo.balanceCake))
  }

  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <img className="topEthIcon" src={topEthIcon} alt="topEthIcon" />
        <p className="">欢迎来到cakb</p>
        <div className="incomeCard">
          <p className="incomeTitle">{t('income')}(CAKE)</p>
          <p className="incomeTotal">{getCoinDisplay(formatAmountByApi(userInfo?.balanceCake))}</p>
          <div className="incomeToday">
            {t('TodayEarnings')} {getCoinDisplay(formatAmountByApi(userInfo?.balanceYesterdayIncomeCake))}
          </div>
          <div className="currBox">
            <div>
              <p>{t('CurrentPledge')}CAKE</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.pledgeCake))}</span>
            </div>
            <div>
              <p>CAKB{t('balance')}</p>
              <span>{getBalanceDisplay(cakbTokenBalance)}</span>
            </div>
          </div>
          <div className="btnBox">
            <div
              className="arrowBtn"
              onClick={() => {
                setIsModalOpen(true)
              }}
            >
              {t('Withdrawal')}
            </div>
            <div
              onClick={() => {
                setIsGoOutModalOpen(true)
              }}
              className="normalBtn"
            >
              {t('Transferred')}
            </div>
          </div>
        </div>
        <div className="ticketsCard">
          <p className="ticketsCardTitle">{t('PurchaseTickets')}</p>
          <p className="ticketsCardInfo">{t('butTicketsInfo')}</p>
          <div className="ticketsCardBox">
            <Link to="/swap">
              <div className="buyBtn">{t('PurchaseTickets')}</div>
            </Link>
            <Link to="/stake">
              <div className="normalBtn">{t('ImmediateInvestment')}</div>
            </Link>
          </div>
        </div>
        <div className="poolCard">
          <p className="poolCardTitle">{t('bonusPool')}</p>
          <p className="poolCardNum">{getCoinDisplay(formatAmountByApi(pondInfo?.bigOrderPond))} </p>
          <div className="countdown">
            <div className="countdownItem">{rankCondown.hours}</div>：
            <div className="countdownItem">{rankCondown.minutes}</div>：
            <div className="countdownItem">{rankCondown.seconds}</div>
          </div>
          <div className="poolRank">
            <div className="RankRecordIcon">
              <Link to={'/rank'}>
                <img src={RankRecord} alt="RankRecord" />
              </Link>
            </div>
            <p className="rankTitle">{t('poolRank')}</p>
            <p className="rankNum">
              {getCoinDisplay(formatAmountByApi(new BigNumber(pondInfo?.bigOrderPond || '0').div(2).toString()))}{' '}
            </p>
            <Table className="poolTable" columns={columns} dataSource={rankList} pagination={false} />
          </div>
        </div>
        <div className="fomoCard">
          <p className="fomoCardTitle">{t('dividendPool')}</p>
          <p className="fomoNum">{getCoinDisplay(formatAmountByApi(pondInfo?.newPerformance))}</p>
          <div className="countdown">
            <div className="countdownItem">{poolCondown.hours}</div>：
            <div className="countdownItem">{poolCondown.minutes}</div>：
            <div className="countdownItem">{poolCondown.seconds}</div>
          </div>
        </div>
        <div className="partners">
          <p className="partnersTitle">{t('Partners')}</p>
          <div className="partnersBox">
            {partnersData.map((item) => {
              return (
                <div className="partnersBoxItem" key={item.key}>
                  <img src={item.img} alt={item.label} />
                  <p>{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="aboutCard">
          <p className="aboutTitle">{t('AboutUs')}</p>
          <div className="aboutBox">
            {aboutData.map((item) => {
              return (
                <div className="aboutBoxItem" key={item.key}>
                  <img src={item.img} alt={item.label} />
                  <p>{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="cakeBotBox"></div>
        <img className="cakeBot" src={cakeBot} alt="cakeBot" />
        {mustShow && <div className="mask"></div>}
        {mustShow && (
          <div className="mustBox">
            <p>{t('Recommendation')}</p>
            <Input
              className="bindIpt"
              value={parentAddress}
              onChange={handleChangeParentAddress}
              placeholder={t('parentAddressInfo')}
            ></Input>
            <div className="mustBoxTips">
              <p className="mustBoxTipsTitle">{t('BindingTips')}</p>
              <p>{t('Rules1')}</p>
              <p>{t('Rules2')}</p>
              <p>{t('Rules3')}</p>
            </div>
            <div className="sureBtn" onClick={loging}>
              确定
            </div>
          </div>
        )}

        <Modal
          title=""
          open={isModalOpen}
          width={290}
          onOk={() => {
            setIsModalOpen(false)
            setWithdrawValue('')
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setWithdrawValue('')
          }}
          className="WithdrawalTokenBox"
          footer={null}
        >
          <div className="withdrawTitle">{t('Withdrawal')}</div>
          <div className="tokenBox">
            <div
              onClick={() => {
                setIsCurrenToken('CAKE')
              }}
              className={isCurrenToken === 'CAKE' ? 'currToken noramToken' : 'noramToken'}
            >
              CAKE
            </div>
            {/* <div
              onClick={() => {
                setIsCurrenToken('CAKB')
              }}
              className={isCurrenToken === 'CAKB' ? 'currToken noramToken' : 'noramToken'}
            >
              CAKB
            </div> */}
          </div>
          <div className="withdrawIptBox">
            <p>请输入数量</p>
            <div>
              <Input className="withdrawIpt" value={withdrawValue} onChange={handleChangeWithdrawValue}></Input>
              <div onClick={handleMaxWithdraw}>最大</div>
            </div>
          </div>
          <div className="sureBtn" onClick={handleSureWithdraw}>
            确认
          </div>
        </Modal>
        <Modal
          title=""
          open={isGoOutModalOpen}
          width={290}
          onOk={() => {
            setIsGoOutModalOpen(false)
            setGoOutValue('')
          }}
          onCancel={() => {
            setIsGoOutModalOpen(false)
            setGoOutValue('')
          }}
          className="WithdrawalTokenBox"
          footer={null}
        >
          <div className="withdrawTitle">转入余额宝</div>
          <div className="tokenBox">
            <div className={'currToken noramToken'}>CAKE</div>
          </div>
          <div className="withdrawIptBox">
            <p>请输入数量</p>
            <div>
              <Input className="withdrawIpt" value={goOutValue} onChange={handleChangeGoOutValue}></Input>
              <div onClick={handleMaxGoOut}>最大</div>
            </div>
          </div>
          <div className="sureBtn" onClick={handleSureGoOut}>
            确认
          </div>
        </Modal>
      </div>
    </LayoutElement>
  )
}

export default Home
