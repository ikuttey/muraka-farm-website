(function(){
  const nav=document.getElementById('primaryNav');
  if(nav&&!nav.querySelector('a[href="reef-species.html"]')){
    const list=nav.querySelector('ul');
    const dharavandhooLink=list&&list.querySelector('a[href="dharavandhoo.html"]');
    if(list&&dharavandhooLink){
      const item=document.createElement('li');
      const link=document.createElement('a');
      link.href='reef-species.html';
      link.textContent='House Reef Species';
      if(location.pathname.endsWith('/reef-species.html')||location.pathname.endsWith('reef-species.html'))link.setAttribute('aria-current','page');
      item.append(link);
      const dharavandhooItem=dharavandhooLink.closest('li');
      dharavandhooItem.insertAdjacentElement('afterend',item);
    }
  }

  if((location.pathname.endsWith('/dharavandhoo.html')||location.pathname.endsWith('dharavandhoo.html'))&&!document.querySelector('.house-reef-guide-cta')){
    const experiences=document.getElementById('experiences');
    if(experiences){
      const section=document.createElement('section');
      section.className='visit-cta house-reef-guide-cta';
      section.innerHTML='<div class="wrap visit-cta-inner"><div><span class="tag">Dharavandhoo house reef</span><h2>Meet the marine life of our house reef.</h2><p>Explore Muraka Farm\'s growing field guide to turtles, sharks, rays, reef fish, corals and other organisms recorded around Dharavandhoo.</p></div><a class="btn primary" href="reef-species.html">Explore house reef species →</a></div>';
      experiences.insertAdjacentElement('beforebegin',section);
    }
  }

  const toggle=document.querySelector('.nav-toggle');
  if(toggle&&nav){
    const setOpen=open=>{
      nav.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
    };
    const close=()=>setOpen(false);
    toggle.addEventListener('click',()=>setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click',event=>{if(event.target.closest('a'))close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
    document.addEventListener('click',event=>{
      if(!nav.contains(event.target)&&!toggle.contains(event.target))close();
    });
    addEventListener('resize',()=>{if(innerWidth>1080)close()},{passive:true});
  }
  const header=document.querySelector('header');
  if(header)addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});
  const teamPhotos=[...document.querySelectorAll('.team-section .team-profile-photo')];
  if(teamPhotos.length&&'HTMLDialogElement'in window){
    const dialog=document.createElement('dialog');
    dialog.className='team-photo-lightbox';
    dialog.setAttribute('aria-label','Expanded team photograph');
    dialog.innerHTML='<button class="team-photo-lightbox__close" type="button" aria-label="Close enlarged photograph">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.append(dialog);
    const enlargedPhoto=dialog.querySelector('img');
    const caption=dialog.querySelector('figcaption');
    const closeButton=dialog.querySelector('.team-photo-lightbox__close');
    let opener=null;
    teamPhotos.forEach(photo=>{
      const button=document.createElement('button');
      button.className='team-photo-expand';
      button.type='button';
      button.setAttribute('aria-label',`Enlarge ${photo.alt}`);
      photo.parentNode.insertBefore(button,photo);
      button.append(photo);
      button.addEventListener('click',()=>{
        opener=button;
        enlargedPhoto.src=photo.currentSrc||photo.src;
        enlargedPhoto.alt=photo.alt;
        caption.textContent=photo.alt;
        dialog.showModal();
      });
    });
    const closeLightbox=()=>dialog.close();
    closeButton.addEventListener('click',closeLightbox);
    dialog.addEventListener('click',event=>{if(event.target===dialog)closeLightbox()});
    dialog.addEventListener('close',()=>{enlargedPhoto.removeAttribute('src');if(opener)opener.focus()});
  }
  const reveals=[...document.querySelectorAll('.hero-inner>* ,.head>* ,.card,.empty,.timeline article,.map,.flow li')];
  reveals.forEach((element,index)=>{element.classList.add('reveal');element.style.setProperty('--delay',`${(index%6)*55}ms`)});
  document.documentElement.classList.add('motion-ready');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window)){
    reveals.forEach(element=>element.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -7%'});
  reveals.forEach(element=>observer.observe(element));
})();
