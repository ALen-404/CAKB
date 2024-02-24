import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal, Pagination, Segmented, Select, Table } from 'antd'
import { Popup } from 'antd-mobile'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import {
  getAssetsByUser,
  getExchangePrice,
  getExchangeRecord,
  getPledge,
  getPledgeSet,
  getUserInfo,
  handlePledge,
  handleSwap,
  verifyPassword,
} from '@/apis'
import { LayoutElement } from '@/components/layout'
import { getCakbAddress } from '@/contracts/cakb'
import { getCakeAddress } from '@/contracts/cake'
import { getSwapAddress, swapABI } from '@/contracts/swap'
import { date, datetime, formatAmountByApi, getBalanceDisplay, getCoinDisplay } from '@/utils/formatter'
import useSwap from '@/utils/use-swap'

import Cgz from '../../assets/image/assets/cgz.png'
import Cgr from '../../assets/image/swap/cgr.png'
import DownArrow from '../../assets/image/swap/downArrow.png'
import LeftArrow from '../../assets/image/swap/leftArrow.png'
import Price from '../../assets/image/swap/price.png'
import SwapImg from '../../assets/image/swap/swap.png'
import Usdt from '../../assets/image/swap/usdt.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [timesNumber, setTimesNumber] = useState('1')
  const [topSelectNumber, setTopSelectNumber] = useState(1000)
  const [botSelectNumber, setBotSelectNumber] = useState(0)
  const [currTopSelect, setCurrTopSelect] = useState('1')
  const [isDis, setIsDIs] = useState(true)
  const [btnText, setBtnText] = useState('質押')
  const [stakeRecord, setstakeRecord] = useState<any>([])
  const [stakeSet, setStakeSet] = useState<any>([])
  const [payPwd, setPayPwd] = useState('')
  const [userPayPwd, setUserPayPwd] = useState('')
  const [isShowSetPwd, setIsShowSetPwd] = useState(false)

  const [assets, setAssets] = useState<any>({})
  const [currStakeSet, setCurrStakeSet] = useState<any>()
  const formatDate = (timestamp: string | number | Date) => {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)

    const hours = `0${date.getHours()}`.slice(-2)
    const minutes = `0${date.getMinutes()}`.slice(-2)
    const seconds = `0${date.getSeconds()}`.slice(-2)

    return `${year}-${month}-${day} `
  }

  const [cgrBalance, setCgarBalance] = useState<any>('0')
  const navigate = useNavigate()

  useEffect(() => {
    if (!address) {
      return
    }
    getAssetsByUser()
      .then((res: any) => {
        if (res.code === 200) {
          setAssets(res.data)

          if (new BigNumber(topSelectNumber).gt(res.data.CGR.usable)) {
            setIsDIs(true)
            setBtnText('資金不足')
          } else {
            setIsDIs(false)
            setBtnText('質押')
          }
          setCgarBalance(res.data.CGR.usable)
        } else {
          message.error(res.msg)
          navigate('/')
        }
      })
      .catch(() => {
        message.error('請求失敗')
        navigate('/')
      })
  }, [address, navigate, topSelectNumber])

  const handleSwapToken = () => {
    verifyPassword({
      newPassword: payPwd,
      oldPassword: payPwd,
    })
      .then((res: any) => {
        if (res.code === 200) {
          handlePledge({
            quantity: topSelectNumber,
            id: currTopSelect,
          })
            .then((res: any) => {
              if (res.code === 200) {
                setIsPwd(false)
                message.success('質押成功')
              } else {
                message.error(res.msg)
              }
            })
            .catch(() => {
              message.error('請求失敗')
            })
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }

  useEffect(() => {
    getPledgeSet().then((res: any) => {
      console.log(res)
      setStakeSet(res.data)
      setCurrStakeSet(res?.data[0])
    })
  }, [])

  const topSelectChange = (e: any) => {
    console.log(e)
    const currStakeSet = stakeSet.filter((item: any) => item.id === e)
    setCurrStakeSet(currStakeSet[0])
    setTopSelectNumber(currStakeSet[0].amount)
    setCurrTopSelect(e)
  }

  const [segmentedValue, setSegmentedValue] = useState('1')
  useEffect(() => {
    getPledge({ status: segmentedValue })
      .then((res: any) => {
        if (res.code === 200) {
          setstakeRecord(res.data.records)
        } else {
          message.error(res.msg)
          navigate('/')
        }
      })
      .catch(() => {
        message.error('請求失敗')
        navigate('/')
      })

    getUserInfo()
      .then((res: any) => {
        if (res.code === 200) {
          setUserPayPwd(res?.data?.transactionPassword)
          if (res?.data?.transactionPassword) {
            setIsShowSetPwd(false)
          } else {
            setIsShowSetPwd(true)
          }
          // setOrderDate(res.data.records)
        } else {
          message.error(res.msg)
        }
      })
      .catch(() => {
        message.error('請求失敗')
      })
  }, [isShowPwd, navigate, segmentedValue])
  return (
    <LayoutElement>
      <div className="stakeWarp">
        <div className="swapCard">
          <div className="swapTitleBox">
            <div className="swapTitleTop">
              <div className="swapTitle">
                <img src={Cgr} alt="Cgr" />
                質押CGR
              </div>
              <div className="swapImg">
                <p className="swapImgInfo"></p>
              </div>
            </div>
            <div className="swapTitleBot">選擇質押數量</div>
          </div>
          <div className="swapContent">
            <div className="swapIptTop">
              <div className="swapIptTopItem">
                <Select
                  defaultValue="1"
                  onChange={topSelectChange}
                  style={{ width: 120 }}
                  options={stakeSet.map((item: any) => {
                    return {
                      value: item.id,
                      label: (
                        <div className="itemLeft">
                          <p>質押數量</p>
                          <p>{item.amount}</p>
                        </div>
                      ),
                    }
                  })}
                />
              </div>
            </div>
            <div className="swapConBot">
              <div className="priceInfo">
                <p>週期</p>
                <p>{currStakeSet?.cycle}天</p>
              </div>
              <div className="priceInfo">
                <p>收益率</p>
                <p>{currStakeSet?.yield * 100}%</p>
              </div>
              <p className="expectedRate">
                預計到期後收益為{' '}
                {new BigNumber(currStakeSet?.amount)
                  .times(Number(currStakeSet?.yield) || 0)
                  .times(Number(currStakeSet?.cycle))
                  .toFixed(2)}{' '}
                CGZ
              </p>
              <Button
                onClick={() => {
                  setIsPwd(true)
                }}
                disabled={isDis}
                className={!isDis ? 'sureBtn' : 'sureBtn disBtn'}
              >
                {btnText}
              </Button>

              {/* <p className="stakeRules">{'質押規則 >'}</p> */}
            </div>
          </div>
        </div>
        <div className="recordBox">
          <div className="recordTop">
            <p className="recordTopTitle">質押記錄</p>
            <div></div>
          </div>
          <div className="recordDetailsTop">
            <Segmented
              onChange={(val) => {
                setSegmentedValue(val.toString())
              }}
              options={[
                { label: '收益中', value: '1' },
                { label: '到期', value: '2' },
              ]}
            />
          </div>

          {stakeRecord.map((item: any) => {
            return (
              <div className="recordCon">
                <div className="recordConLeft">
                  <div className="leftCell">
                    <p className="leftCellTitle">質押</p>
                    <img src={Cgr} alt="cgr" className="leftImg"></img>
                    <p className="leftCellAmout">{item.quantity} CGR</p>
                  </div>
                  <div className="leftCell">
                    <p className="leftCellTitle">週期：{item.cycle}天</p>
                  </div>
                  <div className="leftCell">
                    <p className="leftCellTitle">開始時間：{formatDate(item.startTime)}</p>
                  </div>
                </div>
                <div className="recordConLeft">
                  <div className="leftCell">
                    <p className="leftCellTitle">获取：{item.reward} CGZ</p>
                  </div>
                  <div className="leftCell">
                    <p className="leftCellTitle">收益率：{item.yield * 100}%</p>
                  </div>
                  <div className="leftCell">
                    <p className="leftCellTitle">到期時間：{formatDate(item.stopTime)}</p>
                  </div>
                </div>
              </div>
            )
          })}
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
            <input
              onChange={(e) => {
                setPayPwd(e.target.value)
              }}
              type="password"
              placeholder="請輸入交易密碼"
              className="pwdBoxBot"
            />
            <Button
              onClick={() => {
                handleSwapToken()
              }}
              className="sureBtn"
            >
              質押
            </Button>
          </div>
        </Popup>
        <Modal
          title=""
          open={isShowSetPwd}
          onOk={() => {
            navigate('/payPwd')
          }}
          className="modalTips"
          onCancel={() => {
            setIsShowSetPwd(false)
          }}
          okText={'去設置'}
          cancelText={'取消'}
        >
          <p className="modalTipsTitle">提示</p>
          <p className="modalTipsTitleInfo">您還未設置交易密碼，請先設置！</p>
        </Modal>
      </div>
    </LayoutElement>
  )
}

export default Home
