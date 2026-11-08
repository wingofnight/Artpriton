document.documentElement.classList.add('js');
// Новые карточки добавляем до настройки фильтров, анимации и просмотра работ.
var portfolioGrid=document.querySelector('.pgrid');
NEW_PORTFOLIO.concat(CREATIVE_PORTFOLIO.map(function(key){return CREATIVE[key]})).forEach(function(work){
  var button=document.createElement('button'),image=document.createElement('img');
  button.type='button';button.className='pw rv creative-work';button.dataset.cat=work.category;
  button.dataset.cap=work.title+'. '+work.description;
  image.src=work.thumbnail||work.src;image.dataset.full=work.src;image.alt=work.title;image.loading='lazy';image.decoding='async';
  var caption=document.createElement('span'),description=document.createElement('i');
  caption.className='cap';description.textContent=work.description;
  var thumbnail=document.createElement('span');thumbnail.className='pw-thumb';thumbnail.appendChild(image);
  caption.appendChild(description);button.append(thumbnail,caption);portfolioGrid.appendChild(button);
});
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.1});
document.querySelectorAll('.rv').forEach(function(el,i){if(!el.classList.contains('pw'))el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
var nav=document.querySelector('nav'),bg=nav.querySelector('.burger');
bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
nav.querySelectorAll('ul a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');bg.setAttribute('aria-expanded','false')})});
var items=[].slice.call(document.querySelectorAll('.pw'));
var portfolio=setupPortfolio(items,portfolioGrid);
document.querySelectorAll('.filters button').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('.filters button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');
  portfolio.setFilter(b.dataset.f)})});
var lb=document.getElementById('lb'),lim=lb.querySelector('img'),lp=lb.querySelector('.lb-picture'),ln=document.getElementById('lb-notes'),lc=lb.querySelector('figcaption'),cur=0,lbWorks=[],lbOpener=null;
function vis(){return items.filter(function(p){return !p.hidden})}
function show(i){
  if(!lbWorks.length)return;
  resetLbSwipe();
  cur=(i+lbWorks.length)%lbWorks.length;var work=lbWorks[cur];
  lim.src=work.src;lim.alt=work.title;lc.textContent=work.caption;
  ln.innerHTML=work.annotations?diagramNotes(work.annotations,'zoom'):'';
  lb.querySelector('.pv').hidden=lb.querySelector('.nx').hidden=lbWorks.length<2;
}
function openWorks(works,index,opener){
  if(!works.length)return;
  lbWorks=works;lbOpener=opener;lb.hidden=false;lb.classList.toggle('can-swipe',works.length>1);document.body.style.overflow='hidden';
  show(index);lb.querySelector('.x').focus();
}
function open_(p){openWorks(vis().map(function(card){var img=card.querySelector('img');return {src:img.dataset.full||img.src,title:img.alt,caption:card.dataset.cap}}),vis().indexOf(p),p)}
function close_(){resetLbSwipe();lb.hidden=true;document.body.style.overflow='';if(lbOpener&&lbOpener.isConnected)lbOpener.focus()}
items.forEach(function(p){p.addEventListener('click',function(){open_(p)})});
lb.querySelector('.x').onclick=close_;lb.querySelector('.pv').onclick=function(){show(cur-1)};lb.querySelector('.nx').onclick=function(){show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close_()});

// Свайп в увеличенном просмотре работает и для портфолио, и для примеров услуг.
var lbGesture=null,lbSuppressClick=false,lbClickTimer;
lim.draggable=false;
function resetLbSwipe(){
  var gesture=lbGesture;lbGesture=null;
  if(gesture&&lb.hasPointerCapture(gesture.id))lb.releasePointerCapture(gesture.id);
  lb.classList.remove('is-swiping');lp.style.transform='';lp.style.opacity='';
}
lb.addEventListener('pointerdown',function(e){
  // Второй палец отменяет перелистывание, чтобы сохранить масштабирование жестом.
  if(!e.isPrimary){resetLbSwipe();return}
  if(lb.hidden||lbWorks.length<2||e.button!==0||e.target.closest('button'))return;
  lbGesture={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
});
lb.addEventListener('pointermove',function(e){
  if(!lbGesture||lbGesture.id!==e.pointerId)return;
  var dx=e.clientX-lbGesture.x,dy=e.clientY-lbGesture.y;
  if(!lbGesture.moved&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.2){
    lbGesture.moved=true;lb.classList.add('is-swiping');lb.setPointerCapture(e.pointerId);
  }
  if(lbGesture.moved){
    e.preventDefault();lp.style.transform='translateX('+Math.max(-150,Math.min(150,dx*.5))+'px)';
    lp.style.opacity=Math.max(.65,1-Math.abs(dx)/1200);
  }
});
function finishLbSwipe(e){
  if(!lbGesture||lbGesture.id!==e.pointerId)return;
  var gesture=lbGesture,dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
  var threshold=Math.max(40,Math.min(90,lim.clientWidth*.12));
  resetLbSwipe();
  if(gesture.moved){
    // Не закрываем окно кликом, который браузер может отправить после перетаскивания.
    lbSuppressClick=true;clearTimeout(lbClickTimer);
    lbClickTimer=setTimeout(function(){lbSuppressClick=false},250);
    if(e.type==='pointerup'&&Math.abs(dx)>=threshold&&Math.abs(dx)>Math.abs(dy)*1.2)show(cur+(dx<0?1:-1));
  }
}
lb.addEventListener('pointerup',finishLbSwipe);
lb.addEventListener('pointercancel',finishLbSwipe);
lb.addEventListener('lostpointercapture',function(e){
  // При передаче захвата от изображения к окну touch тоже отправляет это событие.
  if(e.target===lb&&!lb.hasPointerCapture(e.pointerId))finishLbSwipe(e);
});
lb.addEventListener('click',function(e){
  if(lbSuppressClick&&!e.target.closest('button')){e.preventDefault();e.stopImmediatePropagation();lbSuppressClick=false}
},true);
document.addEventListener('keydown',function(e){
  if(lb.hidden)return;
  if(e.key==='Escape'){e.preventDefault();close_()}
  if(e.key==='ArrowLeft'){e.preventDefault();show(cur-1)}
  if(e.key==='ArrowRight'){e.preventDefault();show(cur+1)}
  if(e.key==='Tab'){
    var controls=[].slice.call(lb.querySelectorAll('button')).filter(function(b){return !b.hidden}),first=controls[0],last=controls[controls.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});
// Ответ сервиса проверяем до сообщения об успешной отправке.
document.getElementById('f').addEventListener('submit',async function(ev){
  ev.preventDefault();
  var f=ev.target,st=document.getElementById('st');
  if(f.dataset.sending==='true')return;
  var fields=f.elements,name=fields.namedItem('name'),contact=fields.namedItem('contact');
  if(!name.value.trim()||!contact.value.trim()){
    ev.preventDefault();
    st.textContent='Заполните имя и контакт, чтобы мы могли ответить.';
    (!name.value.trim()?name:contact).focus();return;
  }
  name.value=name.value.trim();contact.value=contact.value.trim();
  if(window.location.protocol==='file:'){
    st.textContent='Отправка недоступна при открытии HTML-файла напрямую. Откройте сайт через Live Server в редакторе или по адресу опубликованного сайта. Можно также написать нам по контактам справа.';return;
  }
  var button=f.querySelector('[type="submit"]'),controller=new AbortController();
  var timeout=setTimeout(function(){controller.abort()},20000);
  f.dataset.sending='true';button.disabled=true;f.setAttribute('aria-busy','true');
  st.textContent='Отправляем заявку…';
  try{
    var response=await fetch('https://formsubmit.co/ajax/levkoshkins@yandex.com',{
      method:'POST',headers:{Accept:'application/json'},body:new FormData(f),signal:controller.signal
    });
    var result=await response.json();
    if(!response.ok||(result.success!==true&&result.success!=='true'))throw new Error('Service rejected submission');
    st.textContent='Сервис принял заявку. Спасибо! Если почта ещё не активирована, владельцу сайта нужно подтвердить адрес в письме от FormSubmit.';
    f.reset();
  }catch(error){
    st.textContent=error.name==='AbortError'?'Сервис не ответил за 20 секунд. Доставка не подтверждена. Попробуйте позже или напишите нам по контактам справа.':'Не удалось подтвердить отправку. Проверьте подключение или напишите нам по контактам справа. Введённые данные сохранены.';
  }finally{
    clearTimeout(timeout);f.dataset.sending='false';button.disabled=false;f.removeAttribute('aria-busy');
  }
});

// Один активный раздел услуги; переключение через верхнее меню категорий.
function escapeHTML(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var root=document.getElementById('svroot'),gamePlayer=setupGamePlayer(GAMES);
// Подписи и стрелки остаются отдельным слоем поверх иллюстрации.
function diagramNotes(annotations,key){
  var marker='diagram-arrow-'+key;
  return '<span class="diagram-notes" aria-hidden="true"><svg class="diagram-arrows" viewBox="0 0 1000 666.667" fill="none"><defs><marker id="'+marker+'" viewBox="0 0 18 18" refX="15" refY="9" markerWidth="18" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto"><path d="M 3 2 Q 9 7 15 9 Q 9 10 3 16"/></marker></defs>'+annotations.map(function(note){return '<path d="'+note.path+'" marker-end="url(#'+marker+')"/>'}).join('')+'</svg>'+annotations.map(function(note){return '<span class="diagram-label" style="left:'+note.x+'%;top:'+note.y+'%;--tilt:'+note.angle+'deg"><b>'+escapeHTML(note.title)+'</b><small>'+escapeHTML(note.text)+'</small></span>'}).join('')+'</span>';
}
function build(){
  root.innerHTML=SERVICES.map(function(service,index){
    if(service.id==='library')return '<article id="service-library" class="service-showcase service-library" data-service="library" role="tabpanel" aria-labelledby="service-tab-library" tabindex="0" hidden></article>';
    var heading=escapeHTML(service.name);
    var visual=service.id==='games'?gameCardsMarkup(GAMES):'<button class="service-visual" type="button" aria-label="Увеличить схему: '+heading+'"><img src="'+escapeHTML(service.image)+'" alt="'+escapeHTML(service.alt)+'" width="1536" height="1024" loading="lazy" decoding="async">'+(service.annotations?diagramNotes(service.annotations,service.id):'')+'</button>';
    return '<article id="service-'+service.id+'" class="service-showcase'+(service.id==='games'?' service-games':'')+'" data-service="'+service.id+'" role="tabpanel" aria-labelledby="service-tab-'+service.id+'" tabindex="0"'+(index?' hidden':'')+'><div class="service-layout wrap"><div class="service-copy"><div class="service-heading"><h2>'+heading+'</h2><p>'+escapeHTML(service.description)+'</p></div></div><div class="service-media">'+visual+'</div><div class="service-footer"><p class="service-note">'+escapeHTML(service.note)+'</p><div class="service-actions"><a class="btn main" href="#zakaz">'+(service.id==='games'?'Обсудить игру':'Заказать')+'</a><a class="btn" href="#raboty" data-examples="'+service.id+'">Смотреть работы</a></div></div></div></article>';
  }).join('');
}
root.addEventListener('click',function(event){
  var cartridge=event.target.closest('[data-game]');
  if(cartridge){gamePlayer.open(cartridge.dataset.game,cartridge);return}
  var article=event.target.closest('[data-service]');if(!article)return;
  var service=SERVICES.find(function(entry){return entry.id===article.dataset.service});
  var visual=event.target.closest('.service-visual');
  if(visual){
    var scenes=SERVICES.filter(function(entry){return entry.image});
    openWorks(scenes.map(function(entry){return {src:entry.image,title:entry.alt,caption:entry.description,annotations:entry.annotations}}),scenes.indexOf(service),visual);
  }
  if(event.target.closest('[data-examples]')){
    var filter=document.querySelector('[data-f="'+(service.filter||'all')+'"]');if(filter)filter.click();
  }
});
var its=[].slice.call(document.querySelectorAll('.it'));
var serviceNavigation=document.querySelector('.service-nav');
var serviceStrip=serviceNavigation.querySelector('.strip'),desktopServiceNavigation=window.matchMedia('(min-width:821px)');
function updateServiceNavigationOffset(){
  if(desktopServiceNavigation.matches){
    serviceNavigation.classList.remove('is-pinned');
    serviceNavigation.style.setProperty('--service-expanded-height',serviceStrip.offsetHeight+'px');
  }else serviceNavigation.style.removeProperty('--service-expanded-height');
  updateServicePin();
}
function updateServicePin(){
  var pinned=serviceNavigation.parentElement.getBoundingClientRect().top<=nav.offsetHeight+1;
  serviceNavigation.classList.toggle('is-pinned',pinned);
  var height=desktopServiceNavigation.matches&&pinned?serviceStrip.offsetHeight:serviceNavigation.offsetHeight;
  document.documentElement.style.setProperty('--service-nav-height',height+'px');
}
function serviceScrollOffset(){
  var height=desktopServiceNavigation.matches?parseFloat(getComputedStyle(serviceNavigation).getPropertyValue('--service-compact-height')):serviceNavigation.offsetHeight;
  return nav.offsetHeight+height+16;
}
new ResizeObserver(updateServiceNavigationOffset).observe(serviceNavigation);
updateServiceNavigationOffset();
build();
root.querySelector('#service-library').appendChild(document.getElementById('media'));
setupGameCarousel(root);
var serviceSections=[].slice.call(root.querySelectorAll('[data-service]')),activeService=-1;
function selectService(index){
  if(activeService===index)return;activeService=index;
  serviceSections.forEach(function(section,i){section.hidden=i!==index});
  its.forEach(function(link,i){link.classList.toggle('on',i===index);link.setAttribute('aria-selected',i===index?'true':'false');link.tabIndex=i===index?0:-1});
  updateServiceNavigationOffset();
}
function serviceFromHash(){
  var index=SERVICES.findIndex(function(service){return location.hash==='#service-'+service.id});
  if(index>=0){
    selectService(index);
    requestAnimationFrame(function(){updateServiceNavigationOffset();scrollToService(index,'instant')});
  }
}
function scrollToService(index,behavior){
  var top=serviceSections[index].getBoundingClientRect().top+window.scrollY-serviceScrollOffset();
  window.scrollTo({top:Math.max(0,top),behavior:behavior||(window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth')});
}
its.forEach(function(link,index){
  link.id='service-tab-'+SERVICES[index].id;link.setAttribute('role','tab');link.setAttribute('aria-controls','service-'+SERVICES[index].id);
  link.setAttribute('aria-label',SERVICES[index].name);link.title=SERVICES[index].name;
  link.addEventListener('click',function(event){
    event.preventDefault();selectService(index);history.replaceState(null,'',link.getAttribute('href'));
    scrollToService(index);
  });
  link.addEventListener('keydown',function(event){
    var next=index;
    if(event.key==='ArrowRight')next=(index+1)%its.length;
    else if(event.key==='ArrowLeft')next=(index-1+its.length)%its.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=its.length-1;
    else return;
    event.preventDefault();its[next].click();its[next].focus({preventScroll:true});
  });
});
selectService(0);serviceFromHash();window.addEventListener('hashchange',serviceFromHash);
window.addEventListener('load',serviceFromHash);
window.addEventListener('resize',updateServiceNavigationOffset);
document.fonts.ready.then(updateServiceNavigationOffset);
var servicePinFrame;
window.addEventListener('scroll',function(){
  if(servicePinFrame)return;
  servicePinFrame=requestAnimationFrame(function(){servicePinFrame=null;updateServicePin()});
},{passive:true});
// Пустые категории портфолио скрыты, пока в них нет работ
document.querySelectorAll('.filters button').forEach(function(b){if(b.dataset.f!=='all'&&!items.some(function(p){return p.dataset.cat===b.dataset.f}))b.hidden=true});
// Коллекция видео и музыки настраивается в media.js.
