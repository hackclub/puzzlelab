import { writable, derived } from 'svelte/store';

export const apiData = writable([]);

export const imgData = writable([]);

export const Data = derived(apiData, ($apiData) => {
    return $apiData.map(hey => hey);
});