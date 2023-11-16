<script lang="ts">
import type { PropType } from 'vue'

export default {
    name: "SettingTextInput",
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
        type: {
            type: String,
            required: false
        }
    },
    emits: ['update:modelValue'],
}
</script>

<template>
    <div class="form-group my-1 px-2">
        <label>{{ label }}</label>
        <input class="form-control input-block mt-1" :type="type" :placeholder="placeholder" :value="modelValue"
            @input="$emit('update:modelValue', ($event as any).target.value)" />
    </div>
</template>