const Addon = require('stremio-addon-sdk')

const EST_M3U8 = 'https://raw.githubusercontent.com/syphant/stremio-toonamiaftermath/refs/heads/main/stream/est.m3u8'
const PST_M3U8 = 'https://raw.githubusercontent.com/syphant/stremio-toonamiaftermath/refs/heads/main/stream/pst.m3u8'
const BACKGROUND = 'https://raw.githubusercontent.com/syphant/stremio-toonamiaftermath/refs/heads/main/png/background.png'
const POSTER = 'https://raw.githubusercontent.com/syphant/stremio-toonamiaftermath/refs/heads/main/png/poster.png'

const manifest = {
  id: 'org.syphant.toonami-aftermath',
  version: '1.0.0',
  name: 'Toonami Aftermath',
  description: 'Live Toonami Aftermath streams (EST and PST)',
  resources: ["catalog", "meta", "stream"],
  types: ["tv"],
  catalogs: [{ type: 'tv', id: 'toonami-aftermath' }],
  idPrefixes: ["toonami-aftermath"],
  icon: POSTER,
  background: BACKGROUND,
}

const addon = Addon(manifest)

addon.defineCatalogHandler((args, cb) => {
  console.log('[catalog] request args:', JSON.stringify(args))
  const metas = [
    {
      id: 'toonami-aftermath-est',
      type: 'tv',
      name: 'Toonami Aftermath (EST)',
      poster: POSTER,
      background: BACKGROUND,
      genres: ['Live'],
      releaseInfo: 'Live',
      posterShape: 'landscape'
    },
    {
      id: 'toonami-aftermath-pst',
      type: 'tv',
      name: 'Toonami Aftermath (PST)',
      poster: POSTER,
      background: BACKGROUND,
      genres: ['Live'],
      releaseInfo: 'Live',
      posterShape: 'landscape'
    }
  ]

  cb(null, { metas })
})

addon.defineMetaHandler((args, cb) => {
  console.log('[meta] request args:', JSON.stringify(args))
  let id = args.id
  if (typeof id === 'string' && id.indexOf(':') !== -1) id = id.split(':')[0]
  if (id === 'toonami-aftermath-est') {
    cb(null, {
      meta: {
        id,
        type: 'tv',
        name: 'Toonami Aftermath (EST)',
        poster: POSTER,
        background: BACKGROUND,
        description: 'Live Toonami Aftermath (EST) stream.'
      }
    })
    return
  }
  if (id === 'toonami-aftermath-pst') {
    cb(null, {
      meta: {
        id,
        type: 'tv',
        name: 'Toonami Aftermath (PST)',
        poster: POSTER,
        background: BACKGROUND,
        description: 'Live Toonami Aftermath (PST) stream.'
      }
    })
    return
  }
  cb(null, { meta: null })
})

addon.defineStreamHandler((args, cb) => {
  console.log('[stream] request args:', JSON.stringify(args))
  let id = args.id
  if (typeof id === 'string' && id.indexOf(':') !== -1) id = id.split(':')[0]
  if (id === 'toonami-aftermath-est') {
    cb(null, {
      streams: [
        {
          title: 'Toonami Aftermath (EST)',
          url: EST_M3U8,
          info: { isLive: true }
        }
      ]
    })
    return
  }
  if (id === 'toonami-aftermath-pst') {
    cb(null, {
      streams: [
        {
          title: 'Toonami Aftermath (PST)',
          url: PST_M3U8,
          info: { isLive: true }
        }
      ]
    })
    return
  }
  cb(null, { streams: [] })
})

const http = require('http')
const express = require('express')

const PORT = parseInt(process.env.PORT, 10) || 7000
const host = process.env.HOST || '0.0.0.0'

const router = addon.getRouter()
const app = express()
app.use('/', router)

const server = http.createServer(app)
server.listen(PORT, host, () => {
  const url = `http://${host}:${PORT}/manifest.json`
  console.log('Toonami Aftermath addon listening at', url)
})
