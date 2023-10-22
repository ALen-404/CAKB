import { ArrowDownOutlined } from '@ant-design/icons'
import { Input, message, Modal, Pagination, Radio, Switch, Table } from 'antd'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import {
  baoPledge,
  baoTransfer,
  getBaoPldgeConfig,
  getBaoPledge,
  getQuotes,
  getSwap,
  getUser,
  startReinvestment,
  withdrawal,
} from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { date, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import topBackground from '../../assets/image/index/topBackground.png'
import cake from '../../assets/image/swap/cake.png'
import quotationsIcon from '../../assets/image/swap/quotationsIcon.png'

import './index.less'

const Fund = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [withdrawValue, setWithdrawValue] = useState('')
  const [goOutValue, setGoOutValue] = useState('')

  const [userInfo, setUserInfo] = useState<any>({})
  const [fundConfig, setFundConfig] = useState<any>([])
  const [swapRecord, setSwapRecord] = useState<any>([])
  const [isCurrenDays, setIsCurrenDays] = useState<any>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGoOutModalOpen, setIsGoOutModalOpen] = useState(false)
  const [isReopen, setIsReopen] = useState(0)
  const [baoPldgeValue, setBaoPldgeValue] = useState('0')

  const cakbTokenBalance = useBalance({
    address,
    token: getCakbAddress(chain?.id),
    watch: true,
  })
  const cakeTokenBalance = useBalance({
    address,
    token: getCakeAddress(chain?.id),
    watch: true,
  })

  useEffect(() => {
    getUser().then((res: any) => {
      if (res.code === 200) {
        setBaoPldgeValue('0')
        setUserInfo(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const handleBaoPledge = () => {
    baoPledge(isCurrenDays, isReopen, baoPldgeValue).then((res: any) => {
      if (res.code === 200) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
  }

  useEffect(() => {
    getBaoPledge().then((res: any) => {
      if (res.code === 200) {
        setSwapRecord(res.data.records)
      } else {
        message.error(res.msg)
      }
    })
  }, [])
  useEffect(() => {
    getBaoPldgeConfig().then((res: any) => {
      if (res.code === 200) {
        setFundConfig(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])
  const changeBaoPldgeValue = (e: any) => {
    setBaoPldgeValue(e.target.value)
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
    setWithdrawValue(formatAmountByApi(userInfo?.balanceCake || '0'))
  }
  const handleMaxGoOutValue = () => {
    setGoOutValue(formatAmountByApi(userInfo?.baoBalanceCake || '0'))
  }
  const handleMaxGoOut = () => {
    baoTransfer(goOutValue || '0', 1, address).then((res: any) => {
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
  const onChangeIsReopen = (e: any) => {
    setIsReopen(e.target.value)
  }
  const switchChange = (e: any, item: any) => {
    startReinvestment(e ? 0 : 1, item.id).then((res: any) => {
      if (res.code === 200) {
        message.success(res.msg)
        getBaoPledge().then((res: any) => {
          if (res.code === 200) {
            setSwapRecord(res.data.records)
          } else {
            message.error(res.msg)
          }
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>

        <div className="fundCard">
          <p className="incomeTitle">
            {t('YuEbao')}
            {t('income')}(CAKE)
          </p>
          <p className="incomeTotal">{getCoinDisplay(formatAmountByApi(userInfo?.baoBalanceCumulativeIncomeCake))}</p>

          <div className="currBox">
            <div>
              <p>{t('myCun')}</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.baoBalanceCake))}</span>
            </div>
            <div>
              <p>{t('leiShou')}</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.baoBalanceCumulativeIncomeCake))}</span>
            </div>
            <div>
              <p>{t('TodayEarnings')}</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.baoBalanceYesterdayIncomeCake))}</span>
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
              className="normalBtn"
              onClick={() => {
                setIsGoOutModalOpen(true)
              }}
            >
              {t('zhuanYu')}
            </div>
          </div>
        </div>
        <div className="fundChooseBox">
          <div className="fundChooseTitle">{t('xuanDay')}</div>
          <div className="daysBox">
            {fundConfig?.map((item: any) => {
              return (
                <div
                  onClick={() => {
                    setIsCurrenDays(item.id)
                  }}
                  className={isCurrenDays === item.id ? 'currToken noramToken' : 'noramToken'}
                  key={item.id}
                >
                  {item.pledgeCycle}天
                </div>
              )
            })}
          </div>
          <div className="fundInputBox">
            <div className="fundInputBoxTop">
              <p>{t('ruyu')}</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.baoBalanceCake || '0'))} cake</span>
            </div>
            <Input
              className="fundIpt"
              value={baoPldgeValue}
              onChange={changeBaoPldgeValue}
              placeholder={t('zuiZhuan')}
            ></Input>
          </div>
          <div className="DailyYieldBox">
            <p>{t('meiRate')}</p>
            <span>{Number(fundConfig[isCurrenDays - 1]?.baoDistribute || 0) * 100}%</span>
          </div>
          <div className="ResumptionBox">
            <p>{t('isTou')}</p>
            <span>
              {' '}
              <Radio.Group onChange={onChangeIsReopen} value={isReopen}>
                <Radio value={0}>{t('yes')} </Radio>
                <Radio value={1}>{t('no')}</Radio>
              </Radio.Group>
            </span>
          </div>
          <div className="normalBtn" onClick={handleBaoPledge}>
            {t('confirm')}
          </div>
        </div>
        <div className="recordYuEBox">
          <div className="recordTitle">{t('zhangRecord')}</div>
          {swapRecord?.map((item: any) => {
            return (
              <div className="recordBoxItem">
                <div>
                  <p>{t('timeZhou')}</p>
                  <span className="yuEDay">{item.pledgeCycle}天</span>
                </div>
                <div>
                  <p>{t('gongNum')}</p>
                  <span>{getCoinDisplay(formatAmountByApi(item.pledgeCake))}</span>
                </div>
                <div>
                  <p>{t('shouRates')}</p>
                  <span>{Number(item.baoDistribute || 0) * 100}%</span>
                </div>
                <div>
                  <p>{t('stakeTime')}</p>
                  <span>{date()(item.pledgeTime)}</span>
                </div>
                <div>
                  <p>{t('isRepay')}</p>
                  <span>
                    <Switch
                      checked={item.isReinvest === 0}
                      onChange={(e) => {
                        switchChange(e, item)
                      }}
                    />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

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
            <div className={'currToken noramToken'}>CAKE</div>
          </div>
          <div className="withdrawIptBox">
            <p>{t('inputAdd')}</p>
            <div>
              <Input className="withdrawIpt" value={withdrawValue} onChange={handleChangeWithdrawValue}></Input>
              <div onClick={handleMaxWithdraw}>{t('max')}</div>
            </div>
          </div>
          <div className="sureBtn" onClick={handleSureWithdraw}>
            {t('confirm')}
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
          <div className="withdrawTitle">{t('zhuanchu')}</div>
          <div className="tokenBox">
            <div className={'currToken noramToken'}>CAKE</div>
          </div>
          <div className="withdrawIptBox">
            <p>{t('inputAdd')}</p>
            <div>
              <Input className="withdrawIpt" value={goOutValue} onChange={handleChangeGoOutValue}></Input>
              <div onClick={handleMaxGoOutValue}>{t('max')}</div>
            </div>
          </div>
          <div className="sureBtn" onClick={handleMaxGoOut}>
            {t('confirm')}
          </div>
        </Modal>
      </div>
    </LayoutElement>
  )
}

export default Fund
