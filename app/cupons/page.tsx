"use client"

import { Phone, Mail, MapPin, Clock, ShoppingCart, Star, Award, Users } from 'lucide-react'

export default function BronzeEletroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Bronze Eletro</h1>
              <p className="text-orange-100 text-lg">Sua loja de confiança desde 2011</p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">(75) 3446-2239</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Eletrodomésticos e Muito Mais!</h2>
          <p className="text-2xl mb-8 text-orange-50">As melhores marcas com os melhores preços</p>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
              <Award className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold">14 Anos</h3>
              <p className="text-orange-100">de Experiência</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold">+5000</h3>
              <p className="text-orange-100">Clientes Satisfeitos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
              <Star className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold">Top</h3>
              <p className="text-orange-100">Qualidade Garantida</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Empresa */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
              Sobre a Bronze Eletro
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-orange-600">Nossa História</h3>
                <p className="text-slate-700 leading-relaxed">
                  Fundada em 2011, a Bronze Eletro é referência em Sátiro Dias - BA no comércio de 
                  eletrodomésticos, móveis e materiais de construção. Com mais de uma década de experiência, 
                  oferecemos produtos de qualidade com os melhores preços da região.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Nossa Missão</h3>
                <p className="text-slate-700 leading-relaxed">
                  Proporcionar a melhor experiência de compra para nossos clientes, oferecendo produtos 
                  de qualidade, atendimento personalizado e preços competitivos. Sua satisfação é nossa 
                  prioridade!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos e Serviços */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
            Nossos Produtos
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Eletrodomésticos</h3>
              <p className="text-slate-600">
                Geladeiras, fogões, máquinas de lavar, micro-ondas e muito mais das melhores marcas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Móveis</h3>
              <p className="text-slate-600">
                Móveis para todos os ambientes: sala, quarto, cozinha e escritório.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Materiais de Construção</h3>
              <p className="text-slate-600">
                Tintas, ferramentas, material elétrico e tudo para sua obra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
            Visite Nossa Loja
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Endereço:</p>
                    <p className="text-slate-600">
                      Rua Juracy Magalhães, 38 - Sala<br />
                      Centro - Sátiro Dias/BA<br />
                      CEP: 48485-000
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-slate-800">Telefone:</p>
                    <p className="text-slate-600">(75) 3446-2239</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-slate-800">E-mail:</p>
                    <p className="text-slate-600">tomazhugovieira@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Horário de Funcionamento:</p>
                    <p className="text-slate-600">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 8h às 12h
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Dados da Empresa</h3>
              <div className="space-y-3 text-slate-700">
                <div>
                  <p className="font-semibold">Razão Social:</p>
                  <p>Luiz Antonio Souza dos Santos</p>
                </div>
                <div>
                  <p className="font-semibold">CNPJ:</p>
                  <p>13.188.346/0001-07</p>
                </div>
                <div>
                  <p className="font-semibold">Nome Fantasia:</p>
                  <p>Bronze Eletro</p>
                </div>
                <div>
                  <p className="font-semibold">Fundação:</p>
                  <p>04 de Janeiro de 2011</p>
                </div>
                <div>
                  <p className="font-semibold">Natureza Jurídica:</p>
                  <p>Empresário Individual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Bronze Eletro</h3>
          <p className="text-slate-300 mb-6">
            Sua loja de confiança em Sátiro Dias - BA
          </p>
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="font-semibold">Telefone</p>
              <p className="text-slate-300">(75) 3446-2239</p>
            </div>
            <div>
              <p className="font-semibold">E-mail</p>
              <p className="text-slate-300">tomazhugovieira@hotmail.com</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 mt-6">
            <p className="text-slate-400 text-sm">
              © 2011-2025 Bronze Eletro - CNPJ: 13.188.346/0001-07<br />
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
