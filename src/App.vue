
<script lang="ts">
import TheHeader from "./components/TheHeader.vue";
import ChatConversationsDropdown from "./components/chat/ChatConversationsDropdown.vue";
import ChatConversation from "./components/chat/ChatConversation.vue";
import ChatMessageInput from "./components/chat/ChatMessageInput.vue";

import OpenAI from "openai";
import Settings from "@/models/settings";
import { Conversations, Message } from "./models/conversation-manager";

export default {
  name: "App",
  components: {
    TheHeader,
    ChatConversationsDropdown,
    ChatConversation,
    ChatMessageInput,
  },
  data() {
    // Load Settings and Conversations from storage
    const settings = Settings.loadFromLocalStorage();
    const conversations = Conversations.loadFromLocalStorage();

    // Load conversation from URL ID param
    const urlParams = new URLSearchParams(window.location.search);
    let conversation = conversations.loadConversation(urlParams.get("id"));

    let messageInput = "";

    return {
      settings,
      conversations,
      conversation,
      messageInput,
    }
  },
  beforeMount() {
    if (!this.conversation) {
      this.createConversation();
    }
  },
  methods: {
    /**
     * Create OpenAI connection object.
     * @returns {OpenAI} OpenAI connection object.
     */
    getOpenAI(): OpenAI {
      return new OpenAI({
        apiKey: this.settings.apiKey!,
        dangerouslyAllowBrowser: true,
      })
    },

    /**
     * Send system message.
     * @param {string} content Message content.
     */
    sendSystemMessage(content: string) {
      const message = new Message(
        null,
        "system",
        content,
        null,
      );
      this.conversation!.messages.push(message);

      // Clear message input
      this.messageInput = "";
    },

    /**
     * Send user message.
     * @param {string} content Message content.
     */
    async sendUserMessage(content: string) {
      const message = new Message(
        null,
        "user",
        content,
        null,
      );
      this.conversation!.messages.push(message);

      // Add to conversations if not already added
      if (!this.conversations.conversations.some((conv) => conv.id === this.conversation!.id)) {
        this.conversations.conversations.push(this.conversation!);
      }

      // Clear message input
      this.messageInput = "";

      await this.conversation!.send(this.getOpenAI(), this.settings);

      // Save conversations
      this.conversations.saveToLocalStorage();
    },

    /**
     * Revert to message with ID
     * @param {string} messageId ID of message to revert to.
     */
    revertToMessage(messageId: string) {
      // Revert message and set message input to content
      const content = this.conversation!.revertToMessage(messageId);
      this.messageInput = content;
    },

    /**
     * Recreate message with ID.
     * @param messageId ID of message to recreate.
     */
    recreateMessage(messageId: string) {
      // Revert to message and send conversation again
      this.conversation!.revertToMessage(messageId);
      this.conversation!.send(this.getOpenAI(), this.settings);

      // Save conversations
      this.conversations.saveToLocalStorage();
    },

    /**
     * Create new conversation.
     */
    createConversation() {
      const conversation = this.conversations.createConversation();
      this.conversation = conversation;

      // Add system message if configured
      if (this.settings.systemMessage) {
        const message = new Message(
          null,
          "system",
          this.settings.systemMessage,
          null,
        );
        this.conversation.messages.push(message);
      }

      // Update URL prarameter
      this.updateUrlParam(this.conversation!.id);
    },

    /**
     * Delete conversation with ID.
     * @param {string} conversationId ID of conversation to delete.
     */
    deleteConversation(conversationId: string) {
      this.conversations.deleteConversation(conversationId);

      // Create new conversation if was current conversation
      if (conversationId === this.conversation!.id) {
        this.createConversation();
      }

      // Save conversations
      this.conversations.saveToLocalStorage();
    },

    /**
     * Load conversation with ID or create new one if not exist.
     * @param {string} conversationId ID of conversation to load.
     */
    loadConversation(conversationId: string) {
      this.conversation = this.conversations.loadConversation(conversationId) ?? this.conversations.createConversation();

      // Update URL prarameter
      this.updateUrlParam(this.conversation!.id);
    },

    /**
     * Update URL conversation ID parameter.
     * @param {string} conversationId ID of conversation.
     */
    updateUrlParam(conversationId: string) {
      const url = new URL(window.location.href);
      url.searchParams.set("id", conversationId);

      // To replace the current URL in the history
      window.history.replaceState({}, "", url.toString());
    }
  }
}
</script>

<template>
  <main style="min-height: 100vh;"
    :data-color-mode="(settings.theme === 'dark' || settings.theme === 'dark-dimmed' || settings.theme === 'dark-high-contrast') ? 'dark' : (settings.theme === 'light' ? 'light' : 'auto')"
    :data-light-theme="(settings.theme === 'dark' || settings.theme === 'dark-dimmed' || settings.theme === 'dark-high-contrast') ? 'null' : (settings.theme === 'light' || settings.theme === 'system' ? 'light' : 'null')"
    :data-dark-theme="(settings.theme === 'dark' || settings.theme === 'system') ? 'dark' : (settings.theme === 'dark-dimmed' ? 'dark_dimmed' : (settings.theme === 'dark-high-contrast' ? 'dark_high_contrast' : 'null'))">
    <TheHeader :settings="settings" />

    <div class="container-md mx-auto pb-6">

      <div class="m-3 d-flex flex-wrap">

        <ChatConversationsDropdown :conversations="conversations" :initial-value="conversation!"
          @click:load-conversation="loadConversation" @click:delete-conversation="deleteConversation" />

        <button class="btn btn-primary my-1" type="button" @click="createConversation">Create</button>

        <button class="btn btn-danger my-1 ml-auto" type="button"
          @click="deleteConversation(conversation!.id)">Delete</button>

      </div>

      <ChatConversation class="mx-3" :conversation="conversation!" @click:revert-to-message="revertToMessage"
        @click:recreate-message="recreateMessage" />

      <ChatMessageInput placeholder="Enter a message" class="mx-3" @send-user-message="sendUserMessage(messageInput)"
        @send-system-message="sendSystemMessage(messageInput)" v-model="messageInput"
        :enable-system-message="conversation!.messages.length === 0" />

    </div>
  </main>
</template>

<style scoped>
.page {
  height: 100vh;
  width: 100%;
}
</style>
