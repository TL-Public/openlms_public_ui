import { writable } from 'svelte/store';

export const user = writable(null); // Initialize with null or user data
export const showLoginModal = writable(false);
