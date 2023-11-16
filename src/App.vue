
<script lang="ts">
import OpenAI from "openai";

import TheHeader from "./components/TheHeader.vue";
import ChatConversationsDropdown from "./components/chat/ChatConversationsDropdown.vue";
import ChatConversation from "./components/chat/ChatConversation.vue";
import ChatMessageInput from "./components/chat/ChatMessageInput.vue";

import Settings from "@/models/settings";

export default {
  name: "App",
  components: {
    TheHeader,
    ChatConversationsDropdown,
    ChatConversation,
    ChatMessageInput,
  },
  setup() {
    // Create Settings from storage
    const settings = Settings.loadFromLocalStorage();

    return {
      settings
    }
  },
  data() {
    return {
      messages: [
        { role: "system", content: "All responses in markdown format with syntax highlighting." }
      ] as any[],
    }
  },
  methods: {
    getOpenAI() {
      return new OpenAI({
        apiKey: this.settings.apiKey!,
        dangerouslyAllowBrowser: true,
      })
    },
    sendSystemMessage() {
    },
    async sendMessage(message: string) {

      const openai = this.getOpenAI();

      this.messages.push(
        { role: "user", content: message }
      )

      if (this.settings.stream)
      {
        const completion = await openai.chat.completions.create({
          messages: this.messages,
          model: this.settings.model!,
          stream: true,
        });

        let chunks = [];

        this.messages.push(
          {
            role: "loading",
            content: "",
          }
        )

        for await (const chunk of completion)
        {
          chunks.push(chunk.choices[0].delta.content);

          this.messages[this.messages.length - 1] = {
            role: "assistant",
            content: chunks.join(""),
          };
        }
      }
      else
      {
        const completion = await openai.chat.completions.create({
          messages: this.messages,
          model: this.settings.model!,
        });

        this.messages.push(
          {
            role: "assistant",
            content: completion.choices[0].message.content!,
          }
        )
      }
    }
  }
}
</script>

<template>
  <main>
    <TheHeader :settings="settings" />

    <div class="container-md mx-auto pb-6">

      <div class="m-3 d-flex flex-wrap">

        <ChatConversationsDropdown :conversations="['test1', 'test2', 'test3']" />

        <button class="btn btn-primary my-1" type="button">Create</button>

        <button class="btn btn-danger my-1 ml-auto" type="button">Delete</button>

      </div>

      <ChatConversation class="mx-3" :messages="messages" />

      <ChatMessageInput placeholder="Enter a message" class="mx-3" @send-message="sendMessage" />

    </div>
  </main>
</template>

<style scoped>
.page {
  height: 100vh;
  width: 100%;
}
</style>
