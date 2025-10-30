'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function HeadManager() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [headContent, setHeadContent] = useState({
    metaTags: '',
    trackingScripts: ''
  });

  // Desabilitar tracking no modo de desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    setMounted(true);
  }, [isDevelopment]);

  useEffect(() => {
    if (!mounted) return;

    // Carregar configurações do localStorage
    const loadHeadContent = () => {
      try {
        if (typeof window !== 'undefined') {
          const metaTags = localStorage.getItem('head_meta_tags') || '';
          const trackingScripts = localStorage.getItem('head_tracking_scripts') || '';
          
          setHeadContent({
            metaTags,
            trackingScripts
          });

          // Scripts de rastreamento removidos
        }
      } catch (error) {
        //console.error('Erro ao carregar configurações do cabeçalho:', error);
      }
    };

    loadHeadContent();
  }, [mounted, isDevelopment]);

  // Ratoeira ADS removido

  // Scripts UTMify - Injeção Direta no DOM (TODAS AS PÁGINAS)
  const utmifyPixelId = process.env.NEXT_PUBLIC_PIXELID_UTMFY;
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    // Desabilitar no desenvolvimento
    if (isDevelopment) {
      return;
    }
    
    // Verificar se Pixel ID está configurado
    if (!utmifyPixelId) {
      return;
    }

    // Remover scripts antigos se existirem
    const oldPixelScript = document.getElementById('utmify-pixel-init');
    const oldGoogleScript = document.getElementById('utmify-google-pixel');
    const oldUtmsScript = document.getElementById('utmify-utms-script');
    
    if (oldPixelScript) oldPixelScript.remove();
    if (oldGoogleScript) oldGoogleScript.remove();
    if (oldUtmsScript) oldUtmsScript.remove();

    // 1. Injetar script de inicialização do Pixel Google
    const pixelInitScript = document.createElement('script');
    pixelInitScript.id = 'utmify-pixel-init';
    pixelInitScript.innerHTML = `
      window.googlePixelId = "${utmifyPixelId}";
      var a = document.createElement("script");
      a.id = "utmify-google-pixel";
      a.setAttribute("async", "");
      a.setAttribute("defer", "");
      a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel-google.js");
      document.head.appendChild(a);
    `;
    document.head.appendChild(pixelInitScript);

    // 2. Injetar script de UTMs
    const utmsScript = document.createElement('script');
    utmsScript.id = 'utmify-utms-script';
    utmsScript.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
    utmsScript.setAttribute('data-utmify-prevent-xcod-sck', '');
    utmsScript.setAttribute('data-utmify-prevent-subids', '');
    utmsScript.async = true;
    utmsScript.defer = true;
    document.head.appendChild(utmsScript);

    // Cleanup: remover scripts ao desmontar
    return () => {
      const pixelInit = document.getElementById('utmify-pixel-init');
      const googlePixel = document.getElementById('utmify-google-pixel');
      const utms = document.getElementById('utmify-utms-script');
      
      if (pixelInit) pixelInit.remove();
      if (googlePixel) googlePixel.remove();
      if (utms) utms.remove();
    };
  }, [mounted, pathname, utmifyPixelId, isDevelopment]);

  // Google Ads Conversion Tracking - Injeção Direta no DOM
  const googleAdsEnabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true';
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const adsIndividual = process.env.NEXT_PUBLIC_ADS_INDIVIDUAL === 'true';
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    // Verificar se já existe
    if (document.getElementById('google-gtag-script')) {
      console.log('[HeadManager] Google Ads tag já carregada');
      return;
    }

    if (!googleAdsEnabled || !googleAdsId) {
      console.log('[HeadManager] Google Ads desabilitado ou ID não definido');
      return;
    }

    console.log('[HeadManager] 🚀 Carregando Google Ads tag...');
    console.log('[HeadManager] ID:', googleAdsId);
    console.log('[HeadManager] Enabled:', googleAdsEnabled);

    // 1. Injetar script do Google Tag Manager
    const gtagScript = document.createElement('script');
    gtagScript.id = 'google-gtag-script';
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    // 2. Injetar inicialização do gtag
    const gtagInit = document.createElement('script');
    gtagInit.id = 'google-gtag-init';
    gtagInit.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAdsId}');
    `;
    document.head.appendChild(gtagInit);

    // 3. Se ADS_INDIVIDUAL=true, injetar funções gtag_report_conversion
    if (adsIndividual) {
      const conversionLabelCompra = process.env.NEXT_PUBLIC_GTAG_CONVERSION_COMPRA || process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';
      const conversionIdCompra = `${googleAdsId}/${conversionLabelCompra}`;
      
      const gtagFunctions = document.createElement('script');
      gtagFunctions.id = 'google-gtag-functions';
      gtagFunctions.innerHTML = `
        window.gtag_report_conversion_purchase = function(transactionId, value) {
          gtag('event', 'conversion', {
            'send_to': '${conversionIdCompra}',
            'value': value || 1.0,
            'currency': 'BRL',
            'transaction_id': transactionId || ''
          });
          return false;
        };
      `;
      document.head.appendChild(gtagFunctions);
    }

    console.log('[HeadManager] ✅ Google Ads tag carregada com sucesso!');

    // Cleanup
    return () => {
      const gtag = document.getElementById('google-gtag-script');
      const init = document.getElementById('google-gtag-init');
      const funcs = document.getElementById('google-gtag-functions');
      
      if (gtag) gtag.remove();
      if (init) init.remove();
      if (funcs) funcs.remove();
    };
  }, [mounted, pathname, googleAdsEnabled, googleAdsId, adsIndividual]);

  // Injetar Meta Tags SEO no DOM
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    // Remover meta tags antigas se existirem
    const oldMetas = document.querySelectorAll('meta[data-seo="true"]');
    oldMetas.forEach(meta => meta.remove());

    // Criar e injetar novas meta tags
    const metaTags = [
      { 
        name: 'description', 
        content: 'Central de recargas para Free Fire. Site de recargas pro Free Fire com entrega instantânea. Recarregue Free Fire e turbine seu jogo com diamantes!' 
      },
      { 
        name: 'keywords', 
        content: 'central de recargas, recargas pro ff, site de recargas pro free fire, recarregue freefire, turbine seu jogo, diamantes free fire, recarga ff instantânea, comprar diamantes ff' 
      }
    ];

    metaTags.forEach(({ name, content }) => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Cleanup
    return () => {
      const metas = document.querySelectorAll('meta[data-seo="true"]');
      metas.forEach(meta => meta.remove());
    };
  }, [mounted]);

  return (
    <Head>
      {/* Meta Tags Padrão */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Meta Tags Dinâmicas */}
      {headContent.metaTags && (
        <div dangerouslySetInnerHTML={{ __html: headContent.metaTags }} />
      )}
      
      {/* Scripts de Rastreamento removidos */}
      
      {/* Scripts UTMify - Injetados via useEffect diretamente no DOM */}
      
      {/* Outros Scripts de Rastreamento - Desabilitado no desenvolvimento */}
      {!isDevelopment && headContent.trackingScripts && (
        <div dangerouslySetInnerHTML={{ __html: headContent.trackingScripts }} />
      )}
    </Head>
  );
}
