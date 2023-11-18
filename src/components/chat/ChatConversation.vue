
<script lang="ts">
import ChatMessage from './ChatMessage.vue';

import { Conversation } from '@/models/conversation-manager';

export default {
    name: "ChatConversation",
    components: {
        ChatMessage
    },
    props: {
        conversation: {
            type: Conversation,
            required: true,
        },
    },
    emits: ['click:revertToMessage', 'click:recreateMessage'],
}
</script>

<template>
    <div>
        <ChatMessage v-for="message in conversation.messages" :key="message.id" :message="message"
            @click:revert-to-message="$emit('click:revertToMessage', message.id)"
            @click:recreate-message="$emit('click:recreateMessage', message.id)" />
    </div>
</template>
