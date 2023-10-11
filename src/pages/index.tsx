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

import binance from '../assets/image/index/binance.png'
import BitKeep from '../assets/image/index/bitkeep.png'
import cakeBot from '../assets/image/index/cakeBot.png'
import GitHub from '../assets/image/index/github.png'
import imToken from '../assets/image/index/imToken.png'
import metamask from '../assets/image/index/metamask.png'
import Mt from '../assets/image/index/mt.png'
import Telegram from '../assets/image/index/telegram.png'
import topBackground from '../assets/image/index/topBackground.png'
import topEthIcon from '../assets/image/index/topEthIcon.png'
import Tp from '../assets/image/index/tp.png'
import Twitter from '../assets/image/index/twitter.png'

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
        <img className="topEthIcon" src={topEthIcon} alt="topEthIcon" />

        <div className="incomeCard">
          <p className="incomeTitle">收益(cake)</p>
          <p className="incomeTotal">2343.00</p>
          <div className="incomeToday">今日收益213.23</div>
          <div className="currBox">
            <div>
              <p>当前质押CAKE</p>
              <span>466.00</span>
            </div>
            <div>
              <p>CAKB余额</p>
              <span>45.00</span>
            </div>
          </div>
          <div className="btnBox">
            <div className="arrowBtn">提现</div>
            <div className="normalBtn">转入余额宝</div>
          </div>
        </div>
        <div className="ticketsCard">
          <p className="ticketsCardTitle">购买门票</p>
          <p className="ticketsCardInfo">必须购买通证CAKB才能参与投币</p>
          <div className="ticketsCardBox">
            <div className="buyBtn">购买门票</div>
            <div className="normalBtn">立即投资</div>
          </div>
        </div>
        <div className="poolCard">
          <p className="poolCardTitle">奖金池</p>
          <p className="poolCardNum">10000000.00 </p>
          <div className="countdown">
            <div className="countdownItem">24</div>：<div className="countdownItem">24</div>：
            <div className="countdownItem">24</div>
          </div>
          <div className="poolRank">
            <p className="rankTitle">大单质押排名池</p>
            <p className="rankNum">500000.00 </p>
            <Table className="poolTable" columns={columns} dataSource={data} pagination={false} />
          </div>
          <Pagination className="pagination" defaultCurrent={1} total={50} />
        </div>
        <div className="fomoCard">
          <p className="fomoCardTitle">股东分红池</p>
          <p className="fomoNum">355600.00 </p>
          <div className="countdown">
            <div className="countdownItem">24</div>：<div className="countdownItem">24</div>：
            <div className="countdownItem">24</div>
          </div>
        </div>
        <div className="partners">
          <p className="partnersTitle">合作伙伴</p>
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
          <p className="aboutTitle">关于我们</p>
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
      </div>
    </LayoutElement>
  )
}

export default Home
