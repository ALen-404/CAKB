import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, message, Modal, Pagination, Select, Table } from 'antd'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { getBalance } from 'viem/_types/actions/public/getBalance'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import {
  getAssetsByConditions,
  getAssetsByUser,
  getExchangePrice,
  getExchangeRecord,
  getUserInfo,
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
  const [topSelectNumber, setTopSelectNumber] = useState(0)
  const [botSelectNumber, setBotSelectNumber] = useState(0)
  const [currTopSelect, setCurrTopSelect] = useState('GPO')
  const [currUseableGpo, setCurrUseableGpo] = useState('0')
  const [currUseableGpt, setCurrUseableGpt] = useState('0')
  const [currUseableGpf, setCurrUseableGpf] = useState('0')
  const [currUseableGpth, setCurrUseableGpth] = useState('0')
  const [payPwd, setPayPwd] = useState('')
  const [userPayPwd, setUserPayPwd] = useState('')
  const [currBotSelect, setCurrBotSelect] = useState('GPT')
  const [swapRecord, setSwapRecord] = useState<any>([])
  const navigate = useNavigate()
  const [isShowSetPwd, setIsShowSetPwd] = useState(false)
  const [assets, setAssets] = useState<any>({})
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
  useEffect(() => {
    if (!address) {
      return
    }
    getAssetsByUser()
      .then((res: any) => {
        if (res.code === 200) {
          setAssets(res.data)
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

  const handleSwapToken = () => {
    verifyPassword({
      newPassword: payPwd,
      oldPassword: payPwd,
    })
      .then((res: any) => {
        if (res.code === 200) {
          handleSwap({
            quantity: topSelectNumber,
            symbol: `${currTopSelect}/${currBotSelect}`,
          })
            .then((res: any) => {
              if (res.code === 200) {
                message.success('兌換成功')
                setIsPwd(false)
                getExchangeRecord().then((res: any) => {
                  setSwapRecord(res.data.records)
                })
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
  // const handleGetExchangePrice = () => {
  //   getExchangePrice({
  //     fromSymbol: currTopSelect,
  //     toSymbol: currBotSelect,
  //   }).then((res) => {
  //     console.log(res)
  //   })
  // }

  useEffect(() => {
    getExchangePrice({
      fromSymbol: currTopSelect,
      toSymbol: currBotSelect,
    }).then((res: any) => {
      setTimesNumber(res.data)
    })
  }, [currBotSelect, currTopSelect, setTimesNumber])

  useEffect(() => {
    getExchangeRecord().then((res: any) => {
      setSwapRecord(res.data.records.filter((item: any) => item.toSymbol !== 'GPO' && item.formSymbol !== 'GPO'))
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
  }, [])
  const topSelectChange = (e: any) => {
    setCurrTopSelect(e)
    if (e === 'GPO' && currBotSelect === 'GPO') {
      setCurrBotSelect('GPT')
    }
    if (e === 'GPT' && currBotSelect === 'GPT') {
      setCurrBotSelect('GPO')
    }
    if (e === 'GPF' && currBotSelect === 'GPF') {
      setCurrBotSelect('GPO')
    }
  }
  const botSelectChange = (e: any) => {
    setCurrBotSelect(e)
  }

  const handleChangeTopValue = (val: any) => {
    console.log(val)

    if (!val || new BigNumber(val).gt(getCoin(currTopSelect).value)) {
      setTopSelectNumber(0)
      setBotSelectNumber(0)
    } else {
      setTopSelectNumber(val)
      setBotSelectNumber(Number(new BigNumber(val).times(timesNumber).toString()))
    }
  }

  const handleChangeBotValue = (val: any) => {
    if (!val) {
      setTopSelectNumber(0)
      setBotSelectNumber(0)
    } else {
      setBotSelectNumber(val)
      setTopSelectNumber(Number(new BigNumber(val).div(timesNumber).toString()))
    }
  }

  const getStatus = (status: any) => {
    switch (status) {
      case 1:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>交易成功</p>
      case 2:
        return <p style={{ color: 'rgba(255, 0, 11, 1)' }}>交易失敗</p>
      default:
        return <p style={{ color: 'rgba(75, 187, 154, 1)' }}>交易成功</p>
    }
  }
  const getAssetByGPO = async () => {
    const assets: any = await getAssetsByConditions({ symbol: 'GPO' })
    console.log(assets)
    setCurrUseableGpo(assets?.data?.usable)
    return assets
  }
  const getAssetByGPT = async () => {
    const assets: any = await getAssetsByConditions({ symbol: 'GPT' })
    console.log(assets)
    setCurrUseableGpt(assets?.data?.usable)
    return assets
  }
  const getAssetByGPF = async () => {
    const assets: any = await getAssetsByConditions({ symbol: 'GPF' })
    console.log(assets)
    setCurrUseableGpf(assets?.data?.usable)
    return assets
  }
  const getAssetByGPTH = async () => {
    const assets: any = await getAssetsByConditions({ symbol: 'GPTH' })
    console.log(assets)
    setCurrUseableGpth(assets?.data?.usable)
    return assets
  }
  useEffect(() => {
    getAssetByGPO()
    getAssetByGPT()
    getAssetByGPF()
    getAssetByGPTH()
  }, [])

  const getCoin = (symbol: any) => {
    console.log(assets)
    switch (symbol) {
      case 'GPO':
        return {
          value: currUseableGpo,
          icon: Usdt,
        }
      case 'GPT':
        return {
          value: currUseableGpt,
          icon: Cgr,
        }
      case 'GPF':
        return {
          value: currUseableGpf,
          icon: Cgz,
        }
      case 'GPTH':
        return {
          value: currUseableGpth,
          icon: Cgz,
        }
      default:
        return {
          value: currUseableGpo,
          icon: Usdt,
        }
    }
  }
  const handleShowSwap = () => {
    if (userPayPwd === '') {
      setIsShowSetPwd(true)
    } else {
      setIsPwd(true)
    }
  }

  return (
    <LayoutElement>
      <div className="swapWrap">
        <div className="gussItemMenuBox">
          <LeftOutline
            onClick={() => {
              navigate(-1)
            }}
            fill="#fff"
          />
          <p className="recordTopTitle">劃轉</p>
          <div></div>
        </div>
        <div className="swapCard">
          <div className="swapContent">
            <div className="swapContentTop">
              <p>消耗</p>
              <p>資產餘額：{getCoin(currTopSelect).value}</p>
            </div>
            <div className="swapIptTop">
              <div className="swapIptTopItem">
                <Select
                  defaultValue="GPO"
                  onChange={topSelectChange}
                  style={{ width: 120 }}
                  options={[
                    {
                      value: 'GPO',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Usdt} alt="usdt" /> */}
                          <p>初級帳戶</p>
                        </div>
                      ),
                    },
                    {
                      value: 'GPT',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Cgr} alt="usdt" /> */}
                          <p>高級賬戶</p>
                        </div>
                      ),
                    },
                    {
                      value: 'GPF',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Cgz} alt="usdt" /> */}
                          <p>终級賬戶</p>
                        </div>
                      ),
                      disabled: currTopSelect === 'GPF',
                    },
                    {
                      value: 'GPTH',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Cgz} alt="usdt" /> */}
                          <p>方位賬戶</p>
                        </div>
                      ),
                      disabled: currTopSelect === 'GPTH',
                    },
                  ]}
                />
              </div>
              <InputNumber
                type="text"
                onChange={(e) => {
                  handleChangeTopValue(e)
                }}
                className="inputNumber"
                value={topSelectNumber}
              />
            </div>
            <div className="swapConMid">
              <p>獲取</p>
              <img src={SwapImg} alt="SwapImg" />
              <div></div>
            </div>
            <div className="swapIptTop">
              <div className="swapIptTopItem">
                <Select
                  style={{ width: 120 }}
                  value={currBotSelect}
                  onChange={botSelectChange}
                  options={[
                    {
                      value: 'GPO',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Usdt} alt="usdt" /> */}
                          <p>初級帳戶</p>
                        </div>
                      ),
                      disabled: currTopSelect === 'GPO',
                    },
                    {
                      value: 'GPT',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Cgr} alt="usdt" /> */}
                          <p>高級賬戶</p>
                        </div>
                      ),
                      disabled: currTopSelect === 'GPT',
                    },
                    {
                      value: 'GPF',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Cgz} alt="usdt" /> */}
                          <p>终級賬戶</p>
                        </div>
                      ),
                      disabled: currTopSelect === 'GPF',
                    },
                    {
                      value: 'GPTH',
                      label: (
                        <div className="itemLeft">
                          {/* <img src={Cgz} alt="usdt" /> */}
                          <p>方位賬戶</p>
                        </div>
                      ),
                      disabled: currTopSelect === 'GPTH',
                    },
                  ]}
                />
              </div>
              <InputNumber
                type="text"
                onChange={(e) => {
                  handleChangeBotValue(e)
                }}
                className="inputNumber"
                disabled
                value={botSelectNumber}
              />
            </div>
            <div className="swapConBot">
              <div className="priceInfo">
                <p>兌換價格</p>
                <p>
                  1
                  {currTopSelect == 'GPO'
                    ? '初級賬戶'
                    : currTopSelect == 'GPT'
                    ? '中級賬戶'
                    : currTopSelect == 'GPTH'
                    ? '方位游戏'
                    : '終極賬戶'}
                  積分≈
                  {timesNumber}
                  {currBotSelect == 'GPO'
                    ? '初級賬戶'
                    : currTopSelect == 'GPT'
                    ? '中級賬戶'
                    : currTopSelect == 'GPTH'
                    ? '方位游戏'
                    : '終極賬戶'}
                  積分
                </p>
              </div>
              <Button onClick={handleShowSwap} className="sureBtn">
                劃轉
              </Button>
            </div>
          </div>
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
              value={payPwd}
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
              兌換
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
