import { NextRequest, NextResponse } from 'next/server'

const ENSO_API_URL = 'https://api.enso.finance/api/zap/v3'

export async function GET(request: NextRequest) {
  // Similar to V2 but for V3 pools
  const { searchParams } = new URL(request.url)

  const chainId = Number(searchParams.get('chainId'))
  const tokenIn = searchParams.get('tokenIn') || ''
  const tokenOut = searchParams.get('tokenOut') || ''
  const amountIn = searchParams.get('amountIn') || ''
  const slippage = Number(searchParams.get('slippage') || '0.5')

  if (!chainId || !tokenIn || !tokenOut || !amountIn) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    const queryParams = new URLSearchParams({
      chainId: chainId.toString(),
      tokenIn,
      tokenOut,
      amountIn,
      slippage: slippage.toString(),
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
      { error: 'Failed to fetch zap v3 quote' },
      { status: 500 }
    )
  }
}