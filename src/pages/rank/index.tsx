import { Input, message, Modal, Pagination, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { useAccount, useBalance, useNetwork, useSignMessage } from 'wagmi'

import { getBind, getPledgeRankListV2, getPond, loginDapp, withdrawal } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { NetworkSwitcher } from '@/components/SwitchNetworks'
import { useToast } from '@/components/ui/use-toast'
import { WalletModal } from '@/components/WalletModal'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { useCopyToClipboard } from '@/hooks/useCopy'
import { ellipsis, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'

import binance from '../../assets/image/index/binance.png'
import BitKeep from '../../assets/image/index/bitkeep.png'
import GitHub from '../../assets/image/index/github.png'
import imToken from '../../assets/image/index/imToken.png'
import metamask from '../../assets/image/index/metamask.png'
import Mt from '../../assets/image/index/mt.png'
import Telegram from '../../assets/image/index/telegram.png'
import topBackground from '../../assets/image/index/topBackground.png'
import Twitter from '../../assets/image/index/twitter.png'
import Gold1 from '../../assets/image/rank/gold1.png'
import Gold2 from '../../assets/image/rank/gold2.png'
import cakeBot from '../../assets/image/rank/rankBg.png'
import rankIcon from '../../assets/image/rank/rankIcon.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()

  const [mustShow, setMustShow] = useState(false)
  const [parentAddress, setParentAddress] = useState('')
  const [userInfo, setUserInfo] = useState<any>({})
  const [pondInfo, setPondInfo] = useState<any>({})
  const [rankCondown, setRankCondown] = useState<any>({})
  const [poolCondown, setPoolCondown] = useState<any>({})
  const [rankList, setRankList] = useState<any>([])
  const [total, setTotal] = useState<any>('0')

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
      title: t('ranktext'),
      dataIndex: 'rank',
      key: 'rank',
      render: (res, _, index) => {
        return (
          <div>
            {index + 1 == 1 && <img className="rankListIcon" src={Gold1} alt="firstIcon"></img>}
            {index + 1 == 2 && <img className="rankListIcon" src={Gold2} alt="firstIcon"></img>}
            <p>{index + 1}</p>
          </div>
        )
      },
    },
    {
      title: t('address'),
      dataIndex: 'userAddr',
      key: 'address',
      render: (res) => {
        return <p>{ellipsis({ startLength: 4, endLength: 4 })(res)}</p>
      },
    },
    {
      title: t('edu'),
      dataIndex: 'pledgeCake',
      key: 'stakeNum',
      render: (res) => {
        return <p>{getCoinDisplay(formatAmountByApi(res))}</p>
      },
    },
    {
      title: t('rewardS'),
      dataIndex: 'cumulativeIncomeCake',
      key: 'cumulativeIncomeCake',
      render: (res) => {
        return <p>{getCoinDisplay(formatAmountByApi(res))}</p>
      },
    },
  ]

  const [_, copy] = useCopyToClipboard()
  const { toast } = useToast()
  const { chain } = useNetwork()

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
    getPledgeRankListV2(1, 10).then((res: any) => {
      if (res.code === 200) {
        console.log(res.data)
        setRankList(res.data?.records)
        setTotal(res.data?.total)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  const handlePageChange = (res: any) => {
    getPledgeRankListV2(res, 10).then((res: any) => {
      if (res.code === 200) {
        setRankList(res.data?.records)
        setTotal(res.data?.total)
      } else {
        message.error(res.msg)
      }
    })
  }

  return (
    <LayoutElement>
      <div className="rankTop">
        <div className="rankTopTextBox">
          <p>{t('rank')}</p>
        </div>
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <img className="topEthIcon" src={rankIcon} alt="rankIcon" />

        <div className="rankCard">
          <div className="poolRank">
            <Table className="poolTable" columns={columns} dataSource={rankList} pagination={false} />
          </div>
        </div>

        <div className="cakeBotBox"></div>
        <p className="cakeBotText">{t('footerText')}</p>
        <img className="cakeBot" src={cakeBot} alt="cakeBot" />
      </div>
    </LayoutElement>
  )
}

export default Home
