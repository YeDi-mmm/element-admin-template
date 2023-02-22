<template>
  <svg class="icon" aria-hidden="true">
    <use class="svg-use" :href="'#' + ids.find(item => item.includes($attrs.name))" />
  </svg>
</template>

<script setup>
import { defineComponent, computed, useAttrs } from 'vue'
// 可以打印所有注册的svg图标
import ids from 'virtual:svg-icons-names'
</script>

<style scope>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>

