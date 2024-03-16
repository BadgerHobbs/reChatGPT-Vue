
<script lang="ts">
import type { PropType } from 'vue'

export default {
    name: "ChatMessageInput",
    props: {
        conversationId: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            required: false,
        },
        modelValue: {
            type: Object as PropType<any>,
            required: false,
            default: null,
        },
        enableSystemMessage: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    emits: ['sendSystemMessage', 'sendUserMessage', 'update:modelValue'],
    methods: {
        /**
         * Update textarea height to fit content.
         * @param target Textarea input.
         */
        autoResize(target: any) {

            target.style.height = 'auto';

            if (this.modelValue) {
                target.style.height = (target.scrollHeight) + 'px';
            }
        },
    },
    watch: {
        /**
         * Resize on modelValue change.
         */
        modelValue: {
            handler() {
                this.autoResize(this.$refs.messageTextArea); 
            },
            flush: "post"
        },

        /**
         * Focus on messageTextArea on conversationId change.
         */
        conversationId() {
            (this.$refs.messageTextArea as any).focus({
                preventScroll: true,
            });
        }
    }
}
</script>

<template>
    <div>
        <div class="TimelineItem">

            <div class="TimelineItem-badge">
                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                    <path
                        d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z">
                    </path>
                </svg>
            </div>

            <div class="TimelineItem-body">
                <textarea ref="messageTextArea" class="form-control width-full color-bg-inset" style="overflow-y: hidden;"
                    placeholder="Enter a response"
                    :value="modelValue"
                    @input="(event) => {
                        $emit('update:modelValue', (event as any).target.value)
                    }"
                    @keydown.enter.exact.prevent="$emit('sendUserMessage', ($event as any).target.valueage)"></textarea>
                <div class="d-flex">
                    <div class="ml-auto">
                        <button v-if="enableSystemMessage" class="mr-2 btn btn-secondary mt-2" type="button"
                            @click="$emit('sendSystemMessage', ($event as any).target.valueage)">
                            Send System Message
                        </button>
                        <button class="btn btn-primary mt-2" type="button"
                            @click="$emit('sendUserMessage', ($event as any).target.valueage)">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>

        </div>


    </div>
</template>
