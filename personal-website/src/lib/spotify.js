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

  return response.json()
}

export async function getUserPlaylists() {
  const { access_token } = await getAccessToken()

  const response = await fetch(PLAYLISTS_ENDPOINT + '?limit=6', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  return response.json()
}