const express = require("express")
const router = express.Router()
const fs = require("fs").promises
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const DATA_FILE = path.join(__dirname, "..", "data", "songs.json")

// Helper functions
const readSongs = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

const writeSongs = async (songs) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(songs, null, 2))
}

// GET /songs
router.get("/", async (req, res) => {
  try {
    const songs = await readSongs()
    const { page = 1, limit = 10, search = "" } = req.query

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

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedSongs = filteredSongs.slice(startIndex, endIndex)

    res.json({
      songs: paginatedSongs,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(filteredSongs.length / limit),
        totalSongs: filteredSongs.length,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /songs
router.post("/", async (req, res) => {
  try {
    const { title, artist, album, imageUrl } = req.body

    if (!title || !artist || !album) {
      return res.status(400).json({ error: "Title, artist, and album are required" })
    }

    const songs = await readSongs()
    const newSong = {
      id: uuidv4(),
      title,
      artist,
      album,
      imageUrl: imageUrl || `https://via.placeholder.com/200x200/6366f1/ffffff?text=${encodeURIComponent(album)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    songs.push(newSong)
    await writeSongs(songs)

    res.status(201).json(newSong)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT /songs/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, artist, album, imageUrl } = req.body

    if (!title || !artist || !album) {
      return res.status(400).json({ error: "Title, artist, and album are required" })
    }

    const songs = await readSongs()
    const songIndex = songs.findIndex((s) => s.id === req.params.id)

    if (songIndex === -1) {
      return res.status(404).json({ error: "Song not found" })
    }

    songs[songIndex] = {
      ...songs[songIndex],
      title,
      artist,
      album,
      imageUrl: imageUrl || songs[songIndex].imageUrl,
      updatedAt: new Date().toISOString(),
    }

    await writeSongs(songs)
    res.json(songs[songIndex])
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// DELETE /songs/:id
router.delete("/:id", async (req, res) => {
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
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
