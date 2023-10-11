import { formatAmount, shorten } from '@did-network/dapp-sdk'
import { Pagination, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useAccount } from 'wagmi'

import { LayoutElement } from '@/components/layout'
import { Header } from '@/components/layout/Header'
import { NetworkSwitcher } from '@/components/SwitchNetworks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { WalletModal } from '@/components/WalletModal'
import { useWagmi } from '@/hooks'
import { useCopyToClipboard } from '@/hooks/useCopy'

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

  const [show, setShow] = useState(false)

  const toggleModal = (e: boolean) => {
    setShow(e)
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
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '质押数量',
      dataIndex: 'stakeNum',
      key: 'stakeNum',
    },
  ]

  const data: DataType[] = [
    {
      rank: '1',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '2',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '3',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '4',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '5',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '6',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '7',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '8',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '9',
      address: '0xds...a23f',
      stakeNum: '3200.00',
    },
    {
      rank: '10',
      address: '0xds...a23f',
      stakeNum: '3200.00',
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

  const copyHandler = useCallback(() => {
    copy('pnpm dlx fisand')

    toast({
      title: 'Copied success!',
    })
  }, [copy, toast])

  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <div className="buyBox">
          <div className="buyItem">
            <p>购买总量CAKB</p>
            <span>1260.05</span>
          </div>
          <div className="buyItem">
            <p>销毁总量CAKB</p>
            <span>500.23</span>
          </div>
        </div>
        <div className="swapCard">
          <p className="swapTitle">兑换</p>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <input type="text" />
              <p>Balance：0</p>
            </div>
            <div className="inputBoxRight">
              <img src={Mt} alt="" />
              <p>CAKE</p>
            </div>
          </div>
          <div>1</div>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <input type="text" />
              <p>Balance：0</p>
            </div>
            <div className="inputBoxRight">
              <img src={Mt} alt="" />
              <p>CAKE</p>
            </div>
          </div>
          <div>
            <img src={Mt} alt="" />
            <p>1CAKE=8CAKB</p>
          </div>
        </div>
        123
      </div>
    </LayoutElement>
  )
}

export default Home
