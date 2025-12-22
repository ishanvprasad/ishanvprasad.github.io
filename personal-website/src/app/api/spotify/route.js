import { getUserPlaylists } from '@/lib/spotify'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await getUserPlaylists()
    
    return NextResponse.json({
      playlists: response.items,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    )
  }
}

export const revalidate = 3600 // Revalidate every hour