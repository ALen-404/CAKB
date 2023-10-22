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
  getPledge,
  getPond,
  getQuotes,
  getSwap,
  getUser,
  withdrawal,
} from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useStake from '@/utils/use-stake'
import useSwap from '@/utils/use-swap'

import cake from '../../assets/image/icon.png'
import topBackground from '../../assets/image/index/topBackground.png'
import quotationsIcon from '../../assets/image/swap/quotationsIcon.png'

import './index.less'

const Fund = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [withdrawValue, setWithdrawValue] = useState('')
  const [goOutValue, setGoOutValue] = useState('')

  const [userInfo, setUserInfo] = useState<any>({})
  const [fundConfig, setFundConfig] = useState<any>([{}])
  const [swapRecord, setSwapRecord] = useState<any>([])
  const [isCurrenDays, setIsCurrenDays] = useState<any>('100')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGoOutModalOpen, setIsGoOutModalOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isReopen, setIsReopen] = useState(0)
  const [baoPldgeValue, setBaoPldgeValue] = useState('0')
  const [pondInfo, setPondInfo] = useState<any>({})

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
  const onStake = useStake({ value: isCurrenDays || '0', setIsPending })

  useEffect(() => {
    getPledge().then((res: any) => {
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

  useEffect(() => {
    getPond().then((res: any) => {
      if (res.code === 200) {
        setPondInfo(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

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
  const handleMaxGoOut = () => {
    baoTransfer(formatAmountByApi(userInfo?.balanceCake || '0'), 1, address).then((res: any) => {
      if (res.code === 200) {
        setIsGoOutModalOpen(false)
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
  }

  const changeBaoPldgeValue = (e: any) => {
    if (!e.target.value) {
      setIsCurrenDays('')
      return
    }
    setIsCurrenDays(e.target.value)
  }
  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="fundTopCard">
          <p>{t('jijingchi')}</p>
          <span>{getCoinDisplay(formatAmountByApi(pondInfo?.bigPond))}</span>
        </div>

        <div className="stakeChooseBox">
          <div className="stakeChooseTitle">{t('pledge')}</div>
          <div className="fundInputBox">
            <div className="fundInputBoxTop">
              <p>{t('stakeNum')}</p>
              {/* <span>余额：{getCoinDisplay(formatAmountByApi(userInfo?.baoBalanceCake || '0'))} </span> */}
              <span>
                {t('balance')}：{getBalanceDisplay(cakeTokenBalance)}{' '}
              </span>
            </div>
            <Input
              className="fundIpt"
              value={isCurrenDays}
              onChange={changeBaoPldgeValue}
              // disabled
            ></Input>
          </div>
          <div className="daysBox">
            <div className="dayItemBox">
              <img src={cake} alt="dayItem" />
              <div
                onClick={() => {
                  setIsCurrenDays('100')
                }}
                className={isCurrenDays === '100' ? 'currToken noramToken' : 'noramToken'}
              >
                100CAKE
              </div>
            </div>
            <div className="dayItemBox">
              <img src={cake} alt="dayItem" />
              <div
                onClick={() => {
                  setIsCurrenDays('1000')
                }}
                className={isCurrenDays === '1000' ? 'currToken noramToken' : 'noramToken'}
              >
                1000CAKE
              </div>
            </div>
            <div className="dayItemBox">
              <img src={cake} alt="dayItem" />
              <div
                onClick={() => {
                  setIsCurrenDays('3000')
                }}
                className={isCurrenDays === '3000' ? 'currToken noramToken' : 'noramToken'}
              >
                3000CAKE
              </div>
            </div>
          </div>
          <div className="infoBox">
            <div>
              <p>{t('myStake')}</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.pledgeCake))}</span>
            </div>
            <div>
              <p>{t('suanli')}</p>
              <span>{getCoinDisplay(formatAmountByApi(userInfo?.power))}</span>
            </div>
            <div>
              <p>{t('currLevel')}</p>
              <span>V{userInfo?.vip}</span>
            </div>
          </div>

          <button disabled={isPending} className="normalBtn" onClick={onStake}>
            {t('confirm')}
          </button>
        </div>
        <div className="recordStakeBox">
          <div className="recordTitle">{t('stakeRecord')}</div>
          {swapRecord?.map((item: any) => {
            return (
              <div className="recordBoxItem">
                <div>
                  <p>{t('stakeStatus')}</p>
                  <span className={item.status === 0 ? 'doing yuEDay' : 'done yuEDay'}>
                    {item.status === 0 ? t('pending') : t('complete')}
                  </span>
                </div>
                <div>
                  <p>{t('stakeNum')}</p>
                  <span>{getCoinDisplay(formatAmountByApi(item.pledgeCake))}</span>
                </div>
                <div>
                  <p>{t('suanli')}</p>
                  <span>{getCoinDisplay(formatAmountByApi(item.power))}</span>
                </div>
                <div>
                  <p>{t('stakeTime')}</p>
                  <span>{datetime()(item.pledgeTime)}</span>
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
              <Input className="withdrawIpt" value={goOutValue} onChange={handleChangeGoOutValue}></Input>
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
              <Input className="withdrawIpt" value={withdrawValue} onChange={handleChangeWithdrawValue}></Input>
              <div onClick={handleMaxWithdraw}>{t('max')}</div>
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
