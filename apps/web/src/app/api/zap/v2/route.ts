import { NextRequest, NextResponse } from 'next/server'

const ENSO_API_URL = 'https://api.enso.finance/api/zap/v2'

interface EnsoZapParams {
  chainId: number
  tokenIn: string
  tokenOut: string
  amountIn: string
  slippage: number
  fromAddress: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const params: EnsoZapParams = {
    chainId: Number(searchParams.get('chainId')),
    tokenIn: searchParams.get('tokenIn') || '',
    tokenOut: searchParams.get('tokenOut') || '',
    amountIn: searchParams.get('amountIn') || '',
    slippage: Number(searchParams.get('slippage') || '0.5'),
    fromAddress: searchParams.get('fromAddress') || '',
  }

  if (!params.chainId || !params.tokenIn || !params.tokenOut || !params.amountIn) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    const queryParams = new URLSearchParams({
      chainId: params.chainId.toString(),
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amountIn: params.amountIn,
      slippage: params.slippage.toString(),
      fromAddress: params.fromAddress,
    })

    const url = `${ENSO_API_URL}?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.ENSO_API_KEY || ''}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Enso API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch zap quote' },
      { status: 500 }
    )
  }
}