
<script lang="ts">

export default {
    name: "SettingButton",
    props: {
        label: {
            type: String,
            required: true
        },
    },
    emits: ['click'],
}
</script>

<template>
    <button class="btn mx-2" type="button" @click="(event) => {
        $emit('click', event);
    }">{{ label }}</button>
</template>
