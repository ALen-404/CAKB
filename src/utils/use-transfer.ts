import { message } from 'antd'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, utils } from 'ethers'
import { useCallback } from 'react'
import { erc20ABI, useAccount, useBalance, useNetwork } from 'wagmi'
import { fetchFeeData, readContract, waitForTransaction, writeContract } from 'wagmi/actions'

import { erc20TokenABI } from '@/apis/erc20TokenABI'
import { getCakbAddress } from '@/contracts/cakb'
import { cakbDappAbi, getCakbDapp } from '@/contracts/cakbDapp'

export interface UseSpacemeshParams {
  value: string
  tokenAddress: `0x${string}`
  sendAddress: `0x${string}`
  // setIsPending: (value: boolean) => void
}

export default ({ value, tokenAddress, sendAddress }: UseSpacemeshParams) => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const chainId = chain?.id
  const bigNumber = utils.parseEther(value)
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

      const { gasPrice } = await fetchFeeData()
      const gasSupportEIP1559 = { gasPrice }

      const allowance: any = await readContract({
        address: tokenAddress,
        abi: erc20TokenABI,
        functionName: 'allowance',
        args: [address, tokenAddress],
        // @ts-ignore
        overrides: gasSupportEIP1559,
      })

      if (BN.from(allowance.toString()).lt(bigNumber)) {
        const approve = await writeContract({
          address: tokenAddress,
          abi: erc20TokenABI,
          functionName: 'approve',
          args: [tokenAddress, bigNumber.toBigInt()],
          // @ts-ignore
          overrides: gasSupportEIP1559,
        })
        await waitForTransaction({
          hash: approve.hash,
          confirmations: 1,
          timeout: 1000 * 60 * 5,
        })
      }
      const allowanceCakb: any = await readContract({
        address: tokenAddress,
        abi: erc20TokenABI,
        functionName: 'allowance',
        args: [address, address],
        // @ts-ignore
        overrides: gasSupportEIP1559,
      })

      if (BN.from(allowanceCakb.toString() as any).lt(bigNumber)) {
        const approve = await writeContract({
          address: tokenAddress,
          abi: erc20TokenABI,
          functionName: 'approve',
          args: [address, bigNumber.toBigInt()],
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
        address: tokenAddress,
        abi: erc20TokenABI,
        functionName: 'transferFrom',
        // @ts-ignore
        overrides: gasSupportEIP1559,
        args: [address, sendAddress, bigNumber.toBigInt()],
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
        message.success('success')

        return
      } catch (e: any) {
        console.log(e)

        message.error('The pledge interval is 5 minutes')
      }
    }

    stakeWithRetries()
  }, [isConnected, chainId, address, tokenAddress, bigNumber, sendAddress, refetch])
}
