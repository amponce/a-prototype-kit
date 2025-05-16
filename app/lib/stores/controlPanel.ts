import { atom } from 'nanostores';

// Store for control panel visibility
export const controlPanelOpen = atom<boolean>(false);

// Function to open the control panel
export function openControlPanel() {
  controlPanelOpen.set(true);
}

// Function to close the control panel
export function closeControlPanel() {
  controlPanelOpen.set(false);
}
