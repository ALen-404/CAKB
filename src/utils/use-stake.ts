import { message } from 'antd'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { useCallback } from 'react'
import { erc20ABI, useAccount, useBalance, useNetwork } from 'wagmi'
import { fetchFeeData, readContract, waitForTransaction, writeContract } from 'wagmi/actions'

import { getCakbAddress } from '@/contracts/cakb'
import { cakbDappAbi, getCakbDapp } from '@/contracts/cakbDapp'
import { cakeABI, getCakeAddress } from '@/contracts/cake'

export interface UseSpacemeshParams {
  value: string
  setIsPending: (value: boolean) => void
}

export default ({ value, setIsPending }: UseSpacemeshParams) => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const chainId = chain?.id
  const bigNumber = utils.parseEther(value)
  const tokenAddress = getCakeAddress(chain?.id)
  const { refetch } = useBalance({
    address,
    token: tokenAddress,
    watch: true,
  })

  return useCallback(async () => {
    if (!isConnected) {
      return
    }

    let txHash = new Date().toISOString()

    const stakeFnc = async () => {
      if (!chainId || !address) {
        return
      }
      setIsPending(true)

      const { gasPrice } = await fetchFeeData()
      const gasSupportEIP1559 = { gasPrice }

      const allowance = await readContract({
        address: getCakeAddress(chain?.id),
        abi: cakeABI,
        functionName: 'allowance',
        args: [address, getCakbDapp(chain?.id)],
        // @ts-ignore
        overrides: gasSupportEIP1559,
      })

      if (BN.from(allowance.toString()).lt(bigNumber)) {
        const approve = await writeContract({
          address: tokenAddress,
          abi: erc20ABI,
          functionName: 'approve',
          args: [getCakbDapp(chain?.id), bigNumber.toBigInt()],
          // @ts-ignore
          overrides: gasSupportEIP1559,
        })
        await waitForTransaction({
          hash: approve.hash,
          confirmations: 1,
          timeout: 1000 * 60 * 5,
        })
      }
      const allowanceCakb = await readContract({
        address: getCakbAddress(chain?.id),
        abi: cakeABI,
        functionName: 'allowance',
        args: [address, getCakbDapp(chain?.id)],
        // @ts-ignore
        overrides: gasSupportEIP1559,
      })

      if (BN.from(allowanceCakb.toString()).lt(bigNumber)) {
        const approve = await writeContract({
          address: getCakbAddress(chain?.id),
          abi: erc20ABI,
          functionName: 'approve',
          args: [getCakbDapp(chain?.id), bigNumber.toBigInt()],
          // @ts-ignore
          overrides: gasSupportEIP1559,
        })
        await waitForTransaction({
          hash: approve.hash,
          confirmations: 1,
          timeout: 1000 * 60 * 5,
        })
      }

      const tx = await writeContract({
        address: getCakbDapp(chain?.id),
        abi: cakbDappAbi,
        functionName: 'pledge',
        // @ts-ignore
        overrides: gasSupportEIP1559,
        args: [bigNumber.toBigInt()],
      })

      txHash = tx.hash

      await waitForTransaction({
        hash: tx.hash,
        confirmations: 1,
        timeout: 1000 * 60 * 5,
      })

      await refetch()
    }

    async function stakeWithRetries() {
      try {
        await stakeFnc()
        setIsPending(false)
        message.success('success')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        return
      } catch (e: any) {
        setIsPending(false)
        console.log(e)

        message.error('The pledge interval is 5 minutes')
      }
    }

    stakeWithRetries()
  }, [isConnected, chainId, address, setIsPending, chain?.id, bigNumber, refetch, tokenAddress])
}
