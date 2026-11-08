// Альбом работ: шесть карточек на компьютере, одна на телефоне.
function setupPortfolio(cards, track) {
  var mobile=window.matchMedia('(max-width:820px)'),reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
  var album=document.createElement('div'),viewport=document.createElement('div'),tools=document.createElement('div');
  album.className='portfolio-album';viewport.className='portfolio-viewport';viewport.id='portfolio-viewport';
  viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label','Альбом наших работ');
  viewport.setAttribute('aria-roledescription','карусель');viewport.setAttribute('aria-describedby','portfolio-hint');
  track.parentNode.insertBefore(album,track);album.appendChild(viewport);viewport.appendChild(track);
  track.classList.add('portfolio-track');
  var previous=document.createElement('button'),next=document.createElement('button');
  [previous,next].forEach(function(button){button.type='button';button.className='portfolio-arrow';button.setAttribute('aria-controls',viewport.id)});
  previous.classList.add('portfolio-prev');previous.setAttribute('aria-label','Предыдущая страница работ');previous.textContent='‹';
  next.classList.add('portfolio-next');next.setAttribute('aria-label','Следующая страница работ');next.textContent='›';
  album.append(previous,next);
  tools.className='portfolio-tools';
  tools.innerHTML='<div class="portfolio-meta"><span id="portfolio-hint"></span><span class="portfolio-status" role="status" aria-live="polite" aria-atomic="true"></span></div><input class="portfolio-slider" type="range" min="0" max="0" value="0" step="1" aria-label="Страница портфолио" aria-controls="portfolio-viewport">';
  album.after(tools);
  var slider=tools.querySelector('input'),status=tools.querySelector('.portfolio-status'),hint=tools.querySelector('#portfolio-hint');
  var selected=cards.slice(),pages=[],page=0,perPage=mobile.matches?1:6,drag=null,suppressClick=false,clickTimer,scrollTick;
  cards.forEach(function(card){card.classList.add('in');card.querySelector('img').draggable=false});

  function nearestPage(){
    var closest=0,distance=Infinity;
    pages.forEach(function(group,index){var delta=Math.abs(group.offsetLeft-viewport.scrollLeft);if(delta<distance){distance=delta;closest=index}});
    return closest;
  }
  function update(index){
    page=Math.max(0,Math.min(pages.length-1,index));
    slider.max=Math.max(0,pages.length-1);slider.value=page;slider.disabled=pages.length<2;
    previous.disabled=page===0;next.disabled=page>=pages.length-1;
    slider.style.setProperty('--progress',(pages.length>1?page/(pages.length-1)*100:0)+'%');
    var first=page*perPage+1,last=Math.min((page+1)*perPage,selected.length);
    var label='Страница '+(page+1)+' из '+pages.length+'. Работы '+first+'–'+last+' из '+selected.length;
    slider.setAttribute('aria-valuetext',label);
    var counter=(page+1)+' / '+pages.length;
    if(status.textContent!==counter)status.textContent=counter;
  }
  function go(index,smooth){
    update(index);
    viewport.scrollTo({left:pages[page].offsetLeft,behavior:smooth&&!reducedMotion.matches?'smooth':'auto'});
  }
  function rebuild(firstWork){
    perPage=mobile.matches?1:6;pages=[];
    // Перемещаем существующие кнопки: просмотр по клику и подписи остаются с ними.
    cards.forEach(function(card){card.remove()});track.replaceChildren();
    for(var i=0;i<selected.length;i+=perPage){
      var group=document.createElement('div');group.className='portfolio-page';
      group.setAttribute('role','group');group.setAttribute('aria-roledescription','страница');
      selected.slice(i,i+perPage).forEach(function(card){group.appendChild(card)});
      track.appendChild(group);pages.push(group);
    }
    pages.forEach(function(group,index){group.setAttribute('aria-label',(index+1)+' из '+pages.length)});
    hint.textContent=mobile.matches?'Листайте свайпом':'Перетащите, чтобы листать';
    go(Math.floor(Math.max(0,selected.indexOf(firstWork))/perPage),false);
  }
  previous.addEventListener('click',function(){go(page-1,true)});
  next.addEventListener('click',function(){go(page+1,true)});
  slider.addEventListener('input',function(){go(+slider.value,false)});
  viewport.addEventListener('scroll',function(){
    if(scrollTick)return;
    scrollTick=requestAnimationFrame(function(){scrollTick=null;update(nearestPage())});
  },{passive:true});
  viewport.addEventListener('keydown',function(event){
    if(!document.getElementById('lb').hidden)return;
    var target;
    if(event.key==='ArrowLeft')target=page-1;
    if(event.key==='ArrowRight')target=page+1;
    if(event.key==='Home')target=0;
    if(event.key==='End')target=pages.length-1;
    if(target!==undefined){event.preventDefault();go(target,true)}
  });
  viewport.addEventListener('focusin',function(event){
    var group=event.target.closest('.portfolio-page');
    if(group&&pages.indexOf(group)!==page)go(pages.indexOf(group),false);
  });
  viewport.addEventListener('pointerdown',function(event){
    // На телефоне оставляем браузеру нативный свайп и вертикальную прокрутку.
    if(event.pointerType==='touch'||event.button!==0||pages.length<2)return;
    viewport.scrollTo({left:viewport.scrollLeft,behavior:'auto'});
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,moved:false};
  });
  viewport.addEventListener('pointermove',function(event){
    if(!drag||drag.id!==event.pointerId)return;
    var dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){
      drag.moved=true;viewport.classList.add('is-dragging');viewport.setPointerCapture(event.pointerId);
    }
    if(drag.moved){event.preventDefault();viewport.scrollLeft=drag.left-dx}
  });
  function finishDrag(event){
    if(!drag||drag.id!==event.pointerId)return;
    var moved=drag.moved;drag=null;viewport.classList.remove('is-dragging');
    if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
    if(moved){
      suppressClick=true;clearTimeout(clickTimer);clickTimer=setTimeout(function(){suppressClick=false},250);
      go(nearestPage(),true);
    }
  }
  viewport.addEventListener('pointerup',finishDrag);
  viewport.addEventListener('pointercancel',finishDrag);
  viewport.addEventListener('lostpointercapture',finishDrag);
  viewport.addEventListener('pointerleave',function(event){if(drag&&!drag.moved)finishDrag(event)});
  viewport.addEventListener('click',function(event){
    if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false}
  },true);
  mobile.addEventListener('change',function(){rebuild(selected[page*perPage])});
  new ResizeObserver(function(){if(!drag&&pages.length)go(page,false)}).observe(viewport);
  rebuild(selected[0]);
  return {setFilter:function(category){
    selected=cards.filter(function(card){card.hidden=!(category==='all'||card.dataset.cat===category);return !card.hidden});
    rebuild(selected[0]);
  }};
}
