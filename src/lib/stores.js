import { writable } from 'svelte/store';

export const username = writable(localStorage?.getItem('username'));

username.subscribe(value => localStorage?.setItem('username', value))