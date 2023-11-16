
<script lang="ts">
import type { PropType } from 'vue'

export default {
    name: "SettingTextArea",
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
    },
    emits: ['update:modelValue'],
}
</script>

<template>
    <div class="form-group my-1 px-2">
        <label>{{ label }}</label>

        <textarea class="form-control color-bg-inset mt-1" :placeholder="placeholder"
            style="min-height: 5rem; height: 5rem;" :value="modelValue"
            @input="$emit('update:modelValue', ($event as any).target.value)"></textarea>
    </div>
</template>
