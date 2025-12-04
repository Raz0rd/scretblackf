'use client';

import { useEffect } from 'react';

export default function UtmifyScripts() {
  const utmifyPixelId = process.env.NEXT_PUBLIC_PIXELID_UTMFY || '691cd3b3b92ea77f371e882b';
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (isDevelopment) {
      console.log('🔧 [UtmifyScripts] Modo desenvolvimento: Scripts UTMify desabilitados');
    } else {
      console.log('✅ [UTMify] Scripts carregados no client-side');
    }
  }, [isDevelopment]);

  // Não renderizar scripts em modo de desenvolvimento
  if (isDevelopment) {
    return null;
  }

  return (
    <>
      {/* UTMify Pixel - Google Ads Tracking */}
      <script
        id="utmify-pixel-inline"
        dangerouslySetInnerHTML={{
          __html: `
            window.googlePixelId = "${utmifyPixelId}";
            (function() {
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel-google.js");
              document.head.appendChild(a);
            })();
          `
        }}
      />
      
      {/* UTMify UTMs Script - Captura e salva UTMs em cookies */}
      <script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck=""
        data-utmify-prevent-subids=""
        async
        defer
      />
    </>
  );
}
