"use client"

export default function UrgencyBannerLoja() {
  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-0.5 shadow-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-white text-[10px] md:text-xs font-semibold mx-4 flex items-center gap-2">
            <img src="/images/categoriesIcons/icons8-fogo-livre-48.png" alt="" className="w-4 h-4 inline-block" />
            PROMOÇÃO RELÂMPAGO: Até 35% de Bônus em Diamantes! Entrega Imediata! Aproveite Agora! 
            <img src="/images/categoriesIcons/icons8-fogo-livre-48.png" alt="" className="w-4 h-4 inline-block" />
            PROMOÇÃO RELÂMPAGO: Até 35% de Bônus em Diamantes! Entrega Imediata! Aproveite Agora! 
            <img src="/images/categoriesIcons/icons8-fogo-livre-48.png" alt="" className="w-4 h-4 inline-block" />
            PROMOÇÃO RELÂMPAGO: Até 35% de Bônus em Diamantes! Entrega Imediata! Aproveite Agora!
          </span>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </>
  )
}
