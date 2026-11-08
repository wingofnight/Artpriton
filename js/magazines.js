// Файлы страниц перечислены в порядке чтения; обложка хранится отдельно.
var MAGAZINES = [
  {title:'DEAD ROAD',folder:'Мертвый вестник 1',pages:[2,3,4,5,6]},
  {title:'Маша в сказках',folder:'МертвыйВестник_2',pages:[2,3,4,5,6]},
  {title:'Аномальная школа',folder:'МертвыйВестник_3',pages:[1,2,3]},
  {title:'DEAD ROAD: новые угрозы',folder:'МертвыйВестник_4',pages:[1,2,3,4,5,6]}
];
(function(){
  'use strict';
  var shelf=document.getElementById('magazine-shelf'),dialog=document.getElementById('magazine-reader');
  var book=document.getElementById('magazine-book'),viewport=document.getElementById('magazine-viewport');
  var prev=document.getElementById('magazine-prev'),next=document.getElementById('magazine-next');
  var zoom=document.getElementById('magazine-zoom'),position=document.getElementById('magazine-position');
  var narrow=window.matchMedia('(max-width:700px)'),reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  var files=[],labels=[],current=0,opener=null,overflow='',busy=false,animation=null,zoomed=false;
  function path(issue,file){return 'assets/Jurnal/'+issue.folder+'/'+file+'.png'}
  function pageImage(src,label){var img=document.createElement('img');img.src=src;img.alt=label;img.draggable=false;return img}
  function step(){return narrow.matches?1:2}
  function visibleCount(){return current===0?1:step()}
  function destination(direction){
    if(direction>0)return current===0?1:current+step();
    return current===0?-1:Math.max(0,current-step());
  }
  function edge(slot,direction){
    var target=destination(direction);if(target<0||target>=files.length)return;
    var button=document.createElement('button');button.type='button';
    button.className='magazine-edge '+(direction>0?'edge-next':'edge-prev');
    button.setAttribute('aria-label',direction>0?'Перелистнуть вперёд':'Перелистнуть назад');
    var fold=document.createElement('span');fold.className='reader-fold';fold.setAttribute('aria-hidden','true');button.appendChild(fold);
    button.addEventListener('pointerenter',function(){if(!zoomed)slot.classList.add(direction>0?'curl-next':'curl-prev')});
    button.addEventListener('pointerleave',function(){slot.classList.remove('curl-next','curl-prev')});
    button.addEventListener('focus',function(){slot.classList.add(direction>0?'curl-next':'curl-prev')});
    button.addEventListener('blur',function(){slot.classList.remove('curl-next','curl-prev')});
    button.addEventListener('click',function(e){e.stopPropagation();turn(direction)});slot.appendChild(button);
  }
  function setZoom(value){zoomed=value;dialog.classList.toggle('is-zoomed',value);zoom.setAttribute('aria-pressed',String(value));zoom.textContent=value?'Уменьшить':'Увеличить'}
  function render(){
    book.replaceChildren();book.classList.toggle('single-page',narrow.matches||current===0);
    book.classList.toggle('cover-only',current===0);
    for(var i=0;i<visibleCount();i++){
      var slot=document.createElement('div');slot.className='magazine-page';
      if(files[current+i]){
        slot.appendChild(pageImage(files[current+i],labels[current+i]));
        slot.tabIndex=0;slot.setAttribute('aria-label',labels[current+i]);
        slot.addEventListener('click',function(e){
          if(current===0&&!zoomed)turn(1);
          else setZoom(!zoomed);
        });
        slot.addEventListener('keydown',function(e){if(e.target!==slot)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();if(current===0&&!zoomed)turn(1);else setZoom(!zoomed)}});
        if(i===0&&current>0)edge(slot,-1);
        if(i===visibleCount()-1||current+i===files.length-1)edge(slot,1);
      }else{slot.classList.add('blank');slot.setAttribute('aria-hidden','true')}
      book.appendChild(slot);
    }
    prev.disabled=current===0;next.disabled=destination(1)>=files.length;
    position.textContent=labels.slice(current,current+visibleCount()).join(' / ');
    viewport.scrollTop=0;viewport.scrollLeft=0;
    files.slice(destination(1),destination(1)+step()).forEach(function(src){var img=new Image();img.src=src});
  }
  function turn(direction){
    var target=destination(direction);if(busy||target<0||target>=files.length)return;
    setZoom(false);
    if(!narrow.matches&&!reduced.matches){
      busy=true;
      var from=current,forward=direction>0;
      // Две стороны одного листа: старая уходит до корешка,
      // затем её оборот раскрывается над прежней левой страницей.
      var outgoing=forward?(from===0?0:Math.min(from+1,files.length-1)):from;
      var incoming=forward?target:(target===0?0:target+1);
      function staticPage(index){
        var page=document.createElement('div');page.className='magazine-page turn-static';
        if(index>=0&&files[index])page.appendChild(pageImage(files[index],labels[index]));
        else page.classList.add('turn-empty');
        return page;
      }
      book.replaceChildren();book.classList.remove('single-page','cover-only');
      book.append(staticPage(forward?(from===0?-1:from):(target===0?-1:target)),
        staticPage(forward?target+1:(from===0?-1:from+1)));
      var outgoingLeaf=document.createElement('div');
      outgoingLeaf.className='magazine-turn '+(forward?'turn-next':'turn-prev');
      outgoingLeaf.appendChild(pageImage(files[outgoing],labels[outgoing]));
      var incomingLeaf=document.createElement('div');
      incomingLeaf.className='magazine-turn '+(forward?'turn-prev':'turn-next');
      incomingLeaf.appendChild(pageImage(files[incoming],labels[incoming]));
      incomingLeaf.style.visibility='hidden';book.append(outgoingLeaf,incomingLeaf);
      var first=outgoingLeaf.animate([
        {transform:'rotateY(0deg)',filter:'brightness(1)'},
        {transform:'rotateY('+(forward?'-':'')+'90deg)',filter:'brightness(.62)'}
      ],{duration:360,easing:'cubic-bezier(.45,0,.7,.45)',fill:'forwards'});
      animation=first;
      first.onfinish=function(){
        outgoingLeaf.remove();incomingLeaf.style.visibility='visible';
        var second=incomingLeaf.animate([
          {transform:'rotateY('+(forward?'':'-')+'90deg)',filter:'brightness(.62)'},
          {transform:'rotateY(0deg)',filter:'brightness(1)'}
        ],{duration:400,easing:'cubic-bezier(.2,.55,.35,1)',fill:'forwards'});
        animation=second;
        second.onfinish=function(){current=target;render();busy=false;animation=null};
      };
      return;
    }
    var oldIndex=direction>0?Math.min(current+visibleCount()-1,files.length-1):current;
    var leaf=document.createElement('div');leaf.className='magazine-turn '+(direction>0?'turn-next':'turn-prev');
    leaf.appendChild(pageImage(files[oldIndex],labels[oldIndex]));
    current=target;render();
    if(reduced.matches)return;
    busy=true;book.appendChild(leaf);
    animation=leaf.animate([{transform:'rotateY(0deg)',filter:'brightness(1)'},{transform:'rotateY('+(direction>0?'-':'')+'90deg)',filter:'brightness(.55)'}],{duration:480,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
    animation.onfinish=function(){leaf.remove();busy=false;animation=null};
  }
  MAGAZINES.forEach(function(issue,index){
    var card=document.createElement('button');card.type='button';card.className='magazine-card';
    card.setAttribute('aria-label','Читать «'+issue.title+'», выпуск '+(index+1));
    var cover=document.createElement('span');cover.className='magazine-cover';
    var peek=pageImage(path(issue,issue.pages[0]),'');peek.className='magazine-peek';peek.loading='lazy';
    var front=pageImage(path(issue,'Cover'),'');front.className='magazine-front';front.loading='lazy';
    var fold=document.createElement('span');fold.className='magazine-fold';
    cover.setAttribute('aria-hidden','true');cover.append(peek,front,fold);
    var title=document.createElement('b');title.textContent=issue.title;
    var action=document.createElement('span');action.className='magazine-action';action.textContent='Читать выпуск →';
    card.append(cover,title,action);shelf.appendChild(card);
    card.addEventListener('click',function(){
      opener=card;files=[path(issue,'Cover')].concat(issue.pages.map(function(n){return path(issue,n)}));
      labels=['Обложка'].concat(issue.pages.map(function(n){return 'Стр. '+n}));current=0;
      document.getElementById('magazine-reader-title').textContent='Мёртвый вестник №'+(index+1)+' · '+issue.title;
      setZoom(false);render();overflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
      document.getElementById('magazine-close').focus();
    });
  });
  prev.addEventListener('click',function(){turn(-1)});next.addEventListener('click',function(){turn(1)});
  zoom.addEventListener('click',function(){setZoom(!zoomed)});
  document.getElementById('magazine-close').addEventListener('click',function(){dialog.close()});
  dialog.addEventListener('close',function(){if(animation){animation.cancel();animation=null}busy=false;book.replaceChildren();document.body.style.overflow=overflow;if(opener)opener.focus()});
  dialog.addEventListener('click',function(e){if(e.target===dialog){var r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?1:-1)}});
  var touch=null;
  viewport.addEventListener('touchstart',function(e){if(!zoomed&&e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};else touch=null},{passive:true});
  viewport.addEventListener('touchend',function(e){if(!touch)return;var dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1)},{passive:true});
  narrow.addEventListener('change',function(){if(dialog.open){if(animation){animation.cancel();animation=null;busy=false}if(current>0)current=1+Math.floor((current-1)/step())*step();render()}});
})();
