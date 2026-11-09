(function(){
  var y=document.getElementById('rok'); if(y) y.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=document.getElementById('burger'), nav=document.getElementById('nav');
  function closeNav(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=nav.classList.toggle('open');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  nav.addEventListener('click',function(e){ if(e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeNav(); });

  // aktywna pozycja menu
  var links=[].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function spy(){
    var pos=window.scrollY+window.innerHeight*0.35, cur=-1;
    secs.forEach(function(s,i){ if(s && s.offsetTop<=pos) cur=i; });
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) cur=secs.length-1;
    links.forEach(function(a,i){a.classList.toggle('on',i===cur);});
  }
  window.addEventListener('scroll',spy,{passive:true}); spy();

  // karuzele: palec, mysz, strzałki, licznik
  var arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  [].forEach.call(document.querySelectorAll('[data-slider]'),function(sl){
    var tr=sl.querySelector('.track'), items=tr.children, n=items.length;
    var prev=document.createElement('button'), next=document.createElement('button');
    prev.className='sl-btn sl-prev'; next.className='sl-btn sl-next';
    prev.type=next.type='button'; prev.setAttribute('aria-label','Poprzednie zdjęcie'); next.setAttribute('aria-label','Następne zdjęcie');
    prev.innerHTML=arrow; next.innerHTML=arrow; prev.firstChild.style.transform='scaleX(-1)';
    sl.appendChild(prev); sl.appendChild(next);
    var cnt=null;
    if(sl.classList.contains('slider')){cnt=document.createElement('span');cnt.className='sl-count';sl.appendChild(cnt);}
    function step(){return items[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(tr).columnGap)||0);}
    function idx(){return Math.round(tr.scrollLeft/step());}
    function upd(){
      var i=idx(); if(cnt) cnt.textContent=(Math.min(i,n-1)+1)+' / '+n;
      prev.disabled=tr.scrollLeft<=2; next.disabled=tr.scrollLeft>=tr.scrollWidth-tr.clientWidth-2;
    }
    prev.addEventListener('click',function(){tr.scrollBy({left:-step(),behavior:'smooth'});});
    next.addEventListener('click',function(){tr.scrollBy({left:step(),behavior:'smooth'});});
    tr.addEventListener('scroll',function(){window.requestAnimationFrame(upd);},{passive:true});
    window.addEventListener('resize',upd);
    tr.tabIndex=0; tr.setAttribute('aria-label','Galeria zdjęć, przewiń w bok');
    tr.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'){e.preventDefault();next.click();} if(e.key==='ArrowLeft'){e.preventDefault();prev.click();} });
    // przeciąganie myszą
    var down=false,sx=0,sl0=0,moved=false;
    tr.addEventListener('pointerdown',function(e){ if(e.pointerType!=='mouse') return; down=true;moved=false;sx=e.clientX;sl0=tr.scrollLeft; });
    window.addEventListener('pointermove',function(e){ if(!down) return; var dx=e.clientX-sx; if(Math.abs(dx)>4){moved=true;tr.classList.add('drag');} tr.scrollLeft=sl0-dx; });
    window.addEventListener('pointerup',function(){
      if(!down) return; down=false;
      if(moved){ var i=Math.round(tr.scrollLeft/step()); tr.classList.remove('drag'); tr.scrollTo({left:i*step(),behavior:'smooth'}); }
    });
    tr.addEventListener('click',function(e){ if(moved){e.preventDefault();e.stopPropagation();moved=false;} },true);
    upd();
  });

  // przyciski "Zapytaj o..." ustawiają temat formularza
  var temat=document.getElementById('temat');
  [].forEach.call(document.querySelectorAll('[data-temat]'),function(a){
    a.addEventListener('click',function(){ temat.value=a.getAttribute('data-temat'); });
  });

  // formularz pokazowy
  var form=document.getElementById('form'), note=document.getElementById('formNote');
  form.addEventListener('submit',function(e){ e.preventDefault(); note.hidden=false; });
})();
