import { GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { shorten } from '@did-network/dapp-sdk'
import { Button, Layout, Space } from 'antd'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import FundRecords from '../../assets/image/fundRecords.png'
import Icon from '../../assets/image/icon.png'
import Index from '../../assets/image/index.png'
import Mining from '../../assets/image/mining.png'
import MyCommunity from '../../assets/image/myCommunity.png'
import Rank from '../../assets/image/rankingList.png'
import Share from '../../assets/image/share.png'
import Swap from '../../assets/image/swap.png'
import Telegram from '../../assets/image/telegram.png'
import Twitter from '../../assets/image/twitter.png'
import { NetworkSwitcher } from '../SwitchNetworks'
import { ToastActionElement } from '../ui/toast'
import { WalletModal } from '../WalletModal'

import './index.less'

export const LayoutElement = ({ children }: { children: ToastActionElement | undefined }) => {
  const [collapsed, setCollapsed] = useState(false)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const { address } = useAccount()
  const { Header, Footer, Sider, Content } = Layout

  const [show, setShow] = useState(false)

  const toggleModal = (e: boolean) => {
    setShow(e)
  }

  const menuArr = [
    {
      label: '首页',
      key: 'index',
      link: '/index',
      img: Index,
    },
    {
      label: '质押',
      key: 'stake',
      link: '/stake',
      img: Mining,
    },
    {
      label: '兑换',
      key: 'swap',
      link: '/swap',
      img: Swap,
    },
    {
      label: '排行榜',
      key: 'rank',
      link: '/rank',
      img: Rank,
    },
    {
      label: '我的社区',
      key: 'MyCommunity',
      link: '/community',
      img: MyCommunity,
    },
    {
      label: '余额宝',
      key: 'fundRecords',
      link: '/fund',
      img: FundRecords,
    },
    {
      label: '分享应用',
      key: 'share',
      link: '/share',
      img: Share,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme={'light'}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        width={240}
        style={{ minHeight: '100vh' }}
        className="border-gray siderBox"
      >
        <div className="iconBox">
          <img src={Icon} alt="Icon" />
          <p>欢迎来到CAKE</p>
        </div>
        <div className="menuBox">
          {menuArr.map((item) => {
            return (
              <Link key={item.key} to={item.link}>
                <div className="menuItem">
                  <img src={item.img} alt={item.label} />
                  <p>{item.label}</p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="tgBox">
          <a href="" target="_blank">
            <div className="menuItem">
              <img src={Telegram} alt={'Telegram'} />
              <p>Telegram</p>
            </div>
          </a>
          <a href="" target="_blank">
            <div className="menuItem">
              <img src={Twitter} alt={'Twitter'} />
              <p>Twitter</p>
            </div>
          </a>
        </div>
      </Sider>
      {!collapsed && <div className="mask" onClick={toggleCollapsed}></div>}
      <Layout className="bg-white">
        <div className="header h-16  border-white box-border">
          <div className="h-16 border-b-1 border-white box-border">
            <div className="max-w-6xl m-auto h-full flex justify-between items-center sm:px-8 lt-sm:px-4">
              <div className="flex items-center font-bold cursor-pointer" onClick={toggleCollapsed}>
                <MenuUnfoldOutlined />
              </div>
              <div className="flex items-center font-bold cursor-pointer">
                <img className="w-12 h-12" src={Icon} alt="Icon" />
              </div>
              <div className="flex items-center gap-2 bg-white networkBox">
                <NetworkSwitcher />
                <WalletModal open={show} onOpenChange={toggleModal} close={() => setShow(false)}>
                  {({ isLoading }) => (
                    <Button className="flex items-center ">
                      {isLoading && (
                        <span className="i-line-md:loading-twotone-loop inline-flex mr-1 w-4 h-4 text-white"></span>
                      )}{' '}
                      {address ? shorten(address) : 'Connect Wallet'}
                    </Button>
                  )}
                </WalletModal>
              </div>
              <div>
                <GlobalOutlined />
              </div>
            </div>
          </div>
        </div>
        <Content className="bg-white">{children}</Content>
      </Layout>
    </Layout>
  )
}
