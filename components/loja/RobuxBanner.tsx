"use client"

export default function RobuxBanner() {
  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 py-1 shadow-sm overflow-hidden border-b border-gray-200">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-gray-900 text-xs md:text-sm font-bold mx-4 flex items-center gap-2">
            <img src="/images/robux-coin-gold.svg" alt="" className="w-4 h-4 inline-block" />
            ROBLOX: Robux com Preços Imbatíveis! Bônus Exclusivos! Receba na Hora! 
            <img src="/images/robux-coin-gold.svg" alt="" className="w-4 h-4 inline-block" />
            ROBLOX: Robux com Preços Imbatíveis! Bônus Exclusivos! Receba na Hora! 
            <img src="/images/robux-coin-gold.svg" alt="" className="w-4 h-4 inline-block" />
            ROBLOX: Robux com Preços Imbatíveis! Bônus Exclusivos! Receba na Hora!
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
