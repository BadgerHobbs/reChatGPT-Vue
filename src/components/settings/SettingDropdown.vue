<script lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'

export default {
    name: "SettingDropdown",
    props: {
        modelValue: {
            type: Object as PropType<any>,
            required: false,
            default: null,
        },
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: false
        },
        values: {
            type: Object,
            required: true,
        },
    },
    emits: ['update:modelValue'],
    setup() {
        const detailsRef = ref<HTMLElement | null>(null);

        return {
            detailsRef
        }
    },
    data() {
        return {
            value: this.modelValue,
        }
    }
}
</script>

<template>
    <div class="form-group my-1 px-2">
        <label>{{ label }}</label>
        <details ref="detailsRef" class="dropdown details-reset details-overlay d-inline-block mt-1 width-full">

            <summary class="btn width-full d-flex">
                <span v-if="values[value]">{{ values[value] }}</span>
                <span v-else>{{ placeholder }}</span>
                <div class="ml-auto pl-1">
                    <div class="dropdown-caret"></div>
                </div>
            </summary>

            <ul class="dropdown-menu dropdown-menu-ne" style="min-width: fit-content">

                <div style="overflow: auto; max-height: 13rem;">
                    <li v-for="(v, k) in values">
                        <a class="dropdown-item" style="cursor: pointer;" @click="() => {
                            value = k;
                            $emit('update:modelValue', k);
                            detailsRef!.removeAttribute('open');
                        }">
                            {{ v }}
                        </a>
                    </li>
                </div>

            </ul>
        </details>
    </div>
</template>