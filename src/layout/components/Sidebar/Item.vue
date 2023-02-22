<template>
  <!-- <svg-icon class="icon" v-if="isCustomSvg" :name="icon" />
  <component :is="icon" v-else-if="!!icon" class="icon" /> -->
  <el-icon v-if="isCustomSvg" class="svgIcon"><svg-icon :name="icon" /></el-icon>
  <el-icon v-else-if="!!icon" class="svgIcon"><component :is="icon" /></el-icon>
  <span>{{ $t(title) }}</span>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useApp } from '@/pinia/modules/app'
import { storeToRefs } from 'pinia'

export default defineComponent({
  props: ['title', 'icon'],
  setup({ icon }) {
    const appStore = useApp()
    const { sidebar } = storeToRefs(appStore)
    const isCustomSvg = computed(() => icon && icon.startsWith('icon-'))
    return {
      collapse: computed(() => sidebar.value.collapse),
      isCustomSvg,
    }
  },
})
</script>

<style lang="scss" scoped>
.svgIcon {
  // margin-right: 10px;
  width: 18px !important;
  height: 18px !important;
  font-size: 16px;
  text-align: center;
  color: currentColor;
}
</style>
