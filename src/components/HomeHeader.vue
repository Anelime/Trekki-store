<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { asset } from "../utils/asset";

const open = ref(false);
const scrolled = ref(false);
const firstMenuLink = ref<HTMLAnchorElement | null>(null);
const burger = ref<HTMLButtonElement | null>(null);

const setOpen = (value: boolean, returnFocus = false) => {
  open.value = value;
  document.body.style.overflow = value ? "hidden" : "";
  if (value) requestAnimationFrame(() => firstMenuLink.value?.focus());
  if (!value && returnFocus) requestAnimationFrame(() => burger.value?.focus());
};

const onScroll = () => {
  scrolled.value = window.scrollY > 40;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && open.value) setOpen(false, true);
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

watch(open, (value) => {
  if (!value) document.body.style.overflow = "";
});
</script>

<template>
  <header id="header" :class="{ scrolled }">
    <div class="wrap nav">
      <a href="#top" class="brand">
        <span class="mark" aria-hidden="true">
          <img class="logo-light" :src="asset('assets/trekki-emblem-light.webp')" alt="" width="718" height="718" decoding="async">
          <img class="logo-dark" :src="asset('assets/trekki-emblem-dark.webp')" alt="" width="718" height="718" decoding="async">
        </span>
        <span class="wordmark"><strong>TREKKI</strong><span>store</span></span>
      </a>
      <nav class="nav-links" aria-label="Основная навигация">
        <a href="longsleeves.html">Лонгсливы</a>
        <a href="tshirts.html">Футболки</a>
        <a href="buffs.html">Бафы</a>
        <a href="fabrics.html">Ткани</a>
        <a href="printing.html">Принты</a>
        <a href="#smart-brief">Конструктор</a>
      </nav>
      <div class="nav-cta">
        <a href="#contact" class="btn btn-primary">Получить расчёт и сроки</a>
      </div>
      <button
        ref="burger"
        class="burger"
        type="button"
        :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
        :aria-expanded="open ? 'true' : 'false'"
        @click="setOpen(!open, true)"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div id="mobileMenu" class="mobile-menu" :class="{ open }" :hidden="!open" :inert="!open">
    <a ref="firstMenuLink" href="longsleeves.html" @click="setOpen(false)">Лонгсливы</a>
    <a href="tshirts.html" @click="setOpen(false)">Футболки</a>
    <a href="buffs.html" @click="setOpen(false)">Бафы</a>
    <a href="fabrics.html" @click="setOpen(false)">Ткани</a>
    <a href="printing.html" @click="setOpen(false)">Принты</a>
    <a href="#smart-brief" @click="setOpen(false)">Конструктор</a>
    <div class="mm-foot">
      <a href="https://t.me/vkspb" target="_blank" rel="noopener">Telegram @vkspb</a><br>
      <a href="tel:+79219526410">+7 921 952 64 10</a><br>
      <a href="mailto:mail@vkspb.info">mail@vkspb.info</a>
    </div>
  </div>
</template>
