import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Modal, Pagination, Table } from 'antd'
import { Popup } from 'antd-mobile'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getUserInfo } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { copyMsg, date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import copyLink from '../../assets/image/community/copyLink.png'
import footerIcon from '../../assets/image/community/footer.png'
import getCoin from '../../assets/image/community/getCoin.png'
import rightArrow from '../../assets/image/community/rightArrow.png'
import share from '../../assets/image/community/share.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [isShowSetPwd, setIsShowSetPwd] = useState(true)
  const [isShowSetPayMethod, setIsShowSetPayMethod] = useState(true)
  const [orderDate, setOrderDate] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      getUserInfo()
        .then((res: any) => {
          if (res.code === 200) {
            setUserInfo(res.data)
          } else {
            message.error(res.msg)
            navigate('/')
          }
        })
        .catch(() => {
          message.error('請求失敗')
          navigate('/')
        })
    }
  }, [address, navigate])

  const navigateTo = (item: any) => {
    localStorage.setItem('currOrderDate', JSON.stringify(item))
    localStorage.setItem('isPush', 'false')
    setTimeout(() => {
      navigate('/confirmOrder')
    }, 300)
  }

  return (
    <LayoutElement>
      <div className="communityBox">
        <div className="communityCon">
          <div className="conTop">
            <div className="conTopItem">
              <img src={copyLink} alt="copyLink" />
              <p>複製鏈接</p>
            </div>
            <div className="conTopItem">
              <img src={share} alt="copyLink" />
              <p>分享好友</p>
            </div>
            <div className="conTopItem">
              <img src={getCoin} alt="copyLink" />
              <p>賺取利益</p>
            </div>
          </div>
          <div className="conMid">
            <p className="conMidTitle">邀請鏈接</p>
            <p className="inviteLink">https://chatgeometrypro.online/?address={address}</p>
            <p
              onClick={() => {
                copyMsg(`https://chatgeometrypro.online/?address=${address}`, '複製成功')
              }}
              className="copyBtn"
            >
              複製
            </p>
          </div>
          <div className="conBot">
            <div
              onClick={() => {
                navigate('/networkRewards')
              }}
              className="conBotItem"
            >
              <div className="itemTop">
                <p>網體分紅</p>
                <img src={rightArrow} alt="rightArrow" />
              </div>
              <div className="itemBot">
                <p className="itemBotNum">{userInfo?.netReward}</p>
                <p className="itemBotSymbol">CGZ </p>
              </div>
            </div>
            <div
              onClick={() => {
                navigate('/directRewards')
              }}
              className="conBotItem"
            >
              <div className="itemTop">
                <p>直推獎勵</p>
                <img src={rightArrow} alt="rightArrow" />
              </div>
              <div className="itemBot">
                <p className="itemBotNum">{userInfo?.directReward}</p>
                <p className="itemBotSymbol">CGZ </p>
              </div>
            </div>
            <div
              onClick={() => {
                navigate('/teamRewards')
              }}
              className="conBotItem"
            >
              <div className="itemTop">
                <p>團隊獎勵</p>
                <img src={rightArrow} alt="rightArrow" />
              </div>
              <div className="itemBot">
                <p className="itemBotNum">{userInfo?.teamReward}</p>
                <p className="itemBotSymbol">CGZ </p>
              </div>
            </div>
          </div>
        </div>
        <div className="communityFoter">
          <img src={footerIcon} alt="footerIcon" />
        </div>
        <Popup
          visible={isShowPwd}
          onMaskClick={() => {
            setIsPwd(false)
          }}
          onClose={() => {
            setIsPwd(false)
          }}
          bodyStyle={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            minHeight: '258px',
          }}
        >
          <div className="pwdBox">
            <div className="pwdBoxTop">
              <div></div>
              <p className="pwdBoxTopTitle">交易密碼</p>
              <p
                onClick={() => {
                  setIsPwd(false)
                }}
                className="pwdBoxTopCancel"
              >
                取消
              </p>
            </div>
            <input placeholder="請輸入交易密碼" className="pwdBoxBot" type="text" />
            <Button
              onClick={() => {
                setIsPwd(true)
              }}
              className="sureBtn"
            >
              资产不足
            </Button>
          </div>
        </Popup>
      </div>
    </LayoutElement>
  )
}

export default Home
