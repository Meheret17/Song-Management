import { useState, useEffect } from "react";
import song1 from "./assets/Yasteseryal.jpg";


const API_BASE_URL = 'http://localhost:5000/api'
const mockApi = {
    async getSongs() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [
            {
                id: 1,
                title: "yasteseryal",
                artist: "Abdu Kiyar",
                album: "Yasteseryal",
                year: 2023,
                imageUrl: { song1 },
            },
            {
                 id: 2,
                title: "Hotel California",
                artist: "Eagles",
                album: "Hotel California",
                imageUrl: "https://via.placeholder.com/200x200/dc2626/ffffff?text=Eagles",
            },
            {
                id: 3,
                title: "Stairway to Heaven",
                artist: "Led Zeppelin",
                album: "Led Zeppelin IV",
                imageUrl: "https://via.placeholder.com/200x200/059669/ffffff?text=Led+Zeppelin",
            },
            {
                id: 4,
                title: "Sweet Child O' Mine",
                artist: "Guns N' Roses",
                album: "Appetite for Destruction",
                imageUrl: "https://via.placeholder.com/200x200/7c2d12/ffffff?text=GNR",
            },
            {
                id: 5,
                title: "Imagine",
                artist: "John Lennon",
                album: "Imagine",
                imageUrl: "https://via.placeholder.com/200x200/1e40af/ffffff?text=Lennon",
            },
            {
                id: 6,
                title: "Billie Jean",
                artist: "Michael Jackson",
                album: "Thriller",
                imageUrl: "https://via.placeholder.com/200x200/be123c/ffffff?text=MJ",
            },
            {
                id: 7,
                title: "Like a Rolling Stone",
                artist: "Bob Dylan",
                album: "Highway 61 Revisited",
                imageUrl: "https://via.placeholder.com/200x200/0891b2/ffffff?text=Dylan",
            },
            {
                id: 8,
                title: "Smells Like Teen Spirit",
                artist: "Nirvana",
                album: "Nevermind",
                imageUrl: "https://via.placeholder.com/200x200/374151/ffffff?text=Nirvana",
            },
            {
                id: 9,
                title: "Purple Haze",
                artist: "Jimi Hendrix",
                album: "Are You Experienced",
                imageUrl: "https://via.placeholder.com/200x200/7c3aed/ffffff?text=Hendrix",
            },
        ]
    },
    async CreateSong(song) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
            ...song,
            id: Date.now()
        };
    },
    async UpdateSong(id, song) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { ...song, id}
    },
    async deleteSong(id) {
        await new Promise((resolve) => setTimeout(resolve, 300))
    },
}
const api = {
  async getSongs(page = 1, limit = 8) {
    const response = await fetch(`${API_BASE_URL}/songs?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch songs')
    return response.json()
  },
  
  async createSong(song) {
    const response = await fetch(`${API_BASE_URL}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song)
    })
    if (!response.ok) throw new Error('Failed to create song')
    return response.json()
  },
  
  async updateSong(id, song) {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song)
    })
    if (!response.ok) throw new Error('Failed to update song')
    return response.json()
  },
  
  async deleteSong(id) {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete song')
    return response.json()
  }
}

const SONGS_PER_PAGE = 6;

//song card component
const SongCard = ({ song, onEdit, onDelete }) => {
    return (
        <div className="song-card">
            <div className="song-image">
                <img src={song.imageUrl} alt={song.title} />
            </div>
            <div className="song-details">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
                <p>{song.album}</p>
                <p>{song.year}</p>
            </div>
            <div className="song-actions">
                <button className="edit-button" onClick={() => onEdit(song)}>
                    Edit <span className="icon">✏️</span>
                </button>
                <button className="delete-button" onClick={() => onDelete(song.id)}>
                    Delete <span className="icon">🗑️</span>
                </button>
            </div>
        </div>
    )
}

//Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
    if(!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>✖️</button>
            </div>
            <div className="modal-body">
                {children}
            </div>
            </div>
        </div>
    )
}

//Form component
const SongForm = ({ song, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: song?.title || "",
        artist: song?.artist || "",
        album: song?.album || "",
        year: song?.year || "",
        imageUrl: song?.imageUrl || "",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!formData.title || !formData.artist || !formData.album){
            alert("Please fill all fields")
            return;
        }
        const finalData = {
            ...formData,
            imageUrl: formData.imageUrl || "https://via.placeholder.com/200x200/000000/ffffff?text=${encodeURIComponent(formData.title)}",
        }
        onSubmit(finalData)
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <form onSubmit={handleSubmit} className="song-form">
            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter song title"
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="artist">Artist *</label>
                <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                placeholder="Enter artist name"
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="album">Album *</label>
                <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                placeholder="Enter album name"
                required
                />
            </div>
            <div className="form-group">
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL or leave blank for auto-generated"
                />
            </div>
            <div className="form-actions">
                <button type="button" className="btn" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-primary">
                    {song ? "Update" : "Create"}
                </button>
            </div>
        </form>
    )
}

//Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({length: totalPages}, (_, i) => i+1)
    return(
        <div className="pagination">
            <button className="btn-pagination">onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 }
                ← Previous
            </button>
            <div className="page-numbers">
                {pages.map((page)=> (
                    <button 
                        key={page} 
                        className={`btn-page $
                    {currentPage === page ? "active" : ""}`}
                    onClick={() => onPageChange(page)}>
                        {page}
                    </button>
                ))}
            </div>
            <button 
                className="btn-pagination"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next →
            </button>    
        </div>
    )
}

//Main App component
const App = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSong, setEditingSong] = useState(null)
    useEffect(() => {
        loadSongs();
    }, [])

    const loadSongs = async () => {
        setLoading(true)
        try {
            const data = await mockApi.getSongs()
            setSongs(data)
        } catch(error){
            console.error("failed to load songs", error)
            alert("failed to load songs. please try again")
        } finally{
            setLoading(false)
        }
    }

    const handleCreateSong = async (formData) => {
        try{
            const newSong = await mockApi.CreateSong(formData)
            setSongs((prev) => [...prev, newSong])
            setIsModalOpen(false)
            setEditingSong(null)
        } catch(error){
            console.error("failed to create song", error)
            alert("failed to create song")
        }
    }

    const handleUpdateSong = async (formData) => {
        if (!editingSong) return

        try {
        const updatedSong = await mockApi.updateSong(editingSong.id, formData)
        setSongs((prev) => prev.map((song) => (song.id === editingSong.id ? updatedSong : song)))
        setIsModalOpen(false)
        setEditingSong(null)
        } catch (error) {
        console.error("Failed to update song:", error)
        alert("Failed to update song. Please try again.")
        }
    }
    
    const handleDeleteSong = async (id) => {
        if (!confirm("Are you sure you want to delete this song?")) return

        try {
            await mockApi.deleteSong(id)
            setSongs((prev) => prev.filter((song) => song.id !== id))
            } catch (error) {
                console.error("Failed to delete song:", error)
                alert("Failed to delete song. Please try again.")
        }
    }

    const openCreateModal = () => {
        setEditingSong(null)
        setIsModalOpen(true)
    }
    const openEditModal = (song) => {
        setEditingSong(song)
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
        setEditingSong(null)
    }

    const handleFormSubmit = (formData) => {
        if (editingSong) {
            handleUpdateSong(formData)
        } else {
            handleCreateSong(formData)
        }
    }      
}

//pagination logic
const totalPages = Math.ceil(songs.length / SONGS_PER_PAGE)
const startIndex = (currentPage - 1) * SONGS_PER_PAGE
const endIndex = startIndex + SONGS_PER_PAGE
const currentSongs = songs.slice(startIndex, endIndex)

const handlePageChange = (page) => {
    setCurrentSong(Math.max(1, Math.min(page, totalPages)))
}

if(loading){
    return(
        <div className="app">
            <div className="loading">
                <div className="loading-spinner">                   
                </div>
                <p>Loading songs</p>
            </div>
        </div>
    )
}
return(
    <div className="app">
        <header className="app-header">
            <h1>Song Library</h1>
            <button className="btn-primary" onClick={openCreateModal}>
                <span className="icon">➕</span>
                Add Song
            </button>
        </header>
        <main className="app-main">
            {songs.length === 0 ? (
                <div className="empty-state">
                    <p>No songs found</p>
                    <button className="btn-primary" onClick={openCreateModal}>
                        Add your first song
                    </button>
                </div>
            ) : (
                <>
                    <div className="songs-grid">
                        {currentSongs.map((song) => (
                            <SongCard key={song.id} 
                            song={song} onEdit={openEditModal}
                            onDelete={handleDeleteSong}/>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}/>
                    )}
                </>
            )}
        </main>

        <Modal isOpen={isModalOpen} 
                onClose={closeModal}
                title={editingSong ? "edit song" : "add new song"}>
                    <SongForm song={editingSong} 
                              onSubmit={handleFormSubmit}
                              onCancel={closeModal}/>
        </Modal>
    </div>
)

export default App