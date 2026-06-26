<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import type { FormConfig, SelectionContextOptions, TrekkiFormApi } from "../types";

const props = defineProps<{
  config: FormConfig;
}>();

const telegramUrl = "https://t.me/vkspb";
const productOptions = ref([
  "Лонгсливы",
  "Футболки",
  "Бафы",
  "Комплект формы",
  "Подбор ткани / материала",
  "Принт / логотипы на изделие",
  "Размеры / посадка",
  "Готовые принты, медали или мерч",
  "Другое / пока не знаю"
]);

const form = reactive({
  brief: "",
  page: "",
  source: "Trekki Store",
  name: "",
  contact: "",
  product: "",
  quantity: "",
  date: "",
  city: "",
  design: "Логотип / макет есть",
  msg: ""
});

const selection = reactive({
  visible: false,
  title: "",
  text: ""
});

const submitLabel = ref(props.config.cta || "Отправить заявку");
const statusMessage = ref("");
const statusType = ref<"success" | "error">("success");
const fallbackVisible = ref(false);
const fallbackText = ref("");
const submitting = ref(false);

const endpoint = computed(() => (props.config.endpoint || window.TREKKI_FORM_ENDPOINT || "").trim());
const method = "POST";
const selectionPrefixes = ["Выбранная ткань: ", "Выбор из конструктора: ", "Сценарий заказа: ", "Выбранный способ нанесения: "];

const ensureProductOption = (value: string) => {
  if (!productOptions.value.includes(value)) productOptions.value.push(value);
};

const setProduct = (value?: string | null) => {
  const next = (value || "").trim();
  if (!next) return;
  ensureProductOption(next);
  form.product = next;
};

const removeSelectionLines = () => {
  form.msg = form.msg
    .split("\n")
    .filter((line) => !selectionPrefixes.some((prefix) => line.startsWith(prefix)))
    .join("\n");
};

const setCommentContext = (label?: string | null, value?: string | null) => {
  const next = (value || "").trim();
  if (!next) return;
  const prefix = label ? `${label}: ` : "";
  const line = `${prefix}${next}`;
  const lines = form.msg
    .split("\n")
    .filter((item) => item.trim() && (!prefix || !item.startsWith(prefix)));
  lines.unshift(line);
  form.msg = lines.join("\n");
};

const setSubmitLabel = (value?: string | null) => {
  const next = (value || "").trim();
  if (next) submitLabel.value = next;
};

const setSelectionContext = (title?: string | null, text?: string | null, options: SelectionContextOptions = {}) => {
  const nextTitle = (title || "Выбор").trim();
  const nextText = (text || "").trim();
  selection.visible = true;
  selection.title = nextTitle || "Выбор добавлен";
  selection.text = nextText;
  if (options.product) setProduct(options.product);
  if (options.submitLabel) setSubmitLabel(options.submitLabel);
  form.brief = nextText;
  if (nextText) {
    removeSelectionLines();
    setCommentContext(nextTitle, nextText);
  }
};

const clearSelectionContext = () => {
  selection.visible = false;
  selection.title = "";
  selection.text = "";
  form.brief = "";
  removeSelectionLines();
};

const setStatus = (message: string, type: "success" | "error") => {
  statusMessage.value = message;
  statusType.value = type;
};

const buildText = () => {
  const lines = [
    "Здравствуйте! Заявка с сайта Trekki Store.",
    `Имя: ${form.name.trim()}`,
    `Контакт: ${form.contact.trim()}`,
    `Что нужно: ${form.product || "не указано"}`,
    `Тираж: ${form.quantity.trim() || "не указан"}`,
    `К какой дате: ${form.date.trim() || "не указано"}`,
    `Город доставки: ${form.city.trim() || "не указан"}`,
    `Логотип / макет: ${form.design || "не указано"}`
  ];
  const brief = form.brief.trim();
  const comment = form.msg.trim();
  if (brief && !comment.includes(brief)) lines.push(`Контекст заявки: ${brief}`);
  lines.push(`Комментарий: ${comment || "нет"}`);
  return lines.join("\n");
};

const buildPayload = (text: string) => ({
  source: form.source,
  page: form.page || window.location.href,
  name: form.name.trim(),
  contact: form.contact.trim(),
  product: form.product,
  quantity: form.quantity.trim(),
  date: form.date.trim(),
  city: form.city.trim(),
  design: form.design,
  brief: form.brief.trim(),
  comment: form.msg.trim(),
  text
});

const submitToEndpoint = async (text: string) => {
  const response = await fetch(endpoint.value, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildPayload(text)),
    mode: "cors",
    credentials: "omit"
  });
  if (!response.ok) throw new Error(`form endpoint responded with ${response.status}`);
};

const copyToClipboard = async (value: string) => {
  if (!navigator.clipboard || !window.isSecureContext) {
    throw new Error("clipboard unavailable");
  }
  await navigator.clipboard.writeText(value);
};

const openTelegram = () => {
  try {
    return window.open(telegramUrl, "_blank", "noopener");
  } catch {
    return null;
  }
};

const copyAgain = async () => {
  try {
    await copyToClipboard(fallbackText.value);
    setStatus("Текст заявки скопирован ещё раз. Откройте Telegram и вставьте его в чат @vkspb.", "success");
  } catch {
    setStatus("Не получилось скопировать автоматически. Выделите текст заявки ниже и скопируйте вручную.", "error");
  }
};

const handleSubmit = async () => {
  const text = buildText();
  fallbackText.value = text;
  submitting.value = true;
  fallbackVisible.value = !endpoint.value;
  setStatus(endpoint.value ? "Отправляем заявку..." : "Копируем заявку и открываем Telegram...", "success");

  if (endpoint.value) {
    try {
      await submitToEndpoint(text);
      fallbackVisible.value = false;
      setStatus("Заявка отправлена. Мы получили все поля формы и скоро свяжемся с вами.", "success");
      form.name = "";
      form.contact = "";
      form.quantity = "";
      form.date = "";
      form.city = "";
      form.design = "Логотип / макет есть";
      form.msg = "";
      form.brief = "";
    } catch {
      fallbackVisible.value = true;
      setStatus("Не получилось отправить заявку автоматически. Скопируйте текст ниже или отправьте его в Telegram @vkspb.", "error");
    } finally {
      submitting.value = false;
    }
    return;
  }

  const telegramWindow = openTelegram();
  try {
    await copyToClipboard(text);
    setStatus(
      telegramWindow
        ? "Заявка скопирована. Telegram открыт в новой вкладке — вставьте текст и отправьте его @vkspb."
        : "Заявка скопирована. Нажмите «Открыть Telegram», вставьте текст и отправьте его @vkspb.",
      "success"
    );
  } catch {
    setStatus(
      telegramWindow
        ? "Telegram открыт, но скопировать текст автоматически не получилось. Скопируйте заявку ниже вручную."
        : "Не получилось открыть Telegram и скопировать текст автоматически. Скопируйте заявку ниже и откройте Telegram вручную.",
      "error"
    );
  } finally {
    submitting.value = false;
  }
};

const api: TrekkiFormApi = {
  setProduct,
  setCommentContext,
  setSubmitLabel,
  setSelectionContext,
  clearSelectionContext
};

onMounted(() => {
  form.page = window.location.href;
  setProduct(props.config.product);
  setCommentContext(props.config.contextLabel || "Контекст страницы", props.config.comment);
  setSubmitLabel(props.config.cta);
  window.TrekkiForm = api;
});

onBeforeUnmount(() => {
  if (window.TrekkiForm === api) delete window.TrekkiForm;
});
</script>

<template>
  <section class="section contact" id="contact">
    <div class="wrap contact-grid">
      <div>
        <span class="eyebrow on-dark">Связаться</span>
        <h2 class="section-title display">Посчитаем<br>ваш заказ</h2>
        <p class="lead">Напишите или позвоните — поможем выбрать ткань, способ для принта, размерную сетку и реалистичный формат тиража.</p>
        <div class="contact-methods">
          <a href="https://t.me/vkspb" target="_blank" rel="noopener" class="cm">
            <span class="cm-ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8.1 2.1l4.7 1.4 1.8 5.6c.3 1 1.6 1.2 2.2.4l2.7-3.4 4.9 3.6c.8.6 1.9.1 2.1-.9l2.7-14.7c.2-1-.8-1.7-1.7-1.3Z"/><path d="m7.7 14.1 8.8-5.4-6.8 7.2"/></svg></span>
            <span><small>Telegram — быстрее всего</small><b>@vkspb</b></span>
          </a>
          <a href="tel:+79219526410" class="cm">
            <span class="cm-ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg></span>
            <span><small>Телефон</small><b>+7 921 952 64 10</b></span>
          </a>
          <a href="mailto:mail@vkspb.info" class="cm">
            <span class="cm-ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg></span>
            <span><small>Почта</small><b>mail@vkspb.info</b></span>
          </a>
        </div>
        <div class="contact-tag">Доставка по России и СНГ · СДЭК по договорённости · Тираж от 5 штук</div>
      </div>

      <form id="orderForm" method="post" :action="endpoint || undefined" @submit.prevent="handleSubmit">
        <input type="hidden" id="f-brief-summary" name="brief" v-model="form.brief">
        <input type="hidden" id="f-page" name="page" v-model="form.page">
        <input type="hidden" id="f-source" name="source" v-model="form.source">

        <div class="form-selection" data-form-selection :hidden="!selection.visible">
          <span class="form-selection-kicker">Добавлено в заявку</span>
          <strong data-form-selection-title>{{ selection.title }}</strong>
          <p data-form-selection-text>{{ selection.text }}</p>
          <button type="button" class="form-selection-clear" data-form-selection-clear @click="clearSelectionContext">Очистить выбор</button>
        </div>

        <div class="fld">
          <label for="f-name">Как к вам обращаться</label>
          <input id="f-name" v-model="form.name" name="name" type="text" placeholder="Имя" autocomplete="name" required>
        </div>
        <div class="fld">
          <label for="f-contact">Телефон или email</label>
          <input id="f-contact" v-model="form.contact" name="contact" type="text" placeholder="+7 ... или mail@..." autocomplete="email" required>
        </div>
        <div class="fld">
          <label for="f-product">Что нужно</label>
          <select id="f-product" v-model="form.product" name="product" required>
            <option value="">Выберите вариант</option>
            <option v-for="option in productOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="form-row">
          <div class="fld">
            <label for="f-quantity">Тираж</label>
            <input id="f-quantity" v-model="form.quantity" name="quantity" type="text" placeholder="Например: 15 или 20-30">
          </div>
          <div class="fld">
            <label for="f-date">К какой дате</label>
            <input id="f-date" v-model="form.date" name="date" type="text" placeholder="Например: к 15 мая">
          </div>
        </div>
        <div class="form-row">
          <div class="fld">
            <label for="f-city">Город доставки</label>
            <input id="f-city" v-model="form.city" name="city" type="text" placeholder="Санкт-Петербург" autocomplete="address-level2">
          </div>
          <div class="fld">
            <label for="f-design">Логотип или макет</label>
            <select id="f-design" v-model="form.design" name="design">
              <option>Логотип / макет есть</option>
              <option>Есть идея, макета нет</option>
              <option>Нужна помощь с макетом</option>
              <option>Пока не знаю</option>
            </select>
          </div>
        </div>
        <div class="fld">
          <label for="f-msg">Комментарий</label>
          <textarea id="f-msg" v-model="form.msg" name="msg" placeholder="Например: для бегового клуба, нужна лёгкая ткань, хочется принт с маршрутом и логотипом команды"></textarea>
        </div>
        <button type="submit" class="btn btn-light" data-form-submit :disabled="submitting">
          {{ submitting ? (endpoint ? "Отправляем заявку..." : "Копируем заявку...") : submitLabel }}
          <span class="arr" aria-hidden="true">→</span>
        </button>
        <p class="hint">Кнопка отправит заявку. Если автоматическая отправка недоступна, покажем готовый текст для Telegram @vkspb, чтобы заявка не потерялась. Можно и позвонить: <a class="text-link" href="tel:+79219526410">+7 921 952 64 10</a>.</p>

        <p v-if="statusMessage" class="form-status" :class="{ 'is-success': statusType === 'success', 'is-error': statusType === 'error' }" role="status" aria-live="polite">{{ statusMessage }}</p>
        <div v-if="fallbackVisible" class="form-fallback">
          <p>Если текст не появился в Telegram автоматически, скопируйте заявку ещё раз и вставьте её в чат.</p>
          <textarea readonly rows="7" aria-label="Текст заявки для отправки в Telegram" :value="fallbackText"></textarea>
          <div class="fallback-actions">
            <button type="button" class="copy-again" @click="copyAgain">Скопировать ещё раз</button>
            <a class="telegram-link" :href="telegramUrl" target="_blank" rel="noopener">Открыть Telegram</a>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
