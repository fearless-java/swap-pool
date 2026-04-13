import { NextRequest, NextResponse } from 'next/server'

const LIFI_API_URL = 'https://li.quest/v1'
const LIFI_API_KEY = process.env.LIFI_API_KEY

interface CrossChainRouteParams {
  fromChain: number
  toChain: number
  fromToken: string
  toToken: string
  amount: string
  fromAddress: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const params: CrossChainRouteParams = {
    fromChain: Number(searchParams.get('fromChain')),
    toChain: Number(searchParams.get('toChain')),
    fromToken: searchParams.get('fromToken') || '',
    toToken: searchParams.get('toToken') || '',
    amount: searchParams.get('amount') || '',
    fromAddress: searchParams.get('fromAddress') || '',
  }

  if (!params.fromChain || !params.toChain || !params.fromToken || !params.toToken || !params.amount) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    const queryParams = new URLSearchParams({
      fromChain: params.fromChain.toString(),
      toChain: params.toChain.toString(),
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.amount,
      fromAddress: params.fromAddress,
    })

    const url = `${LIFI_API_URL}/routes?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        ...(LIFI_API_KEY && { 'Authorization': `Bearer ${LIFI_API_KEY}` }),
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`LI.FI API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cross-chain routes' },
      { status: 500 }
    )
  }
}