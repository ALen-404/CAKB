import { ArrowDownOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, MenuProps, message, Pagination, Table, Upload, UploadFile, UploadProps } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { Popup } from 'antd-mobile'
import { ArrowDownCircleOutline, LeftOutline } from 'antd-mobile-icons'
import BigNumber from 'bignumber.js'
import ReactECharts from 'echarts-for-react'
import { BigNumber as BN, utils } from 'ethers'
import { t } from 'i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAccount, useBalance, useContractRead, useNetwork } from 'wagmi'

import { getOrderDetailsById, handleBuy } from '@/apis'
import { LayoutElement } from '@/components/layout'
import { copyMsg } from '@/utils/formatter'

import Order from '../../assets/image/buy/order.png'
import Recive from '../../assets/image/buy/recive.png'
import Sale from '../../assets/image/buy/sale.png'
import Cgr from '../../assets/image/confirmOrder/cgr.png'
import Copy from '../../assets/image/confirmOrder/copy.png'
import BankCard from '../../assets/image/detailsOrder/bankCard.png'
import LeftArrow from '../../assets/image/swap/leftArrow.png'

import './index.less'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const Home = () => {
  const [isShowPwd, setIsPwd] = useState(false)

  const [uploadClose, setUploadClose] = useState(false)

  const [imageUrl, setImageUrl] = useState<string>()
  const navigate = useNavigate()
  console.log(imageUrl)
  const [orderData, setOrderData] = useState<any>('')

  useEffect(() => {
    const currOrderDate = localStorage.getItem('currOrderDate')
    const initCurrOrderDate = JSON.parse(currOrderDate || '{}')
    getOrderDetailsById({ id: initCurrOrderDate.id }).then((res: any) => {
      setOrderData(res.data)
      const initImg = JSON.parse(res.data.paymentUrls)
      setImageUrl(initImg[0])
    })
  }, [])

  const handlePush = () => {
    localStorage.setItem('isPush', 'true')
    navigate(-1)
  }
  const [loading, setLoading] = useState(false)
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      localStorage.setItem('pushImg', info.file.response.data)

      getBase64(info.file.originFileObj as RcFile, (url: any) => {
        setLoading(false)
        setImageUrl(url)
        setUploadClose(true)
      })
    }
  }

  const uploadButton = (
    <button style={{ border: 0, width: '100%', background: 'none' }} type="button">
      {loading ? (
        <LoadingOutlined
          style={{
            fontSize: '30px',
            color: 'rgb(187, 187, 187)',
          }}
        />
      ) : (
        <PlusOutlined
          style={{
            fontSize: '30px',
            color: 'rgb(187, 187, 187)',
          }}
        />
      )}
      <div style={{ marginTop: 8, color: '#BBBBBB' }}>點擊上傳付款憑證</div>
    </button>
  )

  return (
    <LayoutElement>
      <div className="uploadWarp">
        <div className="uploadWarpTop">
          <LeftOutline
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="uploadWarpTopTitle">上傳憑證</p>
          <div></div>
        </div>
        <div className="uploadWarpCon">
          <Upload
            action="https://api.chatgeometrypro.online/picture/upload"
            listType="picture-card"
            showUploadList={false}
            // onPreview={handlePreview}
            onChange={handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </div>

        <div className="confirmBuy">
          <Button disabled={!uploadClose} onClick={handlePush} className={uploadClose ? 'sureBtn' : 'sureBtn disBtn'}>
            確認
          </Button>
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
