import './style.css';
import { manifestoText } from './manifesto.js';

class TurboEngine {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.wpm = 300;
        this.isPlaying = false;
        this.intervalId = null;

        // DOM Elements
        this.elLeft = document.getElementById('word-left');
        this.elPivot = document.getElementById('word-pivot');
        this.elRight = document.getElementById('word-right');
        this.elWpmInput = document.getElementById('wpm-input');
        this.elProgressBar = document.getElementById('progress-bar');
        this.elProgressText = document.getElementById('progress-text');
        this.elToggleBtn = document.getElementById('btn-toggle');
        this.elTextInput = document.getElementById('text-input');
        this.elVisualizer = document.getElementById('visualizer');
        this.elVisualizerContainer = document.getElementById('visualizer-container');
        this.elDropZone = document.getElementById('drop-zone');
        this.elLeftColumn = document.getElementById('left-column');
        this.elFilePicker = document.getElementById('file-picker');
        this.elWpmScroller = document.getElementById('wpm-scroller');

        this.init();
    }

    init() {
        // UI Controls
        document.getElementById('wpm-up').addEventListener('click', (e) => {
            e.stopPropagation();
            this.changeSpeed(50);
        });
        document.getElementById('wpm-down').addEventListener('click', (e) => {
            e.stopPropagation();
            this.changeSpeed(-50);
        });

        // Mouse Scroll for WPM
        this.elWpmScroller.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -50 : 50;
            this.changeSpeed(delta);
        }, { passive: false });

        // Touch Swipe for WPM
        let touchStartY = 0;
        this.elWpmScroller.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.elWpmScroller.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const currentY = e.touches[0].clientY;
            const diff = touchStartY - currentY;

            // Sensitivity threshold
            if (Math.abs(diff) > 20) {
                const delta = diff > 0 ? 50 : -50;
                this.changeSpeed(delta);
                touchStartY = currentY; // Reset for continuous sliding
            }
        }, { passive: false });

        this.elWpmInput.addEventListener('change', (e) => this.setSpeed(parseInt(e.target.value)));

        this.elToggleBtn.addEventListener('click', () => this.togglePlay());
        document.getElementById('btn-clear').addEventListener('click', () => this.clearAll());
        document.getElementById('btn-load-input').addEventListener('click', () => this.loadFromInput());

        // Playback Buttons
        document.getElementById('btn-reset').addEventListener('click', () => this.jumpToIndex(0));
        document.getElementById('btn-prev').addEventListener('click', () => this.stepWord(-1));
        document.getElementById('btn-next').addEventListener('click', () => this.stepWord(1));

        // Browser File Picker
        document.getElementById('btn-trigger-file').addEventListener('click', () => this.elFilePicker.click());
        this.elFilePicker.addEventListener('change', (e) => {
            if (e.target.files[0]) this.handleFile(e.target.files[0]);
        });

        // File Drag & Drop
        this.elDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elDropZone.classList.add('dragover');
        });
        this.elDropZone.addEventListener('dragleave', () => this.elDropZone.classList.remove('dragover'));
        this.elDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elDropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
                this.handleFile(file);
            } else {
                alert('Invalid file format! Please drop a .txt or .md file only.');
            }
        });

        // Initialize Responsive Visualizer (Height Sync)
        this.initVisualizerSync();

        // Initialize with default state (The Communist Manifesto)
        this.loadText(manifestoText);
    }

    initVisualizerSync() {
        if (this.elLeftColumn && this.elVisualizerContainer) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (window.innerWidth >= 1024) {
                        // Briefly release the height to allow the left column to collapse naturally
                        this.elVisualizerContainer.style.height = '0px';
                        const height = this.elLeftColumn.offsetHeight;
                        this.elVisualizerContainer.style.height = `${height}px`;
                        this.elVisualizerContainer.style.maxHeight = `${height}px`;
                    } else {
                        this.elVisualizerContainer.style.height = 'auto';
                        this.elVisualizerContainer.style.maxHeight = 'none';
                    }
                }
            });
            resizeObserver.observe(this.elLeftColumn);
        }
    }

    handleFile(file) {
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("File is too large! Please keep it under 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            if (text.includes('\0')) {
                alert("Binary content detected. Cannot read.");
                return;
            }
            this.elTextInput.value = text;
            this.loadText(text);
        };
        reader.readAsText(file);
    }

    calculateORP(word) {
        const len = word.length;
        if (len === 1) return 0;
        if (len >= 2 && len <= 5) return 1;
        if (len >= 6 && len <= 9) return 2;
        if (len >= 10 && len <= 13) return 3;
        return 4;
    }

    renderWord(word) {
        if (word === undefined) return;

        const orpIndex = this.calculateORP(word);
        const leftPart = word.substring(0, orpIndex);
        const pivotChar = word.charAt(orpIndex);
        const rightPart = word.substring(orpIndex + 1);

        this.elLeft.textContent = leftPart;
        this.elPivot.textContent = pivotChar;
        this.elRight.textContent = rightPart;

        this.adjustFontSize(word);
        this.updateVisualizerHighlight();
    }

    adjustFontSize(word) {
        const wordDisplay = document.getElementById('word-display');
        if (!wordDisplay) return;

        const isMobile = window.innerWidth < 768;
        const len = word.length;

        // Base font sizes (matching Tailwind's text-6xl and text-8xl)
        // 6xl = 3.75rem, 8xl = 6rem
        const baseSize = isMobile ? 3.75 : 6;

        // Character thresholds before we start shrinking
        const threshold = isMobile ? 8 : 14;

        if (len > threshold) {
            // Calculate a scale factor based on how much the word exceeds the threshold
            // We use a slightly more conservative scaling to ensure it fits
            const scaleFactor = threshold / len;
            const newSize = Math.max(baseSize * scaleFactor, isMobile ? 1.5 : 2.5);
            wordDisplay.style.fontSize = `${newSize}rem`;

            // For super long words, ensure they can wrap as a last resort
            if (len > 20) {
                wordDisplay.classList.remove('whitespace-nowrap');
                wordDisplay.classList.add('break-all');
            } else {
                wordDisplay.classList.add('whitespace-nowrap');
                wordDisplay.classList.remove('break-all');
            }
        } else {
            // Reset to default
            wordDisplay.style.fontSize = '';
            wordDisplay.classList.add('whitespace-nowrap');
            wordDisplay.classList.remove('break-all');
        }
    }

    tick() {
        if (this.currentIndex >= this.words.length - 1) {
            this.stop();
            this.currentIndex = this.words.length - 1; // Cap at end
            this.renderWord(this.words[this.currentIndex]);
            this.updateProgress();
            return;
        }

        this.currentIndex++;
        this.renderWord(this.words[this.currentIndex]);
        this.updateProgress();
    }

    stepWord(delta) {
        if (this.isPlaying) return; // Only manual while paused
        const newIndex = this.currentIndex + delta;
        if (newIndex >= 0 && newIndex < this.words.length) {
            this.currentIndex = newIndex;
            this.renderWord(this.words[this.currentIndex]);
            this.updateProgress();
        }
    }

    start() {
        if (this.words.length === 0) return;

        // Auto-restart if we reached the end
        if (this.currentIndex >= this.words.length - 1) {
            this.currentIndex = 0;
            this.renderWord(this.words[this.currentIndex]);
            this.updateProgress();
        }

        this.isPlaying = true;
        this.elToggleBtn.textContent = "PAUSE";
        this.elToggleBtn.classList.replace('bg-[#fde047]', 'bg-[#fde047]');
        this.elToggleBtn.classList.replace('text-black', 'text-black'); // Red background, Black text

        const intervalMs = 60000 / this.wpm;
        this.intervalId = setInterval(() => this.tick(), intervalMs);
    }

    stop() {
        this.isPlaying = false;
        this.elToggleBtn.textContent = "START";
        this.elToggleBtn.classList.replace('bg-[#fde047]', 'bg-[#fde047]');
        this.elToggleBtn.classList.replace('text-black', 'text-black');
        clearInterval(this.intervalId);
    }

    togglePlay() {
        if (this.isPlaying) this.stop();
        else this.start();
    }

    updateProgress() {
        if (this.words.length === 0) return;
        const percent = Math.min(100, Math.floor(((this.currentIndex + 1) / this.words.length) * 100));
        this.elProgressBar.style.width = `${percent}%`;
        this.elProgressText.textContent = `${percent}%`;

        // Update color based on segments
        if (percent <= 33) {
            this.elProgressBar.style.backgroundColor = '#fde047';
        } else if (percent <= 66) {
            this.elProgressBar.style.backgroundColor = '#fde047';
        } else {
            this.elProgressBar.style.backgroundColor = '#fde047';
        }
    }

    changeSpeed(delta) {
        this.setSpeed(this.wpm + delta);
    }

    setSpeed(speed) {
        this.wpm = Math.max(50, Math.min(900, speed));
        this.elWpmInput.value = this.wpm;

        if (this.isPlaying) {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => this.tick(), 60000 / this.wpm);
        }
    }

    loadText(text) {
        this.words = text.trim().split(/\s+/).filter(w => w.length > 0);
        this.currentIndex = 0;
        this.stop();
        this.prepareVisualizer();
        this.renderWord(this.words[0]);
        this.updateProgress();

        if (this.elTextInput.value === '') this.elTextInput.value = text;
    }

    prepareVisualizer() {
        this.elVisualizer.innerHTML = '';
        this.words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.className = 'word-span';
            span.id = `word-${index}`;
            span.addEventListener('click', () => this.jumpToIndex(index));
            this.elVisualizer.appendChild(span);
        });
        this.elVisualizer.scrollTop = 0;
    }

    updateVisualizerHighlight() {
        const prev = this.elVisualizer.querySelector('.active');
        if (prev) prev.classList.remove('active');

        const current = document.getElementById(`word-${this.currentIndex}`);
        if (current) {
            current.classList.add('active');

            const visRect = this.elVisualizer.getBoundingClientRect();
            const wordOffsetTop = current.offsetTop;
            const wordHeight = current.offsetHeight;
            const visScrollTop = this.elVisualizer.scrollTop;
            const visHeight = visRect.height;

            const relativeTop = wordOffsetTop - visScrollTop;

            // Trigger a centering scroll if the word is past 80% depth or above the viewport
            if (relativeTop > visHeight * 0.8 || relativeTop < 0) {
                const targetScroll = wordOffsetTop - (visHeight / 2) + (wordHeight / 2);
                this.elVisualizer.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        }
    }

    jumpToIndex(index) {
        this.stop();
        this.currentIndex = index;
        this.renderWord(this.words[this.currentIndex]);
        this.updateProgress();
    }

    loadFromInput() {
        const text = this.elTextInput.value;
        if (text) this.loadText(text);
    }

    clearAll() {
        this.stop();
        this.words = [];
        this.currentIndex = 0;
        this.elTextInput.value = '';
        this.elFilePicker.value = '';
        this.elVisualizer.innerHTML = '<p class="text-[#fde047] italic opacity-50">Load some text to see the interactive visualizer...</p>';
        this.elLeft.textContent = 'Ready';
        this.elPivot.textContent = '?';
        this.elRight.textContent = '';
        this.updateProgress();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.turbo = new TurboEngine();
});
