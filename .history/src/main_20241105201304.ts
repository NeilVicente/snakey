import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Could not get canvas context");
}

