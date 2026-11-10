// Для новых песен: {title:'Название', artist:'Артпритон', src:'assets/music/song.mp3', cover:'assets/music/cover.jpg'}.
var MUSIC_TRACKS = [
  {title:'Пси воздействие кота',artist:'AiVA',src:'assets/Music/Пси воздействие кота.mp3',cover:'assets/Music/PsyDoCat.png'},
  {title:'Пусть весь мир — аномалия',artist:'AiVA',src:'assets/Music/Пусть весь мир - аномалия.mp3',cover:'assets/Music/AnomalyWorld.png'},
  {title:'Счастлив люд, мурчат коты',artist:'AiVA',src:'assets/Music/Счастлив люд, мурчат коты.mp3',cover:'assets/Music/HappyPeople.png'},
  {title:'ZombieRelax',artist:'AiVA',src:'assets/Music/ZombieRelax.mp3',cover:'assets/Music/ZombieRelax.png'},
  {title:'ХвостПистолетом',artist:'AiVA',src:'assets/Music/ХвостПистолетом.mp3',cover:'assets/Music/ХвостПистолетом.png'}
];
var VIDEO_TAPES = [
  {title:'Знакомство со студией',src:'assets/Video/Артпритон.mp4',cover:'assets/Video/Artpriton.png'},
  {title:'Что значит слово «отметить»',src:'assets/Video/Отмечать.mp4',cover:'assets/Video/Otmetit.png'},
  {title:'Котобаза',src:'assets/Video/Псивоздействие кота.mp4',cover:'assets/Video/Kotobaza.png'},
  {title:'Две стороны Айвы',src:'assets/Video/Две стороны Айвы.mp4',cover:'assets/Video/Две стороны Айвы.png'}
];

(function(){
  function cassetteArt(cover,sprite){
    var art=document.createElement('span');art.className='cassette-art';art.setAttribute('aria-hidden','true');
    var tape=document.createElement('img');tape.className='cassette-sprite';tape.src=sprite;tape.alt='';tape.loading='lazy';tape.decoding='async';
    var box=document.createElement('img');box.className='cassette-box';box.src=cover;box.alt='';box.loading='lazy';box.decoding='async';
    art.append(tape,box);return art;
  }
  var library=document.getElementById('media'),videoSection=library.querySelector('.media-video'),musicSection=library.querySelector('.music-corner');
  musicSection.hidden=true;
  library.querySelectorAll('[data-media-view]').forEach(function(button){button.addEventListener('click',function(){
    var view=button.dataset.mediaView;videoSection.hidden=view!=='video';musicSection.hidden=view!=='music';
    library.querySelector('.magazine-section').hidden=view!=='magazines';
    library.querySelectorAll('[data-media-view]').forEach(function(tab){tab.setAttribute('aria-pressed',tab===button?'true':'false')});
  })});
  var shelf=document.getElementById('vhs-shelf'),dialog=document.getElementById('video-dialog');
  var screen=document.getElementById('video-dialog-screen'),title=document.getElementById('video-dialog-title');
  var opener=null,previousOverflow='';
  function restartVideo(container){
    var player=container.querySelector('video');if(!player)return;
    player.currentTime=0;player.play().catch(function(){});player.focus();
  }
  function stopVideo(container){
    var player=container.querySelector('video');if(!player)return;
    player.pause();player.removeAttribute('src');player.load();
  }
  function exclusiveVideo(player){
    if(audio)audio.pause();
    document.querySelectorAll('video').forEach(function(other){if(other!==player)other.pause()});
  }
  document.querySelectorAll('#studio-video-player video').forEach(function(player){player.addEventListener('play',function(){exclusiveVideo(player)})});
  document.getElementById('video-restart').addEventListener('click',function(){restartVideo(screen)});
  document.getElementById('studio-video-restart').addEventListener('click',function(){restartVideo(document.getElementById('studio-video-player'))});
  function openVideo(video,button){
    if(dialog.open)return;
    opener=button;previousOverflow=document.body.style.overflow;title.textContent=video.title;
    var player=document.createElement('video');player.setAttribute('aria-label',video.title);
    player.src=video.src;player.controls=true;player.playsInline=true;player.preload='metadata';
    player.addEventListener('play',function(){exclusiveVideo(player)});
    audio.pause();screen.replaceChildren(player);dialog.showModal();document.body.style.overflow='hidden';
    player.play().catch(function(){});
    document.getElementById('video-power-button').focus();
  }
  VIDEO_TAPES.forEach(function(video,index){
    var button=document.createElement('button');button.type='button';button.className='vhs-tape cassette-card';
    var number=document.createElement('span');number.className='vhs-number';number.textContent='VHS / 0'+(index+1);
    var label=document.createElement('span');label.className='vhs-label';
    if(video.cover){var cover=document.createElement('img');cover.src=video.cover;cover.alt='';cover.loading='lazy';label.appendChild(cover)}
    var name=document.createElement('b');name.textContent=video.title;label.appendChild(name);
    var reels=document.createElement('span');reels.className='tape-reels';reels.setAttribute('aria-hidden','true');
    var footer=document.createElement('span');footer.className='vhs-foot';footer.textContent='АРТПРИТОН · PLAY ▶';
    if(video.cover){
      var caption=document.createElement('b');caption.className='cassette-title';caption.textContent=video.title;
      var action=document.createElement('span');action.className='cassette-action';action.textContent='▶ Смотреть';
      button.append(cassetteArt(video.cover,'assets/Video/VHS.png'),caption,action);
    }else button.append(number,label,reels,footer);
    shelf.appendChild(button);
    button.addEventListener('click',function(){
      openVideo(video,button);
    });
  });
  document.getElementById('video-dialog-close').addEventListener('click',function(){dialog.close()});
  document.getElementById('video-power-button').addEventListener('click',function(){dialog.close()});
  dialog.addEventListener('close',function(){stopVideo(screen);screen.replaceChildren();document.body.style.overflow=previousOverflow;if(opener)opener.focus()});
  dialog.addEventListener('click',function(event){if(event.target===dialog){var r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});

  var audio=document.getElementById('cassette-audio'),list=document.getElementById('audio-tapes');
  var display=document.getElementById('walkman-title'),play=document.getElementById('walkman-play');
  var prev=document.getElementById('walkman-prev'),next=document.getElementById('walkman-next'),status=document.getElementById('walkman-status');
  var current=-1,buttons=[];
  var stop=document.getElementById('walkman-stop'),seek=document.getElementById('walkman-seek'),volume=document.getElementById('walkman-volume'),time=document.getElementById('walkman-time');
  audio.volume=Number(volume.value);
  function stamp(value){value=Number.isFinite(value)?Math.max(0,value):0;return Math.floor(value/60)+':'+String(Math.floor(value%60)).padStart(2,'0')}
  function progress(){
    var duration=Number.isFinite(audio.duration)?audio.duration:0;
    seek.disabled=!duration;seek.value=duration?audio.currentTime/duration*100:0;
    seek.style.setProperty('--played',seek.value+'%');
    time.textContent=stamp(audio.currentTime)+' / '+stamp(duration);
    seek.setAttribute('aria-valuetext',time.textContent);
  }
  function select(index,autoplay){
    if(!MUSIC_TRACKS.length)return;
    current=(index+MUSIC_TRACKS.length)%MUSIC_TRACKS.length;
    var track=MUSIC_TRACKS[current];audio.src=track.src;display.textContent=track.title;
    progress();status.textContent='ГОТОВО К ПРОСЛУШИВАНИЮ';
    buttons.forEach(function(button,i){button.setAttribute('aria-pressed',i===current?'true':'false')});
    if(autoplay)start();
  }
  function start(){document.querySelectorAll('video').forEach(function(player){player.pause()});audio.play().catch(function(){status.textContent='Не удалось воспроизвести. Попробуйте ещё раз.'})}
  MUSIC_TRACKS.forEach(function(track,index){
    var button=document.createElement('button');button.type='button';button.className='audio-tape cassette-card';button.setAttribute('aria-pressed','false');
    var label=document.createElement('span');label.className='audio-tape-label';
    if(track.cover){var img=document.createElement('img');img.src=track.cover;img.alt='';img.loading='lazy';label.appendChild(img)}
    var name=document.createElement('b');name.textContent=track.title;label.appendChild(name);
    var reels=document.createElement('span');reels.className='tape-reels';reels.setAttribute('aria-hidden','true');
    var artist=document.createElement('small');artist.textContent=track.artist||'Артпритон';
    if(track.cover){
      var caption=document.createElement('b');caption.className='cassette-title';caption.textContent=track.title;
      var action=document.createElement('span');action.className='cassette-action';action.textContent='▶ Слушать';
      button.append(cassetteArt(track.cover,'assets/Music/Casset.png'),caption,action);
    }else button.append(label,reels,artist);
    list.appendChild(button);buttons.push(button);
    button.addEventListener('click',function(){select(index,true)});
  });
  if(MUSIC_TRACKS.length){select(0,false);play.disabled=stop.disabled=false;prev.disabled=next.disabled=MUSIC_TRACKS.length<2}
  else{list.innerHTML='<div class="audio-tape audio-tape-empty"><span class="audio-tape-label"><b>Первая сторона</b><small>Музыка скоро появится</small></span><span class="tape-reels" aria-hidden="true"></span><small>АРТПРИТОН · C–60</small></div>'}
  play.addEventListener('click',function(){if(audio.paused)start();else audio.pause()});
  stop.addEventListener('click',function(){audio.pause();audio.currentTime=0;progress();status.textContent='СТОП'});
  seek.addEventListener('input',function(){if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Number(seek.value)/100*audio.duration;progress()}});
  volume.addEventListener('input',function(){audio.volume=Number(volume.value)});
  ['loadedmetadata','durationchange','timeupdate','emptied'].forEach(function(event){audio.addEventListener(event,progress)});
  prev.addEventListener('click',function(){select(current-1,true)});next.addEventListener('click',function(){select(current+1,true)});
  audio.addEventListener('play',function(){play.textContent='Ⅱ';play.setAttribute('aria-label','Пауза');status.textContent='ВОСПРОИЗВЕДЕНИЕ';document.getElementById('walkman').classList.add('is-playing')});
  audio.addEventListener('pause',function(){play.textContent='▶';play.setAttribute('aria-label','Воспроизвести');status.textContent='ПАУЗА';document.getElementById('walkman').classList.remove('is-playing')});
  audio.addEventListener('ended',function(){if(current<MUSIC_TRACKS.length-1)select(current+1,true)});
  audio.addEventListener('error',function(){status.textContent='Не удалось загрузить трек'});
})();
