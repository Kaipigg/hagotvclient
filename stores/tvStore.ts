import { create } from 'zustand'
import type { TVChannel, HomeSection } from '../types'

interface TVState {
  channels: TVChannel[]
  currentChannel: TVChannel | null
  isPlaying: boolean
  setChannels: (channels: TVChannel[]) => void
  setCurrentChannel: (channel: TVChannel | null) => void
  setIsPlaying: (playing: boolean) => void
}

export const useTVStore = create<TVState>((set) => ({
  channels: [],
  currentChannel: null,
  isPlaying: false,
  setChannels: (channels) => set({ channels }),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}))
