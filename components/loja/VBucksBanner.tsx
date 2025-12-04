"use client"

export default function VBucksBanner() {
  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 py-1 shadow-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-white text-xs md:text-sm font-bold mx-4 flex items-center gap-2">
            <img src="/images/categoriesIcons/icons8-fortnite-30.png" alt="" className="w-4 h-4 inline-block" />
            FORTNITE: V-Bucks com 50% OFF! Melhor Preço Garantido! Entrega Instantânea! 
            <img src="/images/categoriesIcons/icons8-fortnite-30.png" alt="" className="w-4 h-4 inline-block" />
            FORTNITE: V-Bucks com 50% OFF! Melhor Preço Garantido! Entrega Instantânea! 
            <img src="/images/categoriesIcons/icons8-fortnite-30.png" alt="" className="w-4 h-4 inline-block" />
            FORTNITE: V-Bucks com 50% OFF! Melhor Preço Garantido! Entrega Instantânea!
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
