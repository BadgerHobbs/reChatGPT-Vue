
<script lang="ts">
import { Conversations, Conversation } from '@/models/conversation-manager';

export default {
    name: "ChatConversationsDropdown",
    props: {
        conversations: {
            type: Conversations,
            required: true,
        },
        initialValue: {
            type: Conversation,
            required: false,
            default: null,
        },
    },
    emits: ['click:loadConversation', 'click:deleteConversation'],
    data() {
        return {
            filter: "",
            filteredValues: this.conversations.conversations,
        }
    },
}
</script>

<template>
    <details class="dropdown details-reset details-overlay d-inline-block mr-2 my-1">
        <summary class="btn width-full d-flex">
            <span v-if="initialValue.name">{{ initialValue.name }}</span>
            <span v-else>Select a Conversation</span>
            <div class="ml-auto pl-1">
                <div class="dropdown-caret"></div>
            </div>
        </summary>
        <div class="SelectMenu SelectMenu--hasFilter">
            <div class="SelectMenu-modal">
                <header class="SelectMenu-header">
                    <h3 class="SelectMenu-title">Conversations</h3>
                    <button class="SelectMenu-closeButton" type="button">
                        <svg class="octicon octicon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                            height="16">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M3.72 3.72C3.86062 3.57955 4.05125 3.50066 4.25 3.50066C4.44875 3.50066 4.63937 3.57955 4.78 3.72L8 6.94L11.22 3.72C11.2887 3.64631 11.3715 3.58721 11.4635 3.54622C11.5555 3.50523 11.6548 3.48319 11.7555 3.48141C11.8562 3.47963 11.9562 3.49816 12.0496 3.53588C12.143 3.5736 12.2278 3.62974 12.299 3.70096C12.3703 3.77218 12.4264 3.85702 12.4641 3.9504C12.5018 4.04379 12.5204 4.14382 12.5186 4.24452C12.5168 4.34523 12.4948 4.44454 12.4538 4.53654C12.4128 4.62854 12.3537 4.71134 12.28 4.78L9.06 8L12.28 11.22C12.3537 11.2887 12.4128 11.3715 12.4538 11.4635C12.4948 11.5555 12.5168 11.6548 12.5186 11.7555C12.5204 11.8562 12.5018 11.9562 12.4641 12.0496C12.4264 12.143 12.3703 12.2278 12.299 12.299C12.2278 12.3703 12.143 12.4264 12.0496 12.4641C11.9562 12.5018 11.8562 12.5204 11.7555 12.5186C11.6548 12.5168 11.5555 12.4948 11.4635 12.4538C11.3715 12.4128 11.2887 12.3537 11.22 12.28L8 9.06L4.78 12.28C4.63782 12.4125 4.44977 12.4846 4.25547 12.4812C4.06117 12.4777 3.87579 12.399 3.73837 12.2616C3.60096 12.1242 3.52225 11.9388 3.51882 11.7445C3.51539 11.5502 3.58752 11.3622 3.72 11.22L6.94 8L3.72 4.78C3.57955 4.63938 3.50066 4.44875 3.50066 4.25C3.50066 4.05125 3.57955 3.86063 3.72 3.72Z">
                            </path>
                        </svg>
                    </button>
                </header>
                <form class="SelectMenu-filter">
                    <input class="SelectMenu-input form-control" type="text" placeholder="Filter" v-model="filter" @input="() => {
                        filteredValues = conversations.conversations.filter((item: any) => item.toLowerCase().includes(filter.toLowerCase()))
                    }">
                </form>
                <div class="SelectMenu-list">
                    <button class="SelectMenu-item parent mr-auto" role="menuitem" v-for="v in filteredValues">
                        <span class="width-full" @click="$emit('click:loadConversation', v.id)">{{ v.name }}</span>
                        <div class="d-flex ml-auto">
                            <a class="btn-octicon btn-octicon-danger p-0" type="button"
                                @click="$emit('click:deleteConversation', v.id)">
                                <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16"
                                    height="16">
                                    <path fill-rule="evenodd"
                                        d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                    </button>
                </div>
                <footer class="SelectMenu-footer">Showing {{ filteredValues.length }} of {{
                    conversations.conversations.length }}</footer>
            </div>
        </div>
    </details>
</template>
