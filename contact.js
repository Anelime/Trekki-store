(function(){
  "use strict";
  var form=document.getElementById('orderForm');
  if(!form) return;

  var copyToClipboard=function(value){
    if(navigator.clipboard&&window.isSecureContext){
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function(resolve,reject){
      var area=document.createElement('textarea');
      area.value=value;
      area.setAttribute('readonly','');
      area.style.position='fixed';
      area.style.left='-9999px';
      area.style.top='0';
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0,area.value.length);
      try{
        if(document.execCommand('copy')) resolve();
        else reject();
      }catch(err){
        reject(err);
      }finally{
        document.body.removeChild(area);
      }
    });
  };

  form.addEventListener('submit',function(event){
    event.preventDefault();
    var get=function(id){
      var node=document.getElementById(id);
      return node ? (node.value||'').trim() : '';
    };
    var text=[
      'Здравствуйте! Заявка с сайта Trekki Store.',
      'Имя: '+get('f-name'),
      'Контакт: '+get('f-contact'),
      'Что нужно: '+get('f-product'),
      'Тираж: '+(get('f-quantity')||'не указан'),
      'К какой дате: '+(get('f-date')||'не указано'),
      'Город доставки: '+(get('f-city')||'не указан'),
      'Логотип / макет: '+get('f-design'),
      'Комментарий: '+(get('f-msg')||'нет')
    ].join('\n');
    var openTelegram=function(){window.open('https://t.me/vkspb','_blank');};
    copyToClipboard(text).then(openTelegram).catch(openTelegram);
  });
})();
