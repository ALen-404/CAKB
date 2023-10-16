import { Input, message, Modal, Pagination, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { useAccount, useBalance, useNetwork, useSignMessage } from 'wagmi'

import { getBind, getPledgeRankList, getPond, loginDapp, withdrawal } from '@/apis'
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
import cakeBot from '../../assets/image/index/cakeBot.png'
import GitHub from '../../assets/image/index/github.png'
import imToken from '../../assets/image/index/imToken.png'
import metamask from '../../assets/image/index/metamask.png'
import Mt from '../../assets/image/index/mt.png'
import Telegram from '../../assets/image/index/telegram.png'
import topBackground from '../../assets/image/index/topBackground.png'
import topEthIcon from '../../assets/image/index/topEthIcon.png'
import Tp from '../../assets/image/index/tp.png'
import Twitter from '../../assets/image/index/twitter.png'

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
      title: '额度',
      dataIndex: 'pledgeCake',
      key: 'stakeNum',
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
    getPledgeRankList(1, 10).then((res: any) => {
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
    getPledgeRankList(res, 10).then((res: any) => {
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
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <img className="topEthIcon" src={topEthIcon} alt="topEthIcon" />

        <div className="rankCard">
          <div className="poolRank">
            <Table className="poolTable" columns={columns} dataSource={rankList} pagination={false} />
          </div>
          <Pagination className="pagination" defaultCurrent={1} total={total} onChange={handlePageChange} />
        </div>

        <div className="cakeBotBox"></div>
        <img className="cakeBot" src={cakeBot} alt="cakeBot" />
      </div>
    </LayoutElement>
  )
}

export default Home
