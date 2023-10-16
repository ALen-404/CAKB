import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Input, message, Pagination, Table } from 'antd'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getQuotes, getSwap, getUser } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import topBackground from '../../assets/image/index/topBackground.png'
import cakb from '../../assets/image/swap/cakb.png'
import cake from '../../assets/image/swap/cake.png'
import quotationsIcon from '../../assets/image/swap/quotationsIcon.png'
import swapIcon from '../../assets/image/swap/swapIcon.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [swapCakeAmount, setSwapCakeAmount] = useState('0')
  const [swapCakbAmount, setSwapCakbAmount] = useState('0')
  const [marketQuotationsShow, setMarketQuotationsShow] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const [userInfo, setUserInfo] = useState<any>({})
  const [swapRecord, setSwapRecord] = useState<any>([])
  const [cakbQuotes, setCakbQuotes] = useState<any>([])
  const [cakbQuotesTime, setCakbQuotesTime] = useState<any>([])

  const cakbBurnTokenBalance = useBalance({
    address: '0x000000000000000000000000000000000000dEaD',
    token: getCakbAddress(chain?.id),
    watch: true,
  })

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

  const swapInfo = useContractRead({
    address: getSwapAddress(chain?.id),
    abi: swapABI,
    functionName: 'getSwapInfo',
  })

  const getSwapEstimate = useContractRead({
    address: getSwapAddress(chain?.id),
    abi: swapABI,
    functionName: 'swapEstimate',
    args: [false, BN.from(swapCakeAmount || '0').toBigInt()],
  })

  const handleCakeChange = (e: any) => {
    if (!Number(e.target.value)) {
      setSwapCakeAmount('')
      return
    }
    setSwapCakeAmount(e.target.value)
  }
  useEffect(() => {
    setSwapCakbAmount(getSwapEstimate?.data?.toString() || '0')
  }, [getSwapEstimate?.data])

  useEffect(() => {
    getUser().then((res: any) => {
      if (res.code === 200) {
        setUserInfo(res.data.records)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const onSwap = useSwap({ value: swapCakeAmount || '0', setIsPending })

  useEffect(() => {
    getSwap().then((res: any) => {
      if (res.code === 200) {
        setSwapRecord(res.data.records)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  useEffect(() => {
    getQuotes().then((res: any) => {
      if (res.code === 200) {
        const cakbArketValueList = res?.data?.records?.map((res: any) =>
          formatAmountByApi(res.cakbArketValue)
            ?.match(/^-?\d+(?:\.\d{0,2})?/)
            ?.toString()
        )
        const cakbArketTimeList = res?.data?.records?.map((res: any) => date()(res.time))
        setCakbQuotes(cakbArketValueList)
        setCakbQuotesTime(cakbArketTimeList)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const options = {
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['市值'],
    },

    init: {
      innerHeight: '220px',
    },
    grid: {
      left: '3%',
      containLabel: true,
    },

    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: cakbQuotesTime,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '市值',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: cakbQuotes,
      },
    ],
  }
  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <div className="buyBox">
          <div className="buyItem">
            <p>{t('TotalPurchaseAmount')}CAKB</p>
            <span>{getCoinDisplay(formatAmountByApi(swapInfo?.data?.total_exchange_amount.toString() || '0'))}</span>
          </div>
          <div className="buyItem">
            <p>{t('TotalAmountDestroyed')}CAKB</p>
            <span>{getBalanceDisplay(cakbBurnTokenBalance)}</span>
          </div>
        </div>
        <div className="swapCard">
          <p className="swapTitle">{t('swap')}</p>
          <div
            className="quotationsIcon"
            onClick={() => {
              setMarketQuotationsShow(true)
            }}
          >
            <img src={quotationsIcon} alt="quotationsIcon" />
          </div>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <Input className="inputBtn" value={swapCakeAmount} onChange={handleCakeChange}></Input>
              <p>Balance：{getBalanceDisplay(cakeTokenBalance)}</p>
            </div>
            <div className="inputBoxRight">
              <img src={cake} alt="" />
              <p>CAKE</p>
            </div>
          </div>
          <div className="inputIcon">
            <ArrowDownOutlined />
          </div>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <Input className="inputBtn" value={swapCakbAmount}></Input>
              <p>Balance：{getBalanceDisplay(cakbTokenBalance)}</p>
            </div>
            <div className="inputBoxRight">
              <img src={cakb} alt="" />
              <p>CAKB</p>
            </div>
          </div>
          <div className="rate">
            <img src={swapIcon} alt="" />
            <p>
              1CAKE=
              {getCoinDisplay(
                new BigNumber(swapInfo.data?.cakePrice?.toString() || '0')
                  .div(swapInfo.data?.cakbPrice?.toString() || '0')
                  .toString()
              )}
              CAKB
            </p>
          </div>
          <button disabled={isPending} className="normalBtn" onClick={onSwap}>
            {t('confirm')}
          </button>
        </div>
        <div className="recordBox">
          <div className="recordTitle">
            {t('swap')}
            {t('record')}
          </div>
          {swapRecord?.map((item: any) => {
            return (
              <div className="recordBoxItem">
                <div>
                  <p>
                    {t('swap')}
                    {t('time')}
                  </p>
                  <span>{datetime()(item.transactionTime)}</span>
                </div>
                <div>
                  <p>
                    {t('swap')}
                    {t('token')}
                  </p>
                  <span>cake-Cakb</span>
                </div>
                <div>
                  <p>
                    {t('swap')}
                    {t('amount')}
                  </p>
                  <span>{getCoinDisplay(formatAmountByApi(item.cakbAmount))}</span>
                </div>
              </div>
            )
          })}
        </div>
        {marketQuotationsShow && <div className="mask"></div>}
        {marketQuotationsShow && (
          <div className="marketQuotationsBox">
            <div className="marketQuotationsTop">
              <p>行情走势</p>
              <p
                onClick={() => {
                  setMarketQuotationsShow(false)
                }}
              >
                X
              </p>
            </div>

            <div className="currBox">
              <div className="currBoxTop">
                <div className="logoBox">
                  <img src={cake} alt="cakb" />
                  <p>CAKB</p>
                </div>
                <div className="priceBox">
                  <p>当前价格：</p>
                  <span>{getCoinDisplay(formatAmountByApi(swapInfo?.data?.cakbPrice?.toString() || '0'))} </span>
                </div>
              </div>
              <div className="currBoxBot">
                <div className="currBoxBotItem">
                  <p>CAKB总市值</p>
                  <span>{getCoinDisplay(formatAmountByApi(swapInfo?.data?.cakb_arket_value?.toString() || '0'))}</span>
                </div>
                <div className="currBoxBotItem">
                  <p>流动池资金量</p>
                  <span>
                    {getCoinDisplay(
                      new BigNumber(formatAmountByApi(swapInfo?.data?.cakb_arket_value?.toString() || '0'))
                        .div(formatAmountByApi(swapInfo?.data?.cakbPrice?.toString() || '0'))
                        .toString()
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="charts">
              <ReactECharts className="chartsItem" option={options} />
            </div>
          </div>
        )}
      </div>
    </LayoutElement>
  )
}

export default Home
