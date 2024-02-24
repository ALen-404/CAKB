import { Dropdown, MenuProps, message } from 'antd'
import axios from 'axios'
import { BigNumber } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { erc20ABI, useAccount } from 'wagmi'
import { writeContract } from 'wagmi/actions'

import { getAssetsByUser } from '@/apis'
import { LayoutElement } from '@/components/layout'

import cgr from '../../assets/image/assets/cgr.png'
import cgz from '../../assets/image/assets/cgz.png'
import payPwd from '../../assets/image/assets/payPwd.png'
import setting from '../../assets/image/assets/setting.png'
import usdt from '../../assets/image/assets/usdt.png'

import './index.less'

const Fund = () => {
  const { address } = useAccount()
  const [res, setRes] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!address) {
      return
    }
    getAssetsByUser()
      .then((res: any) => {
        if (res.code === 200) {
          setRes(res.data)
        } else {
          message.error(res.msg)
          navigate('/')
        }
      })
      .catch(() => {
        message.error('請求失敗')
        navigate('/')
      })
  }, [address, navigate])

  const navigateTo = (item: any) => {
    localStorage.setItem('currAssets', JSON.stringify(item))
    setTimeout(() => {
      navigate('/assetsDetails')
    }, 300)
  }
  const items: MenuProps['items'] = [
    {
      key: '3',
      label: <Link to={'/payPwd'}>交易密碼</Link>,
      icon: (
        <img
          style={{
            width: '21px',
            marginRight: '7px',
          }}
          src={payPwd}
          alt="Order"
        ></img>
      ),
    },
  ]
  return (
    <LayoutElement>
      <div className="assetBox">
        <div className="assetsContent">
          <div className="assetsContentTop">
            <div className="assetsContentLeft">
              <div className="avatar">{address?.slice(address?.length - 4, address?.length)}</div>
              <p>
                {address?.slice(0, 4)}...
                {address?.slice(address?.length - 4, address?.length)}
              </p>
            </div>
            <div className="assetsContentRight">
              <Dropdown menu={{ items }}>
                <div className="more">
                  <img src={setting} alt="setting" />
                  <p>設置</p>
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="assetsContentMid">
            <p className="assetsContentMidTitle">{t('assetsTitle')}</p>
            <div className="assetsContentMidCell">
              <div
                className="cellTop"
                onClick={() => {
                  navigateTo(res?.USDT)
                }}
              >
                <div className="cellTopLeft">
                  <img src={usdt} alt="" />
                  USDT
                </div>
                <p>
                  {res?.USDT?.usable || 0} {'>'}
                </p>
              </div>
              <div className="cellBot">
                <div className="cellBotItem">
                  <p>{res?.USDT?.usable || 0}</p>
                  <span>{t('availableUSDT')}</span>
                </div>
                <div className="cellBotItem">
                  <p>{res?.USDT?.frozen || 0}</p>
                  <span>{t('freezeUSDT')}</span>
                </div>
              </div>
            </div>
            <div className="assetsContentMidCell">
              <div
                className="cellTop"
                onClick={() => {
                  navigateTo(res?.CGR)
                }}
              >
                <div className="cellTopLeft">
                  <img src={cgr} alt="" />
                  CGR
                </div>
                <p>
                  {res?.CGR?.usable || 0}
                  {'>'}
                </p>
              </div>
              <div className="cellBot">
                <div className="cellBotItem">
                  <p>{res?.CGR?.usable || 0}</p>
                  <span>{t('availableUSDT')}</span>
                </div>
                <div className="cellBotItem">
                  <p>{res?.CGR?.frozen || 0}</p>
                  <span>{t('freezeUSDT')}</span>
                </div>
              </div>
            </div>
            <div className="assetsContentMidCell">
              <div
                className="cellTop"
                onClick={() => {
                  navigateTo(res?.CGZ)
                }}
              >
                <div className="cellTopLeft">
                  <img src={cgz} alt="" />
                  CGZ
                </div>
                <p>
                  {res?.CGZ?.usable || 0} {'>'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Fund
