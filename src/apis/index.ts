import { get, post } from '@/utils/request'

export const loginDapp = (loginReq: any) => {
  return post('/user/login', { ...loginReq })
}
export const getBind = (userAddr: string) => {
  return get(`/user/getBind?userAddr=${userAddr}`)
}
export const getAssetsByUser = () => {
  return get(`/assets/getAssetsByUser`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
      'Accept-Language': 'zh',
    },
  })
}

export const loginOut = () => {
  return post(
    `/user/loginOut`,
    {},
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const addPaymentMethod = ({ bankName, collectionAccount, realName, remark, type }: any) => {
  return post(
    `/user/addPaymentMethod`,
    {
      bankName,
      collectionAccount,
      realName,
      remark,
      type,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const mdfPaymentMethod = ({ bankName, collectionAccount, realName, remark, type }: any) => {
  return post(
    `/user/addPaymentMethod`,
    {
      bankName,
      collectionAccount,
      realName,
      remark,
      type,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const pushSell = ({ isMail, pmId, quantity }: any) => {
  return post(
    `/c2c/sell`,
    {
      isMail,
      pmId,
      quantity,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}

export const handleBuy = ({ tid }: any) => {
  return post(
    `/c2c/buy`,
    {
      tid,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const handleUploadPaymentVoucher = ({ tid, urls }: any) => {
  return post(
    `/c2c/uploadPaymentVoucher`,
    {
      tid,
      urls,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}

export const handleSwap = ({ quantity, symbol }: any) => {
  return post(
    `/exchange/transfer`,
    {
      quantity,
      symbol,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
      },
    }
  )
}
export const getTrading = () => {
  return get(`/c2c/getTrading`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
      'Accept-Language': 'zh',
    },
  })
}

export const getTradingByUser = ({ status }: any) => {
  return get(`/c2c/getTradingByUser?status=${status}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
      'Accept-Language': 'zh',
    },
  })
}

export const getSellTradingByUser = ({ status }: any) => {
  return get(`/c2c/getSellTradingByUser?status=${status}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
      'Accept-Language': 'zh',
    },
  })
}

export const getOrderDetailsById = ({ id }: any) => {
  return get(`/c2c/getTradingById?id=${id}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
      'Accept-Language': 'zh',
    },
  })
}
export const cancelSale = ({ id }: any) => {
  return post(
    `/c2c/cancelSale/${id}`,
    { id },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}
export const cancelBuy = ({ id }: any) => {
  return post(
    `/c2c/cancelBuy/${id}`,
    { id },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}
export const explain = ({ explainReason, tid, urls }: any) => {
  return post(
    `/c2c/explain`,
    { explainReason, tid, urls },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const handlePledge = ({ id, quantity }: any) => {
  return post(
    `/pledge/pledge`,
    { id, quantity },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const discharg = ({ id }: any) => {
  return post(
    `/c2c/discharg/${id}`,
    { id },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const getPaymentMethod = () => {
  return get(`/user/getPaymentMethod`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
      'Accept-Language': 'zh',
    },
  })
}

export const getHome = () => {
  return get(`/home/getHome`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getUpsDowns = ({ type }: any) => {
  return get(`/game/getUpsDowns?type=${type}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGame3Props = () => {
  return get(`/game/getGame3Props`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getExchangePrice = ({ fromSymbol, toSymbol }: any) => {
  return get(`/exchange/getExchangePrice?fromSymbol=${fromSymbol}&toSymbol=${toSymbol}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getExchangeRecord = () => {
  return get(`/exchange/getExchange`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getPledge = ({ status }: any) => {
  return get(`/pledge/getPledge?status=${status}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getPledgeSet = () => {
  return get(`/pledge/getPledgeSet`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getFundRecord = ({ symbol }: any) => {
  return get(`/assets/getFundRecord?symbol=${symbol}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getRewardRecord = ({ type }: any) => {
  return get(`/assets/getFundRecord?type=${type}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getExchangeK = ({ fromSymbol, toSymbol }: any) => {
  return get(`/exchange/getExchangeK?fromSymbol=${fromSymbol}&toSymbol=${toSymbol}&time=1440`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getDictyosome = () => {
  return get(`/user/getDictyosome`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getTopUpInfo = () => {
  return get(`/assets/getTopUpInfo`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getWithdrawSx = () => {
  return get(`/assets/getWithdrawSx`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const withdrawAssets = ({ quantity, symbol }: any) => {
  return post(
    `/assets/Withdraw`,
    { symbol, quantity },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const setPassword = ({ newPassword, oldPassword }: any) => {
  return post(
    `/user/setPassword`,
    { newPassword, oldPassword },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}
export const updatePassword = ({ newPassword, oldPassword }: any) => {
  return post(
    `/user/updatePassword`,
    { newPassword, oldPassword },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}
export const setMail = ({ mail }: any) => {
  return post(
    `/user/setMail`,
    { mail },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const takeGame = ({ bet }: any) => {
  return post(
    `/game/takeGame`,
    { bet, gid: 1 },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const takeGame3 = ({ gameId }: any) => {
  return post(
    `/game/takeGame3`,
    {
      bet: 0,
      gid: gameId,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

export const payGame3Fee = ({ payPwd, gameId }: any) => {
  return post(
    `/game/payGame3Fee`,
    {
      pwd: payPwd,
      gid: gameId,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}

//
export const payGame3 = ({ payPwd, gameId }: any) => {
  return post(
    `/game/payGame3`,
    {
      pwd: payPwd,
      gid: gameId,
    },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}
export const getUserInfo = () => {
  return get(`/user/getUserInfo`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}
export const getAssetsByConditions = ({ symbol }: any) => {
  return get(`/assets/getAssetsByConditions?symbol=${symbol}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getC2cNotice = () => {
  return get(`/c2c/getC2cNotice`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGameRecord = (data: any) => {
  return get(`/game/getGameRecord?type=${data.type}&offset=10&page=1`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGameRecordThree = () => {
  return get(`/game/getGameRecordThree?offset=10&page=1&type=1`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGameRecordThreeKJ = ({ id }: any) => {
  return get(`/game/getGameRecordThreeKJ?id=${id}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGameRecordThreeByStatus = (status: any) => {
  return get(`/game/getGameRecordThree?offset=10&page=1&type=1&status=${status}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGameSet = (type: any) => {
  return get(`/game/getGameSet?type=${type}`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const getGameSet3 = () => {
  return get(`/game/getGameSet3`, {
    headers: {
      authorization: localStorage.getItem('authorization'),
    },
  })
}

export const verifyPassword = ({ newPassword, oldPassword }: any) => {
  return post(
    `/user/verifyPassword`,
    { newPassword, oldPassword },
    {
      headers: {
        authorization: localStorage.getItem('authorization'),
        'Accept-Language': 'zh',
      },
    }
  )
}
