"use client"

export default function BrainrotBanner() {
  return (
    <>
      <div className="relative w-full rainbow-bg py-1 shadow-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-gray-900 text-xs md:text-sm font-bold mx-4 flex items-center gap-2">
            <img src="/images/categoriesIcons/Pipi_Kiwi.webp" alt="" className="w-4 h-4 inline-block" />
            MEGA DESCONTO: 45% OFF em Brainroots acima de R$ 50! Aproveite Agora! Entrega Imediata! 
            <img src="/images/categoriesIcons/Pipi_Kiwi.webp" alt="" className="w-4 h-4 inline-block" />
            MEGA DESCONTO: 45% OFF em Brainroots acima de R$ 50! Aproveite Agora! Entrega Imediata! 
            <img src="/images/categoriesIcons/Pipi_Kiwi.webp" alt="" className="w-4 h-4 inline-block" />
            MEGA DESCONTO: 45% OFF em Brainroots acima de R$ 50! Aproveite Agora! Entrega Imediata!
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
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rainbow-bg {
          background: linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.6),
            rgba(255, 127, 0, 0.6),
            rgba(255, 255, 0, 0.6),
            rgba(0, 255, 0, 0.6),
            rgba(0, 0, 255, 0.6),
            rgba(75, 0, 130, 0.6),
            rgba(148, 0, 211, 0.6),
            rgba(255, 0, 0, 0.6)
          );
          background-size: 200% 100%;
          animation: rainbow 8s linear infinite;
        }
      `}</style>
    </>
  )
}
