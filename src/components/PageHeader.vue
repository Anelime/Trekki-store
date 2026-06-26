<script setup lang="ts">
import { asset } from "../utils/asset";
</script>

<template>
  <header class="page-header">
    <div class="wrap nav">
      <a class="brand" href="index.html">
        <span class="mark" aria-hidden="true">
          <img :src="asset('assets/trekki-emblem-dark.webp')" alt="" width="718" height="718" decoding="async">
        </span>
        <span class="wordmark"><strong>TREKKI</strong><span>store</span></span>
      </a>
      <nav class="top-links" aria-label="Навигация">
        <a href="longsleeves.html">Лонгсливы</a>
        <a href="tshirts.html">Футболки</a>
        <a href="buffs.html">Бафы</a>
        <a href="fabrics.html">Ткани</a>
        <a href="printing.html">Принты</a>
        <a href="#contact">Контакты</a>
        <a class="nav-cta" href="#contact">Расчёт и сроки</a>
      </nav>
    </div>
  </header>
</template>
