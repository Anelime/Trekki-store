import buffsContent from "../content/buffs.html?raw";
import fabricsContent from "../content/fabrics.html?raw";
import futureItemsContent from "../content/future-items.html?raw";
import homeContent from "../content/home.html?raw";
import longsleevesContent from "../content/longsleeves.html?raw";
import printingContent from "../content/printing.html?raw";
import sizesContent from "../content/sizes.html?raw";
import tshirtsContent from "../content/tshirts.html?raw";
import type { PageConfig, PageId } from "../types";

export const pages: Record<PageId, PageConfig> = {
  home: {
    id: "home",
    layout: "home",
    content: homeContent,
    form: {
      cta: "Получить расчёт и сроки"
    }
  },
  longsleeves: {
    id: "longsleeves",
    layout: "page",
    content: longsleevesContent,
    form: {
      product: "Лонгсливы",
      contextLabel: "Страница",
      comment: "Интересуют лонгсливы: нужен предварительный расчёт по ткани, принту, тиражу и срокам.",
      cta: "Получить расчёт и сроки"
    }
  },
  tshirts: {
    id: "tshirts",
    layout: "page",
    content: tshirtsContent,
    form: {
      product: "Футболки",
      contextLabel: "Страница",
      comment: "Интересуют футболки: нужен предварительный расчёт по ткани, принту, тиражу и срокам.",
      cta: "Получить расчёт и сроки"
    }
  },
  buffs: {
    id: "buffs",
    layout: "page",
    content: buffsContent,
    form: {
      product: "Бафы",
      contextLabel: "Страница",
      comment: "Интересуют бафы: нужен предварительный расчёт по ткани, принту, тиражу и срокам.",
      cta: "Получить расчёт и сроки"
    }
  },
  fabrics: {
    id: "fabrics",
    layout: "page",
    content: fabricsContent,
    form: {
      product: "Подбор ткани / материала",
      contextLabel: "Страница",
      comment: "Нужен подбор ткани под задачу. Хочу понять материал, способ печати, тираж и сроки.",
      cta: "Подобрать ткань и принт"
    }
  },
  printing: {
    id: "printing",
    layout: "page",
    content: printingContent,
    form: {
      product: "Принт / логотипы на изделие",
      contextLabel: "Страница",
      comment: "Нужно подобрать способ нанесения под ткань, изделие и сценарий носки.",
      cta: "Подобрать способ нанесения"
    }
  },
  sizes: {
    id: "sizes",
    layout: "page",
    content: sizesContent,
    form: {
      product: "Размеры / посадка",
      contextLabel: "Страница",
      comment: "Нужно помочь подобрать размеры и посадку под тираж.",
      cta: "Подобрать размер и рассчитать форму"
    }
  },
  "future-items": {
    id: "future-items",
    layout: "page",
    content: futureItemsContent,
    form: {
      product: "Готовые принты, медали или мерч",
      contextLabel: "Страница",
      comment: "Нужна короткая подборка готовых принтов, медалей или мерча под событие.",
      cta: "Получить подборку для события"
    }
  }
};

export const resolvePageId = (value: string | undefined): PageId => {
  if (value && value in pages) return value as PageId;
  return "home";
};
