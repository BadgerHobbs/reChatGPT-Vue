
<script lang="ts">
import { ref } from "vue";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

import { Message } from "@/models/conversation-manager";

export default {
    name: "ChatMessage",
    props: {
        message: {
            type: Message,
            required: true
        },
    },
    emits: ['click:revertToMessage', 'click:recreateMessage'],
    setup() {
        const chatMessage = ref(null)

        const marked = new Marked(
            markedHighlight({
                highlight(code, lang) {
                    return hljs.highlightAuto(code).value;
                }
            })
        );

        return {
            chatMessage,
            marked,
        }
    },
    computed: {
        /**
         * Parse message content into markdown HTML.
         */
        markdown() {
            return this.marked.parse(`${this.message.content}${this.message.loading? "<span class='animated-pipe'>|</span>" : ""}`);
        }
    },
    /**
     * Scroll to bottom of page when message updated.
     */
    updated() {        
        if (this.autoScroll) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "auto",
            });
        }

        this.insertCopyToClipboard();
    },
    data() {
        return {
            autoScroll: true
        };
    },
    methods: {
        /**
         * Set auto scroll value on scroll depending on if at bottom of page or not.
         */
        onScroll() {
            this.autoScroll = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
        },
        /**
         * Insert copy to clipboard buttons into markdown code blocks.
         */
        insertCopyToClipboard() {
            const codeBlocks = (this.$refs as any).chatMessage.querySelectorAll("pre code");

            for (let codeBlock of codeBlocks) {
                // Create button and append it to code block
                const copyButton = document.createElement('button');
                copyButton.className = 'btn-octicon top-0 right-0 position-absolute m-2 hidden-child d-flex';
                copyButton.type = "button";
                copyButton.innerHTML = `
                    <svg class="octicon octicon-clippy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path 
                            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z">
                        </path>
                    </svg>
                    <svg class="octicon octicon-check color-fg-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                        <path 
                        d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z">
                        </path>
                    </svg>
                `;

                copyButton.addEventListener('click', () => {
                    // Trigger copy to clipboard function
                    this.copyToClipboard(codeBlock);

                    // Add class to change the icon to a check mark
                    copyButton.classList.add('icon-checked');

                    // Set a timeout to remove the class after n seconds (e.g., 3 seconds)
                    setTimeout(() => {
                        copyButton.classList.remove('icon-checked');
                    }, 2500);
                });
                
                // Append button to the block's parent element
                codeBlock.parentElement!.style.position = 'relative';
                codeBlock.parentElement!.prepend(copyButton);
            }

            const preSections = (this.$refs as any).chatMessage.querySelectorAll("pre");

            for (let preSection of preSections) {
                preSection.classList.add("parent")
            }
        },
        /**
         * Copy code block content to clipboard.
         * @param {Element} codeElement - Code block to copy contents of.
         */
        copyToClipboard(codeElement: Element) {
            navigator.clipboard.writeText(codeElement.textContent!)
        }
    },
    mounted() {
        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.insertCopyToClipboard();
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    },
}
</script>

<template>
    <div ref="chatMessage" class="TimelineItem">

        <div v-if="message.role === 'user'" class="TimelineItem-badge">
            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path
                    d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z">
                </path>
            </svg>
        </div>
        <div v-else-if="message.role === 'assistant'"
            class="TimelineItem-badge color-bg-success-emphasis color-fg-on-emphasis">
            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path
                    d="M6.5.75V2h3V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75V5h1.25a.75.75 0 0 1 0 1.5H14v3h1.25a.75.75 0 0 1 0 1.5H14v1.25A1.75 1.75 0 0 1 12.25 14H11v1.25a.75.75 0 0 1-1.5 0V14h-3v1.25a.75.75 0 0 1-1.5 0V14H3.75A1.75 1.75 0 0 1 2 12.25V11H.75a.75.75 0 0 1 0-1.5H2v-3H.75a.75.75 0 0 1 0-1.5H2V3.75C2 2.784 2.784 2 3.75 2H5V.75a.75.75 0 0 1 1.5 0Zm5.75 11.75a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25ZM5.75 5h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5A.75.75 0 0 1 5.75 5Zm.75 4.5h3v-3h-3Z">
                </path>
            </svg>
        </div>
        <div v-else-if="message.role === 'system'" class="TimelineItem-badge color-bg-accent-emphasis color-fg-on-emphasis">
            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path
                    d="M1.75 1h12.5c.966 0 1.75.784 1.75 1.75v4c0 .372-.116.717-.314 1 .198.283.314.628.314 1v4a1.75 1.75 0 0 1-1.75 1.75H1.75A1.75 1.75 0 0 1 0 12.75v-4c0-.358.109-.707.314-1a1.739 1.739 0 0 1-.314-1v-4C0 1.784.784 1 1.75 1ZM1.5 2.75v4c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-4a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Zm.25 5.75a.25.25 0 0 0-.25.25v4c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-4a.25.25 0 0 0-.25-.25ZM7 4.75A.75.75 0 0 1 7.75 4h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7 4.75ZM7.75 10h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM3 4.75A.75.75 0 0 1 3.75 4h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 4.75ZM3.75 10h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z">
                </path>
            </svg>
        </div>
        <div v-else-if="message.role === 'loading'"
            class="TimelineItem-badge color-bg-success-emphasis color-fg-on-emphasis">
            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path
                    d="M6.5.75V2h3V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75V5h1.25a.75.75 0 0 1 0 1.5H14v3h1.25a.75.75 0 0 1 0 1.5H14v1.25A1.75 1.75 0 0 1 12.25 14H11v1.25a.75.75 0 0 1-1.5 0V14h-3v1.25a.75.75 0 0 1-1.5 0V14H3.75A1.75 1.75 0 0 1 2 12.25V11H.75a.75.75 0 0 1 0-1.5H2v-3H.75a.75.75 0 0 1 0-1.5H2V3.75C2 2.784 2.784 2 3.75 2H5V.75a.75.75 0 0 1 1.5 0Zm5.75 11.75a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25ZM5.75 5h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5A.75.75 0 0 1 5.75 5Zm.75 4.5h3v-3h-3Z">
                </path>
            </svg>
        </div>

        <div v-if="message.role === 'user'"
            class="TimelineItem-body Box Box-row--gray color-fg-default d-flex ml-auto parent">
            <div class="m-3 width-full overflow-hidden" style="white-space: pre-wrap;">{{ message.content }}</div>
            <button class="btn-octicon mt-auto ml-auto hidden-child" type="button"
                @click="$emit('click:revertToMessage', message.id)">
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path
                        d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z">
                    </path>
                </svg>
            </button>
        </div>
        <div v-else-if="message.role === 'assistant'" class="TimelineItem-body Box color-fg-default d-flex parent">
            <div class="m-3 markdown-body width-full overflow-hidden" v-html="markdown"></div>
            <button class="btn-octicon mt-auto ml-auto hidden-child" type="button"
                @click="$emit('click:recreateMessage', message.id)">
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path
                        d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z">
                    </path>
                </svg>
            </button>
        </div>
        <div v-else-if="message.role === 'system'"
            class="TimelineItem-body Box Box-row--gray color-fg-default parent d-flex ml-auto">
            <div class="m-3 width-full overflow-hidden" style="white-space: pre-wrap;">{{ message.content }}</div>
            <button class="btn-octicon mt-auto ml-auto hidden-child" type="button"
                @click="$emit('click:revertToMessage', message.id)">
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path
                        d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z">
                    </path>
                </svg>
            </button>
        </div>
        <div v-else-if="message.role === 'loading'" class="TimelineItem-body Box color-fg-default parent d-flex">
            <div class="m-3 overflow-auto width-full">
                <span>Loading</span><span class="AnimatedEllipsis"></span>
            </div>
        </div>
    </div>
</template>

<style>
/* CSS for icons to show only on parent hover */
.parent .hidden-child {
    visibility: hidden;
}

.parent:hover .hidden-child {
    visibility: visible;
}


/* CSS for the default clipboard icon */
.octicon-clippy {
  display: inline !important;
}

/* CSS for the check mark icon. Hidden at first */
.octicon-check {
  display: none !important;
}

/* CSS for showing the check mark */
.icon-checked .octicon-clippy {
  display: none !important;
}

.icon-checked .octicon-check {
  display: inline !important;
}

/* CSS for animating pipe (typing indictor) */
.animated-pipe {
  animation: flash 1s steps(1) infinite;
}

@keyframes flash {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}
</style>