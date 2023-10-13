import { ArrowDownOutlined } from '@ant-design/icons'
import { Input, Pagination, Table } from 'antd'
import { t } from 'i18next'
import { useAccount } from 'wagmi'

import { LayoutElement } from '@/components/layout'

import Mt from '../../assets/image/index/mt.png'
import topBackground from '../../assets/image/index/topBackground.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()

  return (
    <LayoutElement>
      <div className="indexTop">
        <div className="indexTopImgBox">
          <img src={topBackground} alt="topBackground" />
        </div>
        <div className="buyBox">
          <div className="buyItem">
            <p>{t('TotalPurchaseAmount')}CAKB</p>
            <span>1260.05</span>
          </div>
          <div className="buyItem">
            <p>{t('TotalAmountDestroyed')}CAKB</p>
            <span>500.23</span>
          </div>
        </div>
        <div className="swapCard">
          <p className="swapTitle">{t('swap')}</p>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <Input className="inputBtn"></Input>
              <p>Balance：0</p>
            </div>
            <div className="inputBoxRight">
              <img src={Mt} alt="" />
              <p>CAKE</p>
            </div>
          </div>
          <div className="inputIcon">
            <ArrowDownOutlined />
          </div>
          <div className="inputBox">
            <div className="inputBoxLeft">
              <Input className="inputBtn"></Input>
              <p>Balance：0</p>
            </div>
            <div className="inputBoxRight">
              <img src={Mt} alt="" />
              <p>CAKE</p>
            </div>
          </div>
          <div className="rate">
            <img src={Mt} alt="" />
            <p>1CAKE=8CAKB</p>
          </div>
          <div className="normalBtn">{t('confirm')}</div>
        </div>
        <div className="recordBox">
          <div className="recordTitle">
            {t('swap')}
            {t('record')}
          </div>
          <div className="recordBoxItem">
            <div>
              <p>
                {t('swap')}
                {t('time')}
              </p>
              <span>2023-12-13 10:12</span>
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
              <span>1000</span>
            </div>
          </div>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
