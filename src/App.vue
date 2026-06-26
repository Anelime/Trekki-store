<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import ContactSection from "./components/ContactSection.vue";
import HomeHeader from "./components/HomeHeader.vue";
import PageHeader from "./components/PageHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { pages, resolvePageId } from "./data/pages";
import { enhancePage } from "./utils/enhancements";

const props = defineProps<{
  pageId?: string;
}>();

const page = computed(() => pages[resolvePageId(props.pageId)]);
const contentRoot = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  if (contentRoot.value) enhancePage(page.value.id, contentRoot.value);
});
</script>

<template>
  <a class="skip-link" href="#main">Пропустить к содержимому</a>
  <HomeHeader v-if="page.layout === 'home'" />
  <PageHeader v-else />

  <main id="main">
    <div ref="contentRoot" v-html="page.content"></div>
    <ContactSection :config="page.form" />
  </main>

  <SiteFooter />
</template>
