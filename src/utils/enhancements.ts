import type { PageId } from "../types";

const supportsSmoothScroll = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollBehavior = (): ScrollBehavior => (supportsSmoothScroll() ? "smooth" : "auto");

const setupReveal = (root: ParentNode) => {
  const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!reveals.length) return;

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((element) => observer.observe(element));
};

const setupHomeFabricFilter = (root: ParentNode) => {
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>("#fabFilter .chip"));
  const cards = Array.from(root.querySelectorAll<HTMLElement>("#fabGrid .fab"));
  if (!chips.length || !cards.length) return;

  const applyFilter = (filter: string) => {
    chips.forEach((chip) => {
      const active = chip.dataset.f === filter;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
    cards.forEach((card) => {
      const categories = card.dataset.cat || "";
      card.style.display = filter === "all" || categories.includes(filter) ? "" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => applyFilter(chip.dataset.f || "all"));
  });
};

const setupSmartBrief = (root: ParentNode) => {
  const builder = root.querySelector<HTMLElement>("[data-brief-builder]");
  if (!builder) return;

  const storageKey = "trekki-store-brief";
  const fields = ["product", "fabric", "print", "sizes"] as const;
  const fieldLabels: Record<(typeof fields)[number], string> = {
    product: "Изделие",
    fabric: "Ткань",
    print: "Принт",
    sizes: "Размеры"
  };
  let state: Partial<Record<(typeof fields)[number], string>> = {};

  try {
    state = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
  } catch {
    state = {};
  }

  const note = root.querySelector<HTMLElement>("[data-brief-note]");
  const reset = root.querySelector<HTMLButtonElement>("[data-brief-reset]");
  const cta = root.querySelector<HTMLAnchorElement>("[data-brief-cta]");

  const buildBriefText = () =>
    fields
      .filter((field) => state[field])
      .map((field) => `${fieldLabels[field]}: ${state[field]}`)
      .join("; ");

  const renderBrief = () => {
    for (const field of fields) {
      const value = state[field] || "";
      builder.querySelectorAll<HTMLButtonElement>(`[data-brief-field="${field}"]`).forEach((button) => {
        const active = button.dataset.briefValue === value;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const target = root.querySelector<HTMLElement>(`[data-summary="${field}"]`);
      if (target) {
        target.textContent = value || "не выбрано";
        target.classList.toggle("is-empty", !value);
      }
    }

    const count = fields.filter((field) => state[field]).length;
    if (note) {
      note.textContent = count
        ? `Выбрано ${count} из 4. Этот маршрут заказа уже попадёт в форму ниже.`
        : "Можно заполнить не всё. Даже два выбора уже помогут быстрее предложить ткань, принт и реалистичный тираж.";
    }
  };

  builder.querySelectorAll<HTMLButtonElement>("[data-brief-field]").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const field = button.dataset.briefField as (typeof fields)[number] | undefined;
      const value = button.dataset.briefValue;
      if (!field || !value) return;
      state[field] = value;
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // Storage can be blocked in private contexts; the builder still works for the current view.
      }
      renderBrief();
    });
  });

  reset?.addEventListener("click", () => {
    state = {};
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // See storage note above.
    }
    renderBrief();
  });

  cta?.addEventListener("click", () => {
    const summary = buildBriefText();
    if (!summary) return;
    window.TrekkiForm?.setSelectionContext("Выбор из конструктора", summary, {
      product: state.product || "Другое / пока не знаю",
      submitLabel: "Отправить заявку с этим выбором"
    });
  });

  renderBrief();
};

const setupBuyerScenarios = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>("[data-scenario]").forEach((link) => {
    link.addEventListener("click", () => {
      const scenario = link.dataset.scenario;
      if (!scenario) return;
      window.TrekkiForm?.setSelectionContext("Сценарий заказа", scenario, {
        product: link.dataset.product,
        submitLabel: "Рассчитать такой заказ"
      });
    });
  });
};

const setupPrintingPage = (root: ParentNode) => {
  const setPrintMethod = (value?: string | null) => {
    if (value) window.TrekkiForm?.setCommentContext("Выбранный способ нанесения", value);
  };

  const setFromHash = () => {
    if (!location.hash) return;
    const target = root.querySelector<HTMLElement>(location.hash);
    setPrintMethod(target?.dataset.printMethod);
  };

  root.querySelectorAll<HTMLElement>("[data-print-method]").forEach((item) => {
    item.addEventListener("click", () => setPrintMethod(item.dataset.printMethod));
  });
  window.addEventListener("hashchange", setFromHash);
  setFromHash();
};

const setupProductGalleries = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>("[data-product-gallery]").forEach((gallery, galleryIndex) => {
    const slides = Array.from(gallery.querySelectorAll<HTMLElement>(".product-photo"));
    if (slides.length < 2 || gallery.dataset.galleryReady === "true") return;
    gallery.dataset.galleryReady = "true";
    gallery.setAttribute("tabindex", "0");
    gallery.setAttribute("role", "region");

    const controls = document.createElement("div");
    controls.className = "product-gallery-controls";
    controls.setAttribute("aria-label", "Управление фотогалереей");

    const arrows = document.createElement("div");
    arrows.className = "product-gallery-arrows";

    const prev = document.createElement("button");
    prev.className = "product-gallery-arrow";
    prev.type = "button";
    prev.setAttribute("aria-label", "Предыдущее фото");
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.className = "product-gallery-arrow";
    next.type = "button";
    next.setAttribute("aria-label", "Следующее фото");
    next.textContent = "›";

    arrows.append(prev, next);

    const dots = document.createElement("div");
    dots.className = "product-gallery-dots";
    dots.setAttribute("aria-label", "Фото в галерее");

    const dotButtons = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.className = "product-gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Показать фото ${index + 1}`);
      dot.addEventListener("click", () => scrollToSlide(index));
      dots.append(dot);
      return dot;
    });

    controls.append(arrows, dots);
    gallery.insertAdjacentElement("afterend", controls);

    const isScrollable = () => gallery.scrollWidth > gallery.clientWidth + 4;
    const getMaxScroll = () => Math.max(gallery.scrollWidth - gallery.clientWidth, 0);

    const getActiveIndex = () => {
      if (gallery.scrollLeft <= 2) return 0;
      if (gallery.scrollLeft >= getMaxScroll() - 2) return slides.length - 1;

      const center = gallery.scrollLeft + gallery.clientWidth / 2;
      let activeIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });
      return activeIndex;
    };

    function scrollToSlide(index: number) {
      slides[index]?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "nearest",
        inline: "start"
      });
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const activeIndex = getActiveIndex();
      const scrollable = isScrollable();
      const atStart = gallery.scrollLeft <= 2;
      const atEnd = gallery.scrollLeft >= getMaxScroll() - 2;
      controls.hidden = !scrollable;
      prev.disabled = !scrollable || atStart;
      next.disabled = !scrollable || atEnd;
      dotButtons.forEach((dot, index) => {
        const active = index === activeIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    prev.addEventListener("click", () => scrollToSlide(Math.max(getActiveIndex() - 1, 0)));
    next.addEventListener("click", () => scrollToSlide(Math.min(getActiveIndex() + 1, slides.length - 1)));
    gallery.addEventListener("scroll", scheduleUpdate, { passive: true });
    gallery.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = Math.min(Math.max(getActiveIndex() + direction, 0), slides.length - 1);
      scrollToSlide(nextIndex);
    });
    window.addEventListener("resize", scheduleUpdate);

    slides.forEach((slide, index) => {
      slide.id ||= `product-gallery-${galleryIndex + 1}-slide-${index + 1}`;
    });
    requestAnimationFrame(update);
  });
};

const setupFabricsPage = (root: ParentNode) => {
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>("#fabFilter .chip"));
  const fabrics = Array.from(root.querySelectorAll<HTMLAnchorElement>("#fabGrid .fabric"));
  const filterLinks = Array.from(root.querySelectorAll<HTMLElement>("[data-filter-link]"));
  let activeCard: HTMLAnchorElement | null = null;
  let detailRow: HTMLDivElement | null = null;
  let lastFocus: Element | null = null;

  const getFabricParts = (fabricId: string) => {
    const target = root.querySelector<HTMLElement>(`#${CSS.escape(fabricId)}`);
    if (!target) return null;
    const detail = target.querySelector<HTMLElement>(".detail-copy");
    const photo = target.querySelector<HTMLElement>(".detail-photo");
    const title = detail?.querySelector("h3")?.textContent?.trim();
    if (!detail || !title) return null;
    return { target, detail, photo, title };
  };

  const setSelectedFabric = (title: string) => {
    window.TrekkiForm?.setSelectionContext("Выбранная ткань", title, {
      product: "Подбор ткани / материала",
      submitLabel: "Отправить заявку по выбранной ткани"
    });
  };

  const closeFabricRow = (restoreFocus: boolean) => {
    if (!detailRow || detailRow.hidden) return;
    detailRow.classList.remove("is-open");
    detailRow.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("has-fabric-modal-open");
    if (activeCard) {
      activeCard.classList.remove("is-selected");
      activeCard.setAttribute("aria-expanded", "false");
      const action = activeCard.querySelector<HTMLElement>(".fabric-go");
      if (action) action.textContent = "Смотреть описание";
    }
    activeCard = null;
    window.setTimeout(() => {
      if (detailRow && !detailRow.classList.contains("is-open")) detailRow.hidden = true;
    }, 260);
    if (restoreFocus && lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  const createFabricRow = () => {
    detailRow = document.createElement("div");
    detailRow.className = "fabric-detail-modal";
    detailRow.hidden = true;
    detailRow.setAttribute("role", "dialog");
    detailRow.setAttribute("aria-modal", "true");
    detailRow.setAttribute("aria-hidden", "true");
    detailRow.setAttribute("aria-labelledby", "fabricRowTitle");
    detailRow.innerHTML = [
      '<div class="fabric-detail-dialog">',
      '<div class="fabric-row-photo"></div>',
      '<div class="fabric-row-copy">',
      '<div class="fabric-row-head">',
      "<div>",
      '<span class="kicker">Описание ткани</span>',
      '<h2 id="fabricRowTitle"></h2>',
      "</div>",
      '<button class="fabric-row-close" type="button" aria-label="Свернуть описание">×</button>',
      "</div>",
      '<div class="fabric-row-content"></div>',
      '<div class="fabric-row-actions">',
      '<a class="btn" href="#contact" data-fabric-contact>Подобрать эту ткань</a>',
      '<button class="btn ghost fabric-row-collapse" type="button">Свернуть</button>',
      "</div>",
      "</div>",
      "</div>"
    ].join("");
    detailRow.addEventListener("click", (event) => {
      if (event.target === detailRow) closeFabricRow(true);
    });
    detailRow.querySelector(".fabric-row-close")?.addEventListener("click", () => closeFabricRow(true));
    detailRow.querySelector(".fabric-row-collapse")?.addEventListener("click", () => closeFabricRow(true));
    detailRow.querySelector("[data-fabric-contact]")?.addEventListener("click", () => {
      const fabricId = activeCard?.getAttribute("href")?.slice(1);
      if (!fabricId) return;
      const parts = getFabricParts(fabricId);
      if (parts) setSelectedFabric(parts.title);
      closeFabricRow(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && detailRow && !detailRow.hidden) closeFabricRow(true);
    });
    document.body.append(detailRow);
  };

  const openFabricRow = (fabricId: string, options: { scrollRow?: boolean; scrollCard?: boolean; forceOpen?: boolean } = {}) => {
    const parts = getFabricParts(fabricId);
    const card = root.querySelector<HTMLAnchorElement>(`#fabGrid .fabric[href="#${CSS.escape(fabricId)}"]`);
    if (!parts || !card) return;
    if (!detailRow) createFabricRow();
    if (!detailRow) return;

    if (activeCard === card && !detailRow.hidden && !options.forceOpen) {
      closeFabricRow(true);
      return;
    }

    lastFocus = document.activeElement;
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove("is-selected");
      activeCard.setAttribute("aria-expanded", "false");
      const oldAction = activeCard.querySelector<HTMLElement>(".fabric-go");
      if (oldAction) oldAction.textContent = "Смотреть описание";
    }

    activeCard = card;
    activeCard.classList.add("is-selected");
    activeCard.setAttribute("aria-expanded", "true");
    const action = activeCard.querySelector<HTMLElement>(".fabric-go");
    if (action) action.textContent = "Описание открыто";
    setSelectedFabric(parts.title);

    const title = detailRow.querySelector<HTMLElement>("#fabricRowTitle");
    if (title) title.textContent = parts.title;
    const photoSlot = detailRow.querySelector<HTMLElement>(".fabric-row-photo");
    if (photoSlot) {
      photoSlot.replaceChildren();
      if (parts.photo) photoSlot.append(parts.photo.cloneNode(true));
    }
    const content = detailRow.querySelector<HTMLElement>(".fabric-row-content");
    if (content) {
      content.replaceChildren(parts.detail.cloneNode(true));
    }
    detailRow.hidden = false;
    detailRow.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("has-fabric-modal-open");
    requestAnimationFrame(() => {
      detailRow?.classList.add("is-open");
      detailRow?.querySelector<HTMLButtonElement>(".fabric-row-close")?.focus({ preventScroll: true });
    });
    if (options.scrollCard) card.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
    history.replaceState(null, "", `#${fabricId}`);
  };

  const applyFilter = (filter: string) => {
    chips.forEach((chip) => {
      const active = chip.dataset.f === filter;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });
    fabrics.forEach((card) => {
      const categories = card.dataset.cat || "";
      card.style.display = filter === "all" || categories.includes(filter) ? "" : "none";
    });
    if (activeCard && activeCard.style.display === "none") closeFabricRow(false);
  };

  chips.forEach((chip) => chip.addEventListener("click", () => applyFilter(chip.dataset.f || "all")));
  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      applyFilter(link.dataset.filterLink || "all");
      root.querySelector("#short")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    });
  });

  document.documentElement.classList.add("has-fabric-row");
  fabrics.forEach((card) => {
    card.setAttribute("aria-expanded", "false");
    card.addEventListener("click", (event) => {
      event.preventDefault();
      const fabricId = card.getAttribute("href")?.slice(1);
      if (fabricId) openFabricRow(fabricId);
    });
  });

  root.querySelectorAll<HTMLAnchorElement>('a[href^="#fabric-"]').forEach((link) => {
    if (link.closest("#fabGrid")) return;
    link.addEventListener("click", (event) => {
      const fabricId = link.getAttribute("href")?.slice(1);
      if (!fabricId || !getFabricParts(fabricId)) return;
      event.preventDefault();
      openFabricRow(fabricId, { scrollRow: true, forceOpen: true });
    });
  });

  const openFabricFromHash = () => {
    if (!location.hash.startsWith("#fabric-")) return;
    openFabricRow(location.hash.slice(1), { scrollRow: true, forceOpen: true });
  };

  window.addEventListener("hashchange", openFabricFromHash);
  openFabricFromHash();
};

export const enhancePage = (pageId: PageId, root: ParentNode) => {
  setupReveal(root);
  setupProductGalleries(root);

  if (pageId === "home") {
    setupHomeFabricFilter(root);
    setupSmartBrief(root);
    setupBuyerScenarios(root);
  }
  if (pageId === "fabrics") setupFabricsPage(root);
  if (pageId === "printing") setupPrintingPage(root);

  if (location.hash) {
    requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView({ block: "start" });
    });
  }
};
