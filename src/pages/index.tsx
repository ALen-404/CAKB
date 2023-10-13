import { Pagination, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { t } from 'i18next'
import { useAccount, useBalance, useNetwork } from 'wagmi'

import { LayoutElement } from '@/components/layout'
import { NetworkSwitcher } from '@/components/SwitchNetworks'
import { useToast } from '@/components/ui/use-toast'
import { WalletModal } from '@/components/WalletModal'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { useCopyToClipboard } from '@/hooks/useCopy'
import { getBalanceDisplay } from '@/utils/formatter'

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
  const { chain } = useNetwork()

  const cakeTokenBalance = useBalance({
    address,
    token: getCakeAddress(chain?.id),
    watch: true,
  })
  const cakbTokenBalance = useBalance({
    address,
    token: getCakbAddress(chain?.id),
    watch: true,
  })

  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <img className="topEthIcon" src={topEthIcon} alt="topEthIcon" />

        <div className="incomeCard">
          <p className="incomeTitle">{t('income')}(cake)</p>
          <p className="incomeTotal">2343.00</p>
          <div className="incomeToday">{t('TodayEarnings')}213.23</div>
          <div className="currBox">
            <div>
              <p>{t('CurrentPledge')}CAKE</p>
              <span>466.00</span>
            </div>
            <div>
              <p>CAKB{t('balance')}</p>
              <span>{getBalanceDisplay(cakbTokenBalance)}</span>
            </div>
          </div>
          <div className="btnBox">
            <div className="arrowBtn">{t('Withdrawal')}</div>
            <div className="normalBtn">{t('Transferred')}</div>
          </div>
        </div>
        <div className="ticketsCard">
          <p className="ticketsCardTitle">{t('PurchaseTickets')}</p>
          <p className="ticketsCardInfo">{t('butTicketsInfo')}</p>
          <div className="ticketsCardBox">
            <div className="buyBtn">{t('PurchaseTickets')}</div>
            <div className="normalBtn">{t('ImmediateInvestment')}</div>
          </div>
        </div>
        <div className="poolCard">
          <p className="poolCardTitle">{t('bonusPool')}</p>
          <p className="poolCardNum">10000000.00 </p>
          <div className="countdown">
            <div className="countdownItem">24</div>：<div className="countdownItem">24</div>：
            <div className="countdownItem">24</div>
          </div>
          <div className="poolRank">
            <p className="rankTitle">{t('poolRank')}</p>
            <p className="rankNum">500000.00 </p>
            <Table className="poolTable" columns={columns} dataSource={data} pagination={false} />
          </div>
          <Pagination className="pagination" defaultCurrent={1} total={50} />
        </div>
        <div className="fomoCard">
          <p className="fomoCardTitle">{t('dividendPool')}</p>
          <p className="fomoNum">355600.00 </p>
          <div className="countdown">
            <div className="countdownItem">24</div>：<div className="countdownItem">24</div>：
            <div className="countdownItem">24</div>
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
      </div>
    </LayoutElement>
  )
}

export default Home
