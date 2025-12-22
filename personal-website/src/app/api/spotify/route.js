import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

// Add your specific playlist IDs here
const FEATURED_PLAYLIST_IDS = [
  '4pQcH9uMjUlZoC72mIpWbm', // U2
  '48CDPzJdzWI5TtmxzqQdNM', // The Rolling Stones
  '7jkFtyLrxt3Gdw45D1kiIF', // The Beatles
  '3BOu0635w3MFWs2RqI2lTL', // Prince
  '7fw1c7c5KbLvq1uS4CL36U', // Bob Dylan
  '0f274MI3YFPxlYTDIFdW6b', // Dire Straits
  '3aLyJuSOhpKyOKNGnLf10V', // Fleetwood Mac
  '5xRG9325CrH6bcyL8d5ukZ', // Journey
  '7DvSp2bXWVgEcLF29Xps9N', // Eagles
  '3v7e4J3tcvrzCe6mJh3cBh', // Elton John


]

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

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

async function getPlaylist(accessToken, playlistId) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    return null
  }
  
  return response.json()
}

export async function GET() {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json({
        error: 'Missing Spotify credentials',
      }, { status: 500 })
    }

    const { access_token } = await getAccessToken()
    
    // Fetch each playlist by ID
    const playlistPromises = FEATURED_PLAYLIST_IDS.map(id => 
      getPlaylist(access_token, id)
    )
    
    const playlists = await Promise.all(playlistPromises)
    
    // Filter out any failed requests
    const validPlaylists = playlists.filter(p => p !== null)
    
    return NextResponse.json({
      playlists: validPlaylists,
      total: validPlaylists.length,
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