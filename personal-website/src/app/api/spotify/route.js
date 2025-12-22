import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists'

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`)
  }
  
  return data
}

async function getUserPlaylists(accessToken) {
  const response = await fetch(PLAYLISTS_ENDPOINT + '?limit=6', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(`Failed to get playlists: ${JSON.stringify(data)}`)
  }
  
  return data
}

export async function GET() {
  try {
    // Check if environment variables are set
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json({
        error: 'Missing Spotify credentials',
        details: {
          hasClientId: !!CLIENT_ID,
          hasClientSecret: !!CLIENT_SECRET,
          hasRefreshToken: !!REFRESH_TOKEN,
        }
      }, { status: 500 })
    }

    const { access_token } = await getAccessToken()
    const playlistsData = await getUserPlaylists(access_token)
    
    return NextResponse.json({
      playlists: playlistsData.items || [],
      total: playlistsData.total,
    })
  } catch (error) {
    console.error('Spotify API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch playlists',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

export const revalidate = 3600