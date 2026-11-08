function gameCardsMarkup(games){
  return '<div class="games-carousel" role="region" aria-label="Картриджи с играми"><div class="games-shelf">'+games.map(function(game,index){
    return '<button class="game-cartridge theme-'+game.theme+'" type="button" data-game="'+escapeHTML(game.id)+'" aria-label="Открыть: '+escapeHTML(game.title)+'">'+
      '<span class="cartridge-top" aria-hidden="true">АРТПРИТОН · 16 BIT</span><span class="cartridge-ridges" aria-hidden="true"></span>'+
      '<span class="cartridge-label"><img src="'+escapeHTML(game.cover)+'" alt="" loading="lazy" decoding="async"><span class="cartridge-title">'+escapeHTML(game.title)+'</span></span>'+
      '<span class="cartridge-bottom"><span>0'+(index+1)+'</span><b>'+(game.url?'Играть ↗':'Скоро')+'</b></span><span class="cartridge-slot" aria-hidden="true"></span></button>';
  }).join('')+'</div><div class="games-carousel-controls"><button type="button" data-game-step="-1" aria-label="Предыдущий картридж">‹</button><div class="games-carousel-dots">'+games.map(function(game,index){return '<button type="button" data-game-slide="'+index+'" aria-label="Картридж '+(index+1)+': '+escapeHTML(game.title)+'" aria-current="'+(index===0?'true':'false')+'"></button>'}).join('')+'</div><button type="button" data-game-step="1" aria-label="Следующий картридж">›</button></div></div>';
}

function setupGameCarousel(root){
  var carousel=root.querySelector('.games-carousel');if(!carousel)return;
  var shelf=carousel.querySelector('.games-shelf'),cards=Array.from(shelf.children);
  var dots=Array.from(carousel.querySelectorAll('[data-game-slide]')),current=0;
  function update(){
    var center=shelf.getBoundingClientRect().left+shelf.clientWidth/2;
    var distance=Infinity;
    cards.forEach(function(card,index){var rect=card.getBoundingClientRect(),delta=Math.abs(rect.left+rect.width/2-center);if(delta<distance){distance=delta;current=index}});
    dots.forEach(function(dot,index){dot.setAttribute('aria-current',index===current?'true':'false')});
    carousel.querySelector('[data-game-step="-1"]').disabled=current===0;
    carousel.querySelector('[data-game-step="1"]').disabled=current===cards.length-1;
  }
  function go(index){
    index=Math.max(0,Math.min(cards.length-1,index));
    var rect=cards[index].getBoundingClientRect(),bounds=shelf.getBoundingClientRect();
    shelf.scrollTo({left:shelf.scrollLeft+rect.left+rect.width/2-bounds.left-shelf.clientWidth/2,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  }
  carousel.addEventListener('click',function(event){
    var step=event.target.closest('[data-game-step]'),dot=event.target.closest('[data-game-slide]');
    if(step)go(current+Number(step.dataset.gameStep));
    if(dot)go(Number(dot.dataset.gameSlide));
  });
  shelf.addEventListener('scroll',update,{passive:true});
  new ResizeObserver(function(){if(shelf.clientWidth)update()}).observe(shelf);
}

function setupGamePlayer(games){
  var dialog=document.getElementById('game-tv'),frame=document.getElementById('tv-frame');
  var title=document.getElementById('tv-title'),message=document.getElementById('tv-message');
  var messageTitle=document.getElementById('tv-message-title'),messageText=document.getElementById('tv-message-text');
  var power=document.getElementById('tv-power'),help=document.getElementById('tv-help'),helpList=document.getElementById('tv-help-list');
  var helpButton=document.getElementById('tv-help-button'),closeButton=document.getElementById('tv-close');
  var resumeButton=document.getElementById('tv-resume'),activeGame=null,activeURL=null,opener=null,previousOverflow='',request=null,session=0;

  function note(heading,text,state){
    messageTitle.textContent=heading;messageText.textContent=text;message.hidden=false;power.textContent=state;
  }
  function notify(type){
    if(activeURL&&frame.getAttribute('src'))frame.contentWindow.postMessage({type:'artpritone:game:'+type},activeURL.origin==='null'?'*':activeURL.origin);
  }
  function setHelp(visible){
    help.hidden=!visible;helpButton.setAttribute('aria-expanded',visible);
    if(visible){notify('pause');resumeButton.focus()}
    else{notify('resume');frame.focus()}
  }
  function cleanup(){
    session++;if(request){request.abort();request=null}
    frame.removeAttribute('src');frame.hidden=true;help.hidden=true;helpButton.setAttribute('aria-expanded','false');
    activeGame=null;activeURL=null;document.body.style.overflow=previousOverflow;
    if(opener&&opener.isConnected)opener.focus();
  }
  frame.addEventListener('load',function(){
    if(dialog.open&&activeURL&&frame.src===activeURL.href){
      message.hidden=true;power.textContent='СИГНАЛ ЕСТЬ';
      if(help.hidden)frame.focus();else notify('pause');
    }
  });
  frame.addEventListener('error',function(){
    if(dialog.open){frame.hidden=true;note('Не удалось запустить игру','Попробуйте ещё раз чуть позже.','НЕТ СИГНАЛА')}
  });
  helpButton.addEventListener('click',function(){setHelp(help.hidden)});
  resumeButton.addEventListener('click',function(){setHelp(false)});
  closeButton.addEventListener('click',function(){dialog.close()});
  document.getElementById('tv-power-button').addEventListener('click',function(){dialog.close()});
  dialog.addEventListener('close',cleanup);
  dialog.addEventListener('keydown',function(event){
    if(event.key!=='Escape')return;
    event.preventDefault();
    if(!help.hidden)setHelp(false);else dialog.close();
  });
  dialog.addEventListener('cancel',function(event){if(!help.hidden){event.preventDefault();setHelp(false)}});
  dialog.addEventListener('click',function(event){
    if(event.target!==dialog)return;
    var bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();
  });
  return {open:function(id,button){
    var game=games.find(function(entry){return entry.id===id});if(!game)return;
    if(dialog.open)return;
    if(!lb.hidden)close_();
    activeGame=game;activeURL=null;opener=button;previousOverflow=document.body.style.overflow;
    title.textContent=game.title;frame.title=game.title;frame.hidden=true;frame.removeAttribute('src');
    help.hidden=true;helpButton.setAttribute('aria-expanded','false');helpList.replaceChildren();
    var instructions=Array.isArray(game.instructions)&&game.instructions.length?game.instructions:[
      'Правила и управление появятся здесь вместе с игрой.',
      'Нажмите «Закрыть», чтобы вернуться к картриджам.'
    ];
    instructions.forEach(function(text){var li=document.createElement('li');li.textContent=text;helpList.appendChild(li)});
    document.body.style.overflow='hidden';dialog.showModal();closeButton.focus();
    if(!game.url){note('Скоро на этом экране','Игра готовится к запуску. А пока можно посмотреть другие наши работы.','ОЖИДАНИЕ');return}
    var token=++session;note('Включаем игру…','Сейчас появится изображение.','ЗАГРУЗКА');
    var url;
    try{url=new URL(game.url,document.baseURI);if(!['http:','https:','file:'].includes(url.protocol))throw new Error('Unsupported URL')}
    catch(error){note('Не удалось запустить игру','Попробуйте ещё раз чуть позже.','НЕТ СИГНАЛА');return}
    request=new AbortController();
    var ready=url.protocol==='file:'?Promise.resolve():fetch(url.href,{method:'HEAD',signal:request.signal}).then(function(response){if(!response.ok)throw new Error('Game unavailable')});
    ready.then(function(){
      if(token!==session||!dialog.open)return;
      activeURL=url;frame.src=url.href;frame.hidden=false;
    }).catch(function(error){
      if(error.name==='AbortError'||token!==session||!dialog.open)return;
      frame.hidden=true;note('Не удалось запустить игру','Попробуйте ещё раз чуть позже.','НЕТ СИГНАЛА');
    });
  }};
}
