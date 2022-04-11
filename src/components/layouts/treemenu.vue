<template>
  <template v-if="item.children.length > 0">
    <el-sub-menu :index="item.ids">
      <template #title>{{ item.title }}</template>
      <template v-for="child in item.children" :key="child.id">
        <treemenu :item="child" @clickMenu="handleMenu" />
      </template>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="item.ids" @click="handleMenu(item)">{{ item.title }}</el-menu-item>
  </template>
</template>

<script setup>
const props = defineProps({
  item: Object
})
const emit = defineEmits(['clickMenu'])
const handleMenu = (item) => {
  emit("clickMenu", item);
}
</script>
