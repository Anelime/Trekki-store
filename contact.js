(function(){
  "use strict";

  var form=document.getElementById("orderForm");
  if(!form) return;

  var telegramUrl="https://t.me/vkspb";
  var submit=form.querySelector('button[type="submit"]');

  var status=document.createElement("p");
  status.className="form-status";
  status.setAttribute("role","status");
  status.setAttribute("aria-live","polite");
  status.hidden=true;

  var fallback=document.createElement("div");
  fallback.className="form-fallback";
  fallback.hidden=true;
  fallback.innerHTML=[
    "<p>Если текст не появился в Telegram автоматически, скопируйте заявку ещё раз и вставьте её в чат.</p>",
    '<textarea readonly rows="7" aria-label="Текст заявки для отправки в Telegram"></textarea>',
    '<div class="fallback-actions">',
    '<button type="button" class="copy-again">Скопировать ещё раз</button>',
    '<a class="telegram-link" href="'+telegramUrl+'" target="_blank" rel="noopener">Открыть Telegram</a>',
    "</div>"
  ].join("");

  form.appendChild(status);
  form.appendChild(fallback);

  var fallbackText=fallback.querySelector("textarea");
  var copyAgain=fallback.querySelector(".copy-again");

  var get=function(id){
    var node=document.getElementById(id);
    return node ? (node.value||"").trim() : "";
  };

  var setStatus=function(message,type){
    status.hidden=false;
    status.textContent=message;
    status.classList.toggle("is-success",type==="success");
    status.classList.toggle("is-error",type==="error");
  };

  var buildText=function(){
    var lines=[
      "Здравствуйте! Заявка с сайта Trekki Store.",
      "Имя: "+get("f-name"),
      "Контакт: "+get("f-contact"),
      "Что нужно: "+get("f-product"),
      "Тираж: "+(get("f-quantity")||"не указан"),
      "К какой дате: "+(get("f-date")||"не указано"),
      "Город доставки: "+(get("f-city")||"не указан"),
      "Логотип / макет: "+(get("f-design")||"не указано")
    ];
    if(get("f-brief-summary")){
      lines.push("Выбор в конструкторе: "+get("f-brief-summary"));
    }
    lines.push("Комментарий: "+(get("f-msg")||"нет"));
    return lines.join("\n");
  };

  var copyToClipboard=function(value){
    if(navigator.clipboard&&window.isSecureContext){
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function(resolve,reject){
      var area=document.createElement("textarea");
      area.value=value;
      area.setAttribute("readonly","");
      area.style.position="fixed";
      area.style.left="-9999px";
      area.style.top="0";
      document.body.appendChild(area);
      area.focus();
      area.select();
      area.setSelectionRange(0,area.value.length);
      try{
        if(document.execCommand("copy")) resolve();
        else reject(new Error("copy command failed"));
      }catch(err){
        reject(err);
      }finally{
        document.body.removeChild(area);
      }
    });
  };

  copyAgain.addEventListener("click",function(){
    copyToClipboard(fallbackText.value).then(function(){
      setStatus("Текст заявки скопирован ещё раз. Откройте Telegram и вставьте его в чат @vkspb.","success");
    }).catch(function(){
      fallbackText.focus();
      fallbackText.select();
      setStatus("Не получилось скопировать автоматически. Выделите текст заявки ниже и скопируйте вручную.","error");
    });
  });

  form.addEventListener("submit",function(event){
    event.preventDefault();

    var text=buildText();
    var defaultLabel=submit ? submit.innerHTML : "";
    var telegramWindow=null;

    fallbackText.value=text;
    fallback.hidden=false;
    setStatus("Копируем заявку и открываем Telegram...","success");

    if(submit){
      submit.disabled=true;
      submit.innerHTML="Копируем заявку...";
    }

    try{
      telegramWindow=window.open(telegramUrl,"_blank","noopener");
    }catch(err){
      telegramWindow=null;
    }

    copyToClipboard(text).then(function(){
      if(telegramWindow){
        setStatus("Заявка скопирована. Telegram открыт в новой вкладке — вставьте текст и отправьте его @vkspb.","success");
      }else{
        setStatus("Заявка скопирована. Нажмите «Открыть Telegram», вставьте текст и отправьте его @vkspb.","success");
      }
    }).catch(function(){
      fallbackText.focus();
      fallbackText.select();
      if(telegramWindow){
        setStatus("Telegram открыт, но скопировать текст автоматически не получилось. Скопируйте заявку ниже вручную.","error");
      }else{
        setStatus("Не получилось открыть Telegram и скопировать текст автоматически. Скопируйте заявку ниже и откройте Telegram вручную.","error");
      }
    }).finally(function(){
      if(submit){
        submit.disabled=false;
        submit.innerHTML=defaultLabel;
      }
    });
  });
})();
