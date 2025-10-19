import { nanoid } from 'nanoid';

export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
  duration?: string;
  platform: string;
  url: string;
  embedUrl?: string;
  publishedAt?: string;
  viewCount?: number;
  description?: string;
  metadata?: any;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistWithSongs extends Playlist {
  songs: Song[];
}

class LocalStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
    }
  }

  getPlaylists(): Playlist[] {
    return this.getItem('playlists', []);
  }

  createPlaylist(name: string, description?: string): Playlist {
    const playlists = this.getPlaylists();
    const now = new Date().toISOString();
    const playlist: Playlist = {
      id: nanoid(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
    };
    playlists.push(playlist);
    this.setItem('playlists', playlists);
    return playlist;
  }

  updatePlaylist(id: string, data: { name?: string; description?: string }): Playlist | null {
    const playlists = this.getPlaylists();
    const index = playlists.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    playlists[index] = {
      ...playlists[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.setItem('playlists', playlists);
    return playlists[index];
  }

  deletePlaylist(id: string): void {
    const playlists = this.getPlaylists();
    const filtered = playlists.filter(p => p.id !== id);
    this.setItem('playlists', filtered);
    
    localStorage.removeItem(`playlist_songs_${id}`);
  }

  getPlaylistSongs(playlistId: string): Song[] {
    return this.getItem(`playlist_songs_${playlistId}`, []);
  }

  addSongToPlaylist(playlistId: string, song: Song): void {
    const songs = this.getPlaylistSongs(playlistId);
    
    const exists = songs.some(s => s.id === song.id);
    if (exists) return;
    
    songs.push(song);
    this.setItem(`playlist_songs_${playlistId}`, songs);
    
    const playlists = this.getPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    if (index !== -1) {
      playlists[index].updatedAt = new Date().toISOString();
      this.setItem('playlists', playlists);
    }
  }

  removeSongFromPlaylist(playlistId: string, songId: string): void {
    const songs = this.getPlaylistSongs(playlistId);
    const filtered = songs.filter(s => s.id !== songId);
    this.setItem(`playlist_songs_${playlistId}`, filtered);
    
    const playlists = this.getPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    if (index !== -1) {
      playlists[index].updatedAt = new Date().toISOString();
      this.setItem('playlists', playlists);
    }
  }

  getLikedSongs(): Song[] {
    return this.getItem('liked_songs', []);
  }

  likeSong(song: Song): void {
    const liked = this.getLikedSongs();
    const exists = liked.some(s => s.id === song.id);
    if (exists) return;
    
    liked.push(song);
    this.setItem('liked_songs', liked);
  }

  unlikeSong(songId: string): void {
    const liked = this.getLikedSongs();
    const filtered = liked.filter(s => s.id !== songId);
    this.setItem('liked_songs', filtered);
  }

  isSongLiked(songId: string): boolean {
    const liked = this.getLikedSongs();
    return liked.some(s => s.id === songId);
  }

  getSavedSongs(): Song[] {
    return this.getItem('saved_songs', []);
  }

  saveSong(song: Song): void {
    const saved = this.getSavedSongs();
    const exists = saved.some(s => s.id === song.id);
    if (exists) return;
    
    saved.push(song);
    this.setItem('saved_songs', saved);
  }

  unsaveSong(songId: string): void {
    const saved = this.getSavedSongs();
    const filtered = saved.filter(s => s.id !== songId);
    this.setItem('saved_songs', filtered);
  }

  isSongSaved(songId: string): boolean {
    const saved = this.getSavedSongs();
    return saved.some(s => s.id === songId);
  }
}

export const storage = new LocalStorage();
