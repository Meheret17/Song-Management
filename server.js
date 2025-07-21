const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs").promises
const { v4: uuidv4 } = require("uuid")

const app = express()
const PORT = process.env.PORT || 5000
const DATA_FILE = path.join(__dirname, "data", "songs.json")

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Ensure data directory exists
const ensureDataDirectory = async () => {
  try {
    await fs.mkdir(path.join(__dirname, "data"), { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Initialize data file with sample songs if it doesn't exist
const initializeData = async () => {
  try {
    await fs.access(DATA_FILE)
  } catch (error) {
    // File doesn't exist, create it with sample data
    const sampleSongs = [
      {
        id: uuidv4(),
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        imageUrl: "https://via.placeholder.com/200x200/4f46e5/ffffff?text=Queen",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Hotel California",
        artist: "Eagles",
        album: "Hotel California",
        imageUrl: "https://via.placeholder.com/200x200/dc2626/ffffff?text=Eagles",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        album: "Led Zeppelin IV",
        imageUrl: "https://via.placeholder.com/200x200/059669/ffffff?text=Led+Zeppelin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        album: "Appetite for Destruction",
        imageUrl: "https://via.placeholder.com/200x200/7c2d12/ffffff?text=GNR",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Imagine",
        artist: "John Lennon",
        album: "Imagine",
        imageUrl: "https://via.placeholder.com/200x200/1e40af/ffffff?text=Lennon",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        imageUrl: "https://via.placeholder.com/200x200/be123c/ffffff?text=MJ",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        album: "Highway 61 Revisited",
        imageUrl: "https://via.placeholder.com/200x200/0891b2/ffffff?text=Dylan",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        album: "Nevermind",
        imageUrl: "https://via.placeholder.com/200x200/374151/ffffff?text=Nirvana",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Purple Haze",
        artist: "Jimi Hendrix",
        album: "Are You Experienced",
        imageUrl: "https://via.placeholder.com/200x200/7c3aed/ffffff?text=Hendrix",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Good Vibrations",
        artist: "The Beach Boys",
        album: "Pet Sounds",
        imageUrl: "https://via.placeholder.com/200x200/ea580c/ffffff?text=Beach+Boys",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "What's Going On",
        artist: "Marvin Gaye",
        album: "What's Going On",
        imageUrl: "https://via.placeholder.com/200x200/16a34a/ffffff?text=Marvin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Respect",
        artist: "Aretha Franklin",
        album: "I Never Loved a Man",
        imageUrl: "https://via.placeholder.com/200x200/db2777/ffffff?text=Aretha",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    await fs.writeFile(DATA_FILE, JSON.stringify(sampleSongs, null, 2))
    console.log("Sample data initialized")
  }
}

// Helper functions
const readSongs = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading songs:", error)
    return []
  }
}

const writeSongs = async (songs) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(songs, null, 2))
  } catch (error) {
    console.error("Error writing songs:", error)
    throw error
  }
}

const validateSong = (song) => {
  const errors = []

  if (!song.title || song.title.trim() === "") {
    errors.push("Title is required")
  }

  if (!song.artist || song.artist.trim() === "") {
    errors.push("Artist is required")
  }

  if (!song.album || song.album.trim() === "") {
    errors.push("Album is required")
  }

  return errors
}

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Song Manager API is running",
    timestamp: new Date().toISOString(),
  })
})

// GET /api/songs - Get all songs with pagination and search
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await readSongs()
    const { page = 1, limit = 10, search = "", sortBy = "title", sortOrder = "asc" } = req.query

    // Filter songs based on search query
    let filteredSongs = songs
    if (search) {
      const searchLower = search.toLowerCase()
      filteredSongs = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchLower) ||
          song.artist.toLowerCase().includes(searchLower) ||
          song.album.toLowerCase().includes(searchLower),
      )
    }

    // Sort songs
    filteredSongs.sort((a, b) => {
      const aValue = a[sortBy]?.toLowerCase() || ""
      const bValue = b[sortBy]?.toLowerCase() || ""

      if (sortOrder === "desc") {
        return bValue.localeCompare(aValue)
      }
      return aValue.localeCompare(bValue)
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedSongs = filteredSongs.slice(startIndex, endIndex)

    res.json({
      songs: paginatedSongs,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(filteredSongs.length / limit),
        totalSongs: filteredSongs.length,
        hasNext: endIndex < filteredSongs.length,
        hasPrev: startIndex > 0,
      },
    })
  } catch (error) {
    console.error("Error fetching songs:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/songs/:id - Get a single song
app.get("/api/songs/:id", async (req, res) => {
  try {
    const songs = await readSongs()
    const song = songs.find((s) => s.id === req.params.id)

    if (!song) {
      return res.status(404).json({ error: "Song not found" })
    }

    res.json(song)
  } catch (error) {
    console.error("Error fetching song:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/songs - Create a new song
app.post("/api/songs", async (req, res) => {
  try {
    const { title, artist, album, imageUrl } = req.body

    // Validate input
    const errors = validateSong({ title, artist, album })
    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation failed", details: errors })
    }

    const songs = await readSongs()

    // Check for duplicate songs
    const duplicate = songs.find(
      (s) => s.title.toLowerCase() === title.toLowerCase() && s.artist.toLowerCase() === artist.toLowerCase(),
    )

    if (duplicate) {
      return res.status(409).json({ error: "Song already exists" })
    }

    const newSong = {
      id: uuidv4(),
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim(),
      imageUrl: imageUrl || `https://via.placeholder.com/200x200/6366f1/ffffff?text=${encodeURIComponent(album)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    songs.push(newSong)
    await writeSongs(songs)

    res.status(201).json(newSong)
  } catch (error) {
    console.error("Error creating song:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT /api/songs/:id - Update a song
app.put("/api/songs/:id", async (req, res) => {
  try {
    const { title, artist, album, imageUrl } = req.body

    // Validate input
    const errors = validateSong({ title, artist, album })
    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation failed", details: errors })
    }

    const songs = await readSongs()
    const songIndex = songs.findIndex((s) => s.id === req.params.id)

    if (songIndex === -1) {
      return res.status(404).json({ error: "Song not found" })
    }

    // Check for duplicate songs (excluding current song)
    const duplicate = songs.find(
      (s) =>
        s.id !== req.params.id &&
        s.title.toLowerCase() === title.toLowerCase() &&
        s.artist.toLowerCase() === artist.toLowerCase(),
    )

    if (duplicate) {
      return res.status(409).json({ error: "Song with this title and artist already exists" })
    }

    const updatedSong = {
      ...songs[songIndex],
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim(),
      imageUrl: imageUrl || songs[songIndex].imageUrl,
      updatedAt: new Date().toISOString(),
    }

    songs[songIndex] = updatedSong
    await writeSongs(songs)

    res.json(updatedSong)
  } catch (error) {
    console.error("Error updating song:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// DELETE /api/songs/:id - Delete a song
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const songs = await readSongs()
    const songIndex = songs.findIndex((s) => s.id === req.params.id)

    if (songIndex === -1) {
      return res.status(404).json({ error: "Song not found" })
    }

    const deletedSong = songs[songIndex]
    songs.splice(songIndex, 1)
    await writeSongs(songs)

    res.json({ message: "Song deleted successfully", song: deletedSong })
  } catch (error) {
    console.error("Error deleting song:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/stats - Get statistics
app.get("/api/stats", async (req, res) => {
  try {
    const songs = await readSongs()

    // Calculate statistics
    const totalSongs = songs.length
    const artists = [...new Set(songs.map((s) => s.artist))]
    const albums = [...new Set(songs.map((s) => s.album))]

    // Most popular artist (artist with most songs)
    const artistCounts = songs.reduce((acc, song) => {
      acc[song.artist] = (acc[song.artist] || 0) + 1
      return acc
    }, {})

    const mostPopularArtist = Object.entries(artistCounts).sort(([, a], [, b]) => b - a)[0]

    res.json({
      totalSongs,
      totalArtists: artists.length,
      totalAlbums: albums.length,
      mostPopularArtist: mostPopularArtist
        ? {
            name: mostPopularArtist[0],
            songCount: mostPopularArtist[1],
          }
        : null,
      recentlyAdded: songs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Initialize and start server
const startServer = async () => {
  try {
    await ensureDataDirectory()
    await initializeData()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`)
      console.log(`🎵 Songs API: http://localhost:${PORT}/api/songs`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
// Export app for testing
module.exports = app;
