import { Button, message } from 'antd'
import axios from 'axios'
import { BigNumber } from 'ethers'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { erc20ABI, useAccount } from 'wagmi'
import { writeContract } from 'wagmi/actions'

import { getAssetsByUser, getFundRecord } from '@/apis'
import { LayoutElement } from '@/components/layout'

import cgr from '../../assets/image/assets/cgr.png'
import cgz from '../../assets/image/assets/cgz.png'
import usdt from '../../assets/image/assets/usdt.png'

import './index.less'

const Fund = () => {
  const { address } = useAccount()
  const [res, setRes] = useState<any>({})
  const [records, setRecords] = useState<any>([])

  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)

    const hours = `0${date.getHours()}`.slice(-2)
    const minutes = `0${date.getMinutes()}`.slice(-2)
    const seconds = `0${date.getSeconds()}`.slice(-2)

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  const navigate = useNavigate()

  useEffect(() => {
    const currOrderDate = localStorage.getItem('currAssets')
    const initCurrOrderDate = JSON.parse(currOrderDate || '{}')
    console.log(initCurrOrderDate)
    getFundRecord({ symbol: initCurrOrderDate.symbol })
      .then((res: any) => {
        if (res.code === 200) {
          console.log(res.data.records)
          setRecords(res.data.records)
        } else {
          message.error(res.msg)
          navigate('/')
        }
      })
      .catch(() => {
        message.error('請求失敗')
        navigate('/')
      })
    setRes(initCurrOrderDate)
  }, [navigate])

  useEffect(() => {
    const currOrderDate = localStorage.getItem('currAssets')
    const initCurrOrderDate = JSON.parse(currOrderDate || '{}')
    console.log(initCurrOrderDate)
    getFundRecord({ symbol: initCurrOrderDate.symbol }).then((res: any) => {
      if (res.code === 200) {
        console.log(res.data.records)
        setRecords(res.data.records)
      } else {
        message.error(res.msg)
      }
    })

    setRes(initCurrOrderDate)
  }, [])

  const navigateToWithdraw = (item: any) => {
    setTimeout(() => {
      navigate('/withdrawal')
    }, 300)
  }

  const navigateToRecharge = (item: any) => {
    setTimeout(() => {
      navigate('/recharge')
    }, 300)
  }

  return (
    <LayoutElement>
      <div className="assetDetailsBox">
        <div className="assetsContentBox">
          <div className="assetsContentTop">
            <div className="assetsContentTopLeft">
              {res.symbol === 'USDT' && <img className="avatar" src={usdt} alt="" />}
              {res.symbol === 'CGR' && <img className="avatar" src={cgr} alt="" />}
              {res.symbol === 'CGZ' && <img className="avatar" src={cgz} alt="" />}
            </div>
            <p>{res.symbol}</p>
          </div>
          <div className="assetsContentMid">
            <p>{res.usable}</p>
            <p className="assetsContentMidTitle">總資產</p>
          </div>
          <div className="assetsContentBot">
            <div className="assetsContentBotItem">
              <p>{res.usable}</p>
              <p className="assetsContentBotItemTitle">可用資產</p>
            </div>
            <div className="assetsContentBotItem">
              <p>{res.frozen}</p>
              <p className="assetsContentBotItemTitle">凍結資產</p>
            </div>
          </div>
        </div>
        <div className="detailsRecord">
          <p className="recordTitle">交易記錄</p>
          <div className="recordCoontent">
            {records.map((item: any) => {
              return (
                <div className="recordCoontentItem">
                  <div className="recordCoontentItemTop">
                    <div className="recordCoontentItemTopLeft">
                      {item.symbol === 'USDT' && <img className="avatar" src={usdt} alt="" />}
                      {item.symbol === 'CGR' && <img className="avatar" src={cgr} alt="" />}
                      {item.symbol === 'CGZ' && <img className="avatar" src={cgz} alt="" />}
                      <p>{item.symbol}</p>
                    </div>
                    <div className="recordCoontentItemTopRight">{item.amount}</div>
                  </div>
                  <div className="recordCoontentItemBot">
                    <p>{formatDate(item.addTime)}</p>

                    {item.status === 1 && <p className="yellow">审核中</p>}
                    {item.status === 2 && <p className="green">已完成</p>}
                    {item.status === 3 && <p className="red">驳回</p>}
                    {item.status === 4 && <p className="gray">已取消</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {res.symbol !== 'CGZ' && (
          <div className="confirmBuy">
            <Button onClick={navigateToRecharge} className="sureBtn">
              充幣
            </Button>
            <Button onClick={navigateToWithdraw} className="sureBtn">
              提幣
            </Button>
          </div>
        )}
      </div>
    </LayoutElement>
  )
}

export default Fund
