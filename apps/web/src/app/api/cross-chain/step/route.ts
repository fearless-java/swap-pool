import { NextRequest, NextResponse } from 'next/server'

const LIFI_API_URL = 'https://li.quest/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { route } = body

    if (!route) {
      return NextResponse.json({ error: 'Missing route parameter' }, { status: 400 })
    }

    const response = await fetch(`${LIFI_API_URL}/routes/advanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ route }),
    })

    if (!response.ok) {
      throw new Error(`LI.FI API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Cross-chain step error:', error)
    return NextResponse.json(
      { error: 'Failed to get cross-chain step' },
      { status: 500 }
    )
  }
}