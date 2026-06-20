(function(){
  "use strict";

  var contactHtml=[
    '<section class="section contact" id="contact">',
    '  <div class="wrap contact-grid">',
    '    <div>',
    '      <span class="eyebrow on-dark">Связаться</span>',
    '      <h2 class="section-title display">Посчитаем<br>ваш заказ</h2>',
    '      <p class="lead">Напишите или позвоните — поможем выбрать ткань, способ для принта, размерную сетку и реалистичный формат тиража.</p>',
    '      <div class="contact-methods">',
    '        <a href="https://t.me/vkspb" target="_blank" rel="noopener" class="cm">',
    '          <span class="cm-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8.1 2.1l4.7 1.4 1.8 5.6c.3 1 1.6 1.2 2.2.4l2.7-3.4 4.9 3.6c.8.6 1.9.1 2.1-.9l2.7-14.7c.2-1-.8-1.7-1.7-1.3Z"/><path d="m7.7 14.1 8.8-5.4-6.8 7.2"/></svg></span>',
    '          <span><small>Telegram — быстрее всего</small><b>@vkspb</b></span>',
    '        </a>',
    '        <a href="tel:+79219526410" class="cm">',
    '          <span class="cm-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg></span>',
    '          <span><small>Телефон</small><b>+7 921 952 64 10</b></span>',
    '        </a>',
    '        <a href="mailto:mail@vkspb.info" class="cm">',
    '          <span class="cm-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg></span>',
    '          <span><small>Почта</small><b>mail@vkspb.info</b></span>',
    '        </a>',
    '      </div>',
    '      <div class="contact-tag">Доставка по России и СНГ · СДЭК по договорённости · Тираж от 5 штук</div>',
    '    </div>',
    '    <form id="orderForm">',
    '      <input type="hidden" id="f-brief-summary" name="brief" value="">',
    '      <div class="fld">',
    '        <label for="f-name">Как к вам обращаться</label>',
    '        <input id="f-name" name="name" type="text" placeholder="Имя" autocomplete="name" required>',
    '      </div>',
    '      <div class="fld">',
    '        <label for="f-contact">Телефон или email</label>',
    '        <input id="f-contact" name="contact" type="text" placeholder="+7 ... или mail@..." autocomplete="email" required>',
    '      </div>',
    '      <div class="fld">',
    '        <label for="f-product">Что нужно</label>',
    '        <select id="f-product" name="product" required>',
    '          <option value="">Выберите вариант</option>',
    '          <option>Лонгсливы</option>',
    '          <option>Футболки</option>',
    '          <option>Бафы</option>',
    '          <option>Комплект формы</option>',
    '          <option>Подбор ткани / материала</option>',
    '          <option>Принт / логотипы на изделие</option>',
    '          <option>Размеры / посадка</option>',
    '          <option>Готовые принты, медали или мерч</option>',
    '          <option>Другое / пока не знаю</option>',
    '        </select>',
    '      </div>',
    '      <div class="form-row">',
    '        <div class="fld">',
    '          <label for="f-quantity">Тираж</label>',
    '          <input id="f-quantity" name="quantity" type="text" placeholder="Например: 15 или 20-30">',
    '        </div>',
    '        <div class="fld">',
    '          <label for="f-date">К какой дате</label>',
    '          <input id="f-date" name="date" type="text" placeholder="Например: к 15 мая">',
    '        </div>',
    '      </div>',
    '      <div class="form-row">',
    '        <div class="fld">',
    '          <label for="f-city">Город доставки</label>',
    '          <input id="f-city" name="city" type="text" placeholder="Санкт-Петербург" autocomplete="address-level2">',
    '        </div>',
    '        <div class="fld">',
    '          <label for="f-design">Логотип или макет</label>',
    '          <select id="f-design" name="design">',
    '            <option>Логотип / макет есть</option>',
    '            <option>Есть идея, макета нет</option>',
    '            <option>Нужна помощь с макетом</option>',
    '            <option>Пока не знаю</option>',
    '          </select>',
    '        </div>',
    '      </div>',
    '      <div class="fld">',
    '        <label for="f-msg">Комментарий</label>',
    '        <textarea id="f-msg" name="msg" placeholder="Например: для бегового клуба, нужна лёгкая ткань, хочется принт с маршрутом и логотипом команды"></textarea>',
    '      </div>',
    '      <button type="submit" class="btn btn-light" data-form-submit>Отправить в Telegram <span class="arr">→</span></button>',
    '      <p class="hint">Кнопка скопирует текст заявки и откроет Telegram @vkspb — останется вставить текст и нажать «отправить». Можно и позвонить: <a href="tel:+79219526410" style="color:var(--accent)">+7 921 952 64 10</a>.</p>',
    '    </form>',
    '  </div>',
    '</section>'
  ].join("");

  var footerHtml=[
    '<footer>',
    '  <div class="wrap">',
    '    <div class="foot-top">',
    '      <div class="foot-brand">',
    '        <div class="wordmark"><strong>TREKKI</strong><span>store</span></div>',
    '        <p>Кастомная спортивная форма и мерч под ваш бренд. Рождено в горах, протестировано на высоте.</p>',
    '      </div>',
    '      <div class="foot-nav">',
    '        <div class="foot-col">',
    '          <h4>Разделы</h4>',
    '          <a href="index.html#products">Что шьём</a>',
    '          <a href="fabrics.html">Ткани</a>',
    '          <a href="printing.html">Принты</a>',
    '          <a href="sizes.html">Размеры</a>',
    '          <a href="longsleeves.html">Лонгсливы</a>',
    '          <a href="tshirts.html">Футболки</a>',
    '          <a href="buffs.html">Бафы</a>',
    '          <a href="future-items.html">Готовый мерч</a>',
    '          <a href="index.html#smart-brief">Умный бриф</a>',
    '          <a href="index.html#process">Как заказать</a>',
    '        </div>',
    '        <div class="foot-col">',
    '          <h4>Контакты</h4>',
    '          <a href="https://t.me/vkspb" target="_blank" rel="noopener">Telegram @vkspb</a>',
    '          <a href="tel:+79219526410">+7 921 952 64 10</a>',
    '          <a href="mailto:mail@vkspb.info">mail@vkspb.info</a>',
    '          <span>Логотипы и макеты можно прислать в Telegram</span>',
    '          <span>Доставка по России и СНГ</span>',
    '          <span>Тираж от 5 штук</span>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <div class="foot-bot">',
    '      <span>© 2026 Trekki Store. «Trekki» — зарегистрированный товарный знак.</span>',
    '      <span>Спортивная форма · мерч · аксессуары</span>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join("");

  document.querySelectorAll('[data-component="contact"]').forEach(function(target){
    target.outerHTML=contactHtml;
  });

  document.querySelectorAll('[data-component="footer"]').forEach(function(target){
    target.outerHTML=footerHtml;
  });

  var form=document.getElementById("orderForm");
  var product=document.getElementById("f-product");
  var message=document.getElementById("f-msg");
  var submit=document.querySelector("[data-form-submit]");

  var setProduct=function(value){
    if(!product||!value) return;
    var found=Array.prototype.slice.call(product.options).some(function(option){
      if(option.text===value||option.value===value){
        product.value=option.value;
        return true;
      }
      return false;
    });
    if(!found){
      var option=document.createElement("option");
      option.text=value;
      option.value=value;
      product.add(option);
      product.value=value;
    }
  };

  var setCommentContext=function(label,value){
    if(!message||!value) return;
    var prefix=label ? label+": " : "";
    var line=prefix+value;
    var lines=message.value.split("\n").filter(function(item){
      return item.trim()&&(!prefix||item.indexOf(prefix)!==0);
    });
    lines.unshift(line);
    message.value=lines.join("\n");
  };

  var setSubmitLabel=function(value){
    if(!submit||!value) return;
    submit.innerHTML="";
    submit.appendChild(document.createTextNode(value+" "));
    var arrow=document.createElement("span");
    arrow.className="arr";
    arrow.textContent="→";
    submit.appendChild(arrow);
  };

  window.TrekkiForm={
    setProduct:setProduct,
    setCommentContext:setCommentContext,
    setSubmitLabel:setSubmitLabel
  };

  if(form){
    setProduct(document.body.getAttribute("data-form-product"));
    setCommentContext(
      document.body.getAttribute("data-form-context-label")||"Контекст страницы",
      document.body.getAttribute("data-form-comment")
    );
    setSubmitLabel(document.body.getAttribute("data-form-cta"));
  }

  if(location.hash){
    var target=document.getElementById(location.hash.slice(1));
    if(target){
      requestAnimationFrame(function(){target.scrollIntoView({block:"start"});});
    }
  }
})();
