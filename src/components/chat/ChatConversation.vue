
<script lang="ts">
import ChatMessage from './ChatMessage.vue';

export default {
    name: "ChatConversation",
    components: {
        ChatMessage
    },
    props: {
        messages: {
            type: Array<any>,
            required: true,
        },
    }
}
</script>

<template>
    <div>
        <ChatMessage v-for="message in messages" :message="message.content" :type="message.role" />
    </div>
</template>
