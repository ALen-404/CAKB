import { ArrowDownOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Input, MenuProps, message, Pagination, Radio, RadioChangeEvent, Table } from 'antd'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { addPaymentMethod } from '@/apis'
import { LayoutElement } from '@/components/layout'

import Tips from '../../assets/image/addBank/tips.png'
import BankCard from '../../assets/image/detailsOrder/bankCard.png'
import LeftArrow from '../../assets/image/swap/leftArrow.png'

import './index.less'

const Home = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [isShowPwd, setIsPwd] = useState(false)
  const [names, setNames] = useState('')
  const [cardId, setCardId] = useState('')
  const [cardName, setCardName] = useState('')

  const handleNamesChange = (e: any) => {
    setNames(e.target.value)
  }
  const handleCardIdChange = (e: any) => {
    setCardId(e.target.value)
  }
  const handleCardNameChange = (e: any) => {
    setCardName(e.target.value)
  }
  let navigate = useNavigate()

  const handleAddPaymentMethod = () => {
    addPaymentMethod({
      bankName: cardName,
      collectionAccount: cardId,
      realName: names,
      remark: '',
      type: 1,
    }).then((res: any) => {
      if (res.code === 200) {
        message.success('添加成功')
        setTimeout(() => {
          navigate(-1)
        }, 3000)
      } else {
        message.success('添加失敗')
      }
    })
  }

  return (
    <LayoutElement>
      <div className="addBankCard">
        <div className="addBankCardTop">
          <Link to={'/paymentMethod'}>
            <LeftOutline />
          </Link>
          <p className="addBankCardTopTitle">添加銀行卡</p>
          <div></div>
        </div>
        <div className="addBankCardCon">
          <p className="addBankTitle">姓名</p>
          <Input onChange={handleNamesChange} value={names} className="addBankPriceIpt" placeholder="請輸入姓名" />
          <div className="addBankNum">
            <p className="addBankNumTitle">銀行賬號/卡號</p>
          </div>
          <Input
            onChange={handleCardIdChange}
            value={cardId}
            className="addBankPriceIpt"
            placeholder="請輸入銀行賬號/卡號"
          />
          <p className="addBankPaymentMethod">銀行名稱</p>
          <Input
            onChange={handleCardNameChange}
            value={cardName}
            className="addBankPriceIpt"
            placeholder="請輸入銀行名稱"
          />
          <div className="addBankTips">
            <div className="addBankTipsTop">
              <img src={Tips} alt="Tips" />
              <p>溫馨提示</p>
            </div>
            <div className="addBankTipsBot">
              請確保添加您的銀行卡號以進行即時付款，請勿包含銀行或付款方式的詳細信息。您必須添加所選銀行的付款/收款信息。
            </div>
          </div>
        </div>

        <div className="confirmBuy">
          <Button
            disabled={!(names && cardId && cardName)}
            className={names && cardId && cardName ? 'sureBtn' : 'sureBtn disBtn'}
            onClick={handleAddPaymentMethod}
          >
            確認
          </Button>
        </div>
      </div>
    </LayoutElement>
  )
}

export default Home
