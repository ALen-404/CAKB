import { GlobalOutlined } from '@ant-design/icons'
import { shorten } from '@did-network/dapp-sdk'
import { Button, Dropdown, Layout, MenuProps } from 'antd'
import { changeLanguage, t } from 'i18next'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { copyMsg } from '@/utils/formatter'

import FundRecords from '../../assets/image/fundRecords.png'
import Assets from '../../assets/image/header/assets.png'
import Buy from '../../assets/image/header/buy.png'
import Community from '../../assets/image/header/community.png'
import Guessing from '../../assets/image/header/guessing.png'
import Index from '../../assets/image/header/home.png'
import noticeS from '../../assets/image/header/noticeS.png'
import Stake from '../../assets/image/header/stake.png'
import Swap from '../../assets/image/header/swap.png'
import Logo from '../../assets/image/index/logo.png'
import Menu from '../../assets/image/swap/menu.png'
import { NetworkSwitcher } from '../SwitchNetworks'
import { ToastActionElement } from '../ui/toast'
import { WalletModal } from '../WalletModal'

import './index.less'

export const LayoutElement = ({ children }: { children: ToastActionElement | undefined }) => {
  const [collapsed, setCollapsed] = useState(true)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const { address } = useAccount()
  const { Header, Footer, Sider, Content } = Layout

  const [show, setShow] = useState(false)
  const [isShowLauBox, setIsShowLauBox] = useState(false)

  const toggleModal = (e: boolean) => {
    setShow(e)
  }

  const menuArr = [
    {
      label: '首頁',
      key: 'index',
      link: '/index',
      img: Index,
    },
    {
      label: '質押',
      key: 'stake',
      link: '/stake',
      img: Stake,
    },
    {
      label: '兌換',
      key: 'swap',
      link: '/swap',
      img: Swap,
    },
    {
      label: '購買CGR',
      key: 'buyCGR',
      link: '/buyCGR',
      img: Buy,
    },
    {
      label: '我的社區',
      key: 'community',
      link: '/community',
      img: Community,
    },
    {
      label: '我的資產',
      key: 'assets',
      link: '/assets',
      img: Assets,
    },
    {
      label: '競猜',
      key: 'guessing',
      link: '/guessing',
      img: Guessing,
    },

    // {
    //   label: t('MyCommunity'),
    //   key: 'MyCommunity',
    //   link: '/share',
    //   img: MyCommunity,
    // },
    // {
    //   label: t('YuEbao'),
    //   key: 'fundRecords',
    //   link: '/fund',
    //   img: FundRecords,
    // },
    // {
    //   label: t('shar'),
    //   key: 'share',
    //   link: '/share',
    //   img: Share,
    // },
  ]

  const items = [
    {
      key: 'en',
      label: 'EN',
    },
    {
      key: 'zh',
      label: 'ZH',
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
          <p className="iconBoxTitle">ID {address?.slice(0, 8)}</p>
          <p className="iconBoxInfo">
            {address?.slice(0, 4)}...
            {address?.slice(address?.length - 4, address?.length)}
          </p>
        </div>
        <div className="inviteBox">
          <div className="inviteBoxTop">
            <p className="inviteTitle">邀請鏈接</p>
            <p
              onClick={() => {
                copyMsg(`https://chatgeometrypro.online/?address=${address}`, '複製成功')
              }}
              className="inviteCopy"
            >
              複製鏈接
            </p>
          </div>
          <div className="inviteAddress">
            <p>https://chatgeometrypro.online/?address={address}</p>
          </div>
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
        {/* <div className="tgBox">
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
        </div> */}
      </Sider>
      {!collapsed && <div className="mask" onClick={toggleCollapsed}></div>}
      <Layout className="bg-white">
        <div className="header h-16  border-white box-border">
          <div className="h-16 border-b-1 border-white box-border">
            <div className="max-w-6xl m-auto h-full flex justify-between items-center sm:px-8 lt-sm:px-4">
              <div className="flex items-center font-bold cursor-pointer">
                <img className="w-9 h-9" src={Logo} alt="Icon" />
                <p className="ml-2 ">CGR</p>
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
              <div className="notice">
                <Link to={'/notice'}>
                  <img src={noticeS} alt="noticeS" />
                </Link>
              </div>
              {/* <div>
                <img
                  src={Language}
                  className="w-12 h-12"
                  onClick={() => {
                    setIsShowLauBox(!isShowLauBox)
                  }}
                />
                {isShowLauBox && (
                  <div className="languageBox">
                    {items.map((res) => {
                      return (
                        <div
                          key={res.key}
                          className="languageItem"
                          onClick={() => {
                            changeLanguage(res.key)
                            setIsShowLauBox(false)
                          }}
                        >
                          {res.label}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div> */}
              <div className="flex items-center font-bold cursor-pointer text-black" onClick={toggleCollapsed}>
                {/* <MenuUnfoldOutlined /> */}
                <img className="w-12 h-12" src={Menu} alt="menu" />
              </div>
            </div>
          </div>
        </div>
        <Content className="bg-white">{children}</Content>
      </Layout>
    </Layout>
  )
}
