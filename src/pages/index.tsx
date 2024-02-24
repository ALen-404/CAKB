import { message } from 'antd'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { erc20ABI, useAccount, useBalance, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi'

import { getHome, loginDapp } from '@/apis'
import { LayoutElement } from '@/components/layout'

import footer from '../assets/image/index/footer.png'
import manage from '../assets/image/index/manage.png'
import market from '../assets/image/index/market.png'
import p1 from '../assets/image/index/p1.png'
import p2 from '../assets/image/index/p2.png'
import p3 from '../assets/image/index/p3.png'
import p4 from '../assets/image/index/p4.png'
import p5 from '../assets/image/index/p5.png'
import p6 from '../assets/image/index/p6.png'
import p7 from '../assets/image/index/p7.png'
import p8 from '../assets/image/index/p8.png'
import p9 from '../assets/image/index/p9.png'
import stake from '../assets/image/index/stake.png'
import topBackground from '../assets/image/index/topBackground.png'

import './index.less'

const Home = () => {
  const [res, setRes] = useState<any>({})

  const navigate = useNavigate()
  const formatNumber = (data: any) => {
    if (data) {
      return Number(data).toFixed(0)
    }
    return 0
  }

  useEffect(() => {
    getHome().then((res: any) => {
      if (res.code === 200) {
        console.log(res.data, 'getHome')
        setRes(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <div className="topText">
          <p>{t('indexTopTitle')}</p>
          <p>{t('indexTopInfo')}</p>
          <p className="botText">{t('topTextbotTitle')}</p>
        </div>
        <div className="incomeCard">
          <div className="cardCell">
            <p className="incomeTitle">{t('incomeTitleOne')}</p>
            <span> {formatNumber(res?.pledge)}CGR</span>
          </div>
          <div className="cardCell">
            <p className="incomeTitle">{t('incomeTitleTwo')}</p>
            <span>{formatNumber(res?.value)}</span>
          </div>
          <div className="cardCell">
            <p className="incomeTitle">{t('incomeTitleThr')}</p>
            <span>{formatNumber(res?.rewards)}</span>
          </div>
        </div>
        <div className="usePlace">
          <p className="usePlaceTitle">{t('usePlaceTitle')}</p>
          <div className="usePlaceBotBox">
            <div className="usePlaceBotCell">
              <img src={manage} alt="manage" />
              <p>{t('usePlaceBotCellOneTitle')}</p>
              <span>{t('usePlaceBotCellOneInfo')}</span>
            </div>
            <div className="usePlaceBotCell">
              <img src={stake} alt="manage" />
              <p>{t('usePlaceBotCellTwoTitle')}</p>
              <span>{t('usePlaceBotCellTwoInfo')}</span>
            </div>
            <div className="usePlaceBotCell">
              <img src={market} alt="manage" />
              <p>{t('usePlaceBotCellThrTitle')}</p>
              <span>{t('usePlaceBotCellThrInfo')}</span>
            </div>
          </div>
        </div>
        <div className="partners">
          <p className="partnersTitle">{t('partnersTitle')}</p>
          <div className="partnersBox">
            <img src={p1} alt="" />
            <img src={p2} alt="" />
            <img src={p3} alt="" />
            <img src={p4} alt="" />
            <img src={p5} alt="" />
            <img src={p6} alt="" />
            <img src={p7} alt="" />
            <img src={p8} alt="" />
            <img src={p9} alt="" />
          </div>
          <img
            onClick={() => {
              navigate('/stake')
            }}
            src={footer}
            className="footerPng"
            alt=""
          />
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
