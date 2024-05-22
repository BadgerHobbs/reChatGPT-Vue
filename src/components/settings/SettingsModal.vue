
<script lang="ts">
import SettingTextInput from "./SettingTextInput.vue";
import SettingDropdown from "./SettingDropdown.vue";
import SettingTextArea from "./SettingTextArea.vue";
import SettingButton from "./SettingButton.vue";

import Settings from "@/models/settings";
import { Conversations } from '@/models/conversation-manager';

export default {
    name: "SettingsModal",
    components: {
        SettingTextInput,
        SettingDropdown,
        SettingTextArea,
        SettingButton,
    },
    props: {
        settings: {
            type: Settings,
            required: true,
        },
        conversations: {
            type: Conversations,
            required: true,
        },
    },
    methods: {
        /**
         * Save settings.
         */
        saveChanges() {
            this.settings.saveToLocalStorage();
        },

        /**
         * Export Conversations object as JSON.
         */
        exportJson() {
            this.conversations.exportJson();
        },

        /**
         * Import Conversations object from JSON.
         */
        async importJson() {
            const conversations = await Conversations.importJson();
            conversations.saveToLocalStorage();
            location.reload();
        }
    }
}
</script>

<template>
    <details-dialog class="Box Box--overlay d-flex flex-column anim-fade-in fast">

        <div class="Box-header">
            <button class="Box-btn-octicon btn-octicon float-right" type="button" data-close-dialog>
                <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16">
                    <path fill-rule="evenodd"
                        d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z">
                    </path>
                </svg>
            </button>
            <h3 class="Box-title">Settings</h3>
        </div>

        <div class="overflow-auto p-2">

            <div class="d-flex flex-wrap">

                <SettingTextInput label="OpenAI API Key" placeholder="Defaults to null" type="password" style="width: 50%;"
                    v-model="settings.apiKey" @update:model-value="saveChanges" />

                <SettingTextInput label="Temperature" placeholder="Defaults to 1" style="width: 50%;"
                    v-model="settings.temperature" @update:model-value="saveChanges" />

                <SettingTextInput label="Top-P" placeholder="Defaults to 1" style="width: 50%;" v-model="settings.topP"
                    @update:model-value="saveChanges" />

                <SettingTextInput label="N" placeholder="Defaults to 1" style="width: 50%;" v-model="settings.n"
                    @update:model-value="saveChanges" />

                <SettingDropdown label="Stream" placeholder="Select Mode" :values="{
                    'true': 'True',
                    'false': 'False',
                }" style="width: 50%;" v-model="settings.stream" @update:model-value="saveChanges" />

                <SettingTextInput label="Stop" placeholder="Defaults to null" style="width: 50%;" v-model="settings.stop"
                    @update:model-value="saveChanges" />

                <SettingTextInput label="Max Tokens" placeholder="Defaults to inf" style="width: 50%;"
                    v-model="settings.maxTokens" @update:model-value="saveChanges" />

                <SettingTextInput label="Presence Penalty" placeholder="Defaults to 0" style="width: 50%;"
                    v-model="settings.presencePenalty" @update:model-value="saveChanges" />

                <SettingTextInput label="Frequency Penalty" placeholder="Defaults to 0" style="width: 50%;"
                    v-model="settings.frequencyPenalty" @update:model-value="saveChanges" />

                <SettingTextInput label="Logit Bias" placeholder="Defaults to null" style="width: 50%;"
                    v-model="settings.logitBias" @update:model-value="saveChanges" />

                <SettingDropdown label="Theme" placeholder="Select Theme" :values="{
                    'system': 'System',
                    'light': 'Light',
                    'dark': 'Dark',
                    'dark-dimmed': 'Dark Dimmed',
                    'dark-high-contrast': 'Dark (High-Contrast)'
                }" style="width: 50%;" v-model="settings.theme" @update:model-value="saveChanges" />

                <SettingDropdown label="Model" placeholder="Select Model" :values="{
                    'gpt-3.5-turbo': 'GPT-3.5-Turbo',
                    'gpt-3.5-turbo-0125': 'GPT-3.5-Turbo-0125',
                    'gpt-3.5-turbo-0613': 'GPT-3.5-Turbo-0613',
                    'gpt-3.5-turbo-1106': 'GPT-3.5-Turbo-1106',
                    'gpt-3.5-turbo-16k': 'GPT-3.5-Turbo-16k',
                    'gpt-3.5-turbo-16k-0613': 'GPT-3.5-Turbo-16k-0613',
                    'gpt-3.5-turbo-instruct': 'GPT-3.5-Turbo-Instruct',
                    'gpt-4': 'GPT-4',
                    'gpt-4-0125-preview': 'GPT-4-0125-Preview',
                    'gpt-4-0613': 'GPT-4-0613',
                    'gpt-4-1106-preview': 'GPT-4-1106-Preview',
                    'gpt-4-1106-vision-preview': 'GPT-4-1106-Vision-Preview',
                    'gpt-4-32k': 'GPT-4-32k',
                    'gpt-4-32k-0613': 'GPT-4-32k-0613',
                    'gpt-4-turbo': 'GPT-4-Turbo',
                    'gpt-4-turbo-2024-04-09': 'GPT-4-Turbo-2024-04-09',
                    'gpt-4-turbo-preview': 'GPT-4-Turbo-Preview',
                    'gpt-4-vision-preview': 'GPT-4-Vision-Preview',
                    'gpt-4o': 'GPT-4o',
                    'gpt-4o-2024-05-13': 'GPT-4o-2024-05-13',
                    'azure': 'Azure',
                }" style="width: 50%;" v-model="settings.model" @update:model-value="saveChanges" />

                <SettingTextInput v-if="settings.model == 'azure'" label="Azure Resource Name" placeholder="Defaults to null" style="width: 50%;"
                    v-model="settings.azureResourceName" @update:model-value="saveChanges" />

                <SettingTextInput v-if="settings.model == 'azure'" label="Azure Deployment Name" placeholder="Defaults to null" style="width: 50%;"
                    v-model="settings.azureDeploymentName" @update:model-value="saveChanges" />

                <SettingTextArea label="System Message" placeholder="Defaults to null" class="width-full"
                    v-model="settings.systemMessage" @update:model-value="saveChanges" />
            </div>

            <div class="Box-footer d-flex mt-3 width-full px-0">

                <SettingButton label="Export JSON" style="width: 50%;" @click="exportJson" />
                <SettingButton label="Import JSON" style="width: 50%;" @click="importJson" />
            </div>

        </div>

    </details-dialog>
</template>
