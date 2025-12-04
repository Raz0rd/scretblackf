"use client"

export default function RecargaBanner() {
  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 py-1 shadow-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-white text-xs md:text-sm font-bold mx-4">
            RECARGA CELULAR: Ganhe até 20GB GRÁTIS! Todas as Operadoras! Crédito na Hora! RECARGA CELULAR: Ganhe até 20GB GRÁTIS! Todas as Operadoras! Crédito na Hora! RECARGA CELULAR: Ganhe até 20GB GRÁTIS! Todas as Operadoras! Crédito na Hora!
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
