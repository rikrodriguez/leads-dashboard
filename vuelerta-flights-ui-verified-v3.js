(()=>{'use strict';
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(...args){
  const response=await nativeFetch(...args);
  try{
    const input=args[0];
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(url.includes('/api/flights')&&!url.includes('action=booking')){
      const data=await response.clone().json();
      if(Array.isArray(data.offers)){
        data.offers=data.offers.filter(o=>o&&o.priceStatus==='verified');
        const headers=new Headers(response.headers);
        headers.delete('content-length');
        headers.set('content-type','application/json; charset=utf-8');
        return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers});
      }
    }
  }catch{}
  return response;
};
const s=document.createElement('script');
s.src='https://vuelerta-flight-engine.vercel.app/flights-ui.js?v=3';
s.async=false;
document.head.appendChild(s);
})();