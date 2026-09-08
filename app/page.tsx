'use client';
import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';

export default function Casamento() {
  // CONFIGURAÇÃO DOS DADOS DO CASAMENTO
  const DADOS = {
    nomeNoivo: "Celio",
    nomeNoiva: "Eloana",
    dataCasamento: "2026-11-14T17:00:00", // Formato: AAAA-MM-DDTHH:MM:SS
    dataTexto: "14 de Novembro de 2026 às 17:00",
    local: "Rua Mutamba, 169 - Jangurussu, Fortaleza - CE",
    enderecoCompleto: "Rua Mutamba, 169 - Jangurussu, Fortaleza - CE",
    linkGoogleMapsEmbed: "https://maps.google.com/?q=Rua+Mutamba+-+Jangurussu,+Fortaleza+-+CE,+60865-210",
    whatsappConfirmacao: "558596517198", // Seu número com DDD para receber os RSVPs
    chavePix: "celiojuniorvieira96@gmail.com",
    fotoPrincipal: "/foto-casal.jpg", 
    fotoHistoria: "/historia.jpg"
  };

  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [nomeRSVP, setNomeRSVP] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('1');

  const [recados, setRecados] = useState<{ nome: string; mensagem: string }[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [musica, setMusica] = useState('');

  useEffect(() => {
    const target = new Date(DADOS.dataCasamento).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const enviarWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagem = `Olá! Confirmo minha presença no casamento de ${DADOS.nomeNoiva} e ${DADOS.nomeNoivo}. %0ANome: ${nomeRSVP} %0AAcompanhantes: ${qtdPessoas}`;
    window.open(`https://wa.me/${DADOS.whatsappConfirmacao}?text=${mensagem}`, '_blank');
  };

  const enviarMusica = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagem = `Olá! Tenho uma sugestão de música para o casamento: ${musica}`;
    window.open(`https://wa.me/${DADOS.whatsappConfirmacao}?text=${mensagem}`, '_blank');
    setMusica('');
  };

 useEffect(() => {
  async function buscarRecados() {
    const { data, error } = await supabase
      .from('recados')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setRecados(data);
    }
  }
  buscarRecados();
}, []);

// 2. Enviar nova mensagem para o banco
const handleEnviarRecado = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!novoNome.trim() || !novaMensagem.trim()) return;

  const { data, error } = await supabase
    .from('recados')
    .insert([{ nome: novoNome, mensagem: novaMensagem }])
    .select();
};
useEffect(() => {
  async function carregarRecados() {
    const { data } = await supabase
      .from('recados')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setRecados(data);
  }
  carregarRecados();
}, []);

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans">
      
      {/* CAPA */}
      <section className="relative flex flex-col items-center justify-center text-center p-8 min-h-[90vh] bg-[#3b4d3c] text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${DADOS.fotoPrincipal})` }}
        />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs uppercase tracking-widest text-stone-200 mb-3">Convidamos você para celebrar</p>
          <h1 className="text-5xl md:text-7xl font-serif mb-4 tracking-wide">{DADOS.nomeNoiva} & {DADOS.nomeNoivo}</h1>
          <p className="text-base font-light mb-8 text-stone-100">{DADOS.dataTexto} • {DADOS.local}</p>

          <div className="grid grid-cols-4 gap-3 bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div>
              <span className="block text-3xl font-bold">{timeLeft.dias}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-200">Dias</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">{timeLeft.horas}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-200">Horas</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">{timeLeft.minutos}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-200">Min</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">{timeLeft.segundos}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-200">Seg</span>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section className="max-w-4xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-stone-100">
          <img 
            src={DADOS.fotoHistoria} 
            alt="História do casal" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-serif text-[#3b4d3c] mb-4">Nossa História</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Nossa história começou onde o amor encontra o seu propósito: na igreja. Entre encontros no ministério, conversas sinceras e sorrisos compartilhados, fomos descobrindo que o nosso encontro não tinha sido por acaso.
          </p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Hoje, olhamos para trás e vemos 8 anos de uma caminhada abençoada, cheia de aprendizados, cumplicidade e um amor que só cresce a cada dia. De lá para cá, construímos sonhos, superamos desafios e fortalecemos a certeza de que fomos feitos um para o outro.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Agora, estamos prestes a dar o passo mais importante das nossas vidas no altar, e não poderíamos estar mais felizes em celebrar essa união ao lado de quem amamos!
          </p>
        </div>
      </section>
      {/* TRAJE & PROGRAMAÇÃO */}
      <section className="bg-stone-50 py-16 px-6 border-y border-stone-200/60">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="text-center p-8 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <span className="text-3xl mb-2 block">👗👔</span>
            <h3 className="text-2xl font-serif text-[#3b4d3c] mb-2">Traje (Dress Code)</h3>
            <p className="text-stone-700"><strong>Passeio Completo / Esporte Fino</strong></p>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">Sugerimos roupas leves e confortáveis. Recomendamos evitar tons de branco, off-white e verde oliva reservados aos noivos/madrinhas.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <h3 className="text-2xl font-serif text-[#3b4d3c] mb-4 text-center">Programação do Dia</h3>
            <ul className="space-y-3 text-stone-600 text-sm">
              <li className="flex justify-between border-b border-stone-100 pb-2">
                <span>16:30</span> <strong>Chegada dos Convidados</strong>
              </li>
              <li className="flex justify-between border-b border-stone-100 pb-2">
                <span>17:00</span> <strong>Início da Cerimônia</strong>
              </li>
              <li className="flex justify-between border-b border-stone-100 pb-2">
                <span>18:30</span> <strong>Jantar</strong>
              </li>
              <li className="flex justify-between pb-1">

              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CONFIRMAÇÃO DE PRESENÇA (RSVP) */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-serif text-[#3b4d3c] mb-2">Confirmação de Presença</h2>
          <p className="text-xs text-stone-500 mb-6">Por favor, confirme sua presença para organizarmos tudo com carinho.</p>
          
          <form onSubmit={enviarWhatsApp} className="space-y-4">
            <input
              type="text"
              placeholder="Seu nome completo"
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b4d3c] bg-stone-50/50 text-sm"
              value={nomeRSVP}
              onChange={(e) => setNomeRSVP(e.target.value)}
              required
            />
            <select
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b4d3c] bg-stone-50/50 text-sm text-stone-700"
              value={qtdPessoas}
              onChange={(e) => setQtdPessoas(e.target.value)}
            >
              <option value="1">Vou sozinho(a)</option>
              <option value="2">Vou com +1 acompanhante</option>
              <option value="3">Vou com +2 acompanhantes</option>
            </select>
            <button
              type="submit"
              className="w-full bg-[#3b4d3c] text-white font-medium py-3 rounded-lg hover:bg-[#2e3d2f] transition-colors shadow-md text-sm tracking-wide"
            >
              Confirmar via WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* LOCAL DO EVENTO & MAPA */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-serif text-[#3b4d3c] mb-2">Local do Evento</h2>
        <p className="text-stone-700 font-medium mb-1">{DADOS.local}</p>
        <p className="text-xs text-stone-500 mb-6">{DADOS.enderecoCompleto}</p>
        
        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.023456789!2d-38.5147!3d-3.8341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74d0ccbd36eb0%3A0x706ad436ae3de588!2sRua%20Mutamba%20-%20Jangurussu%2C%20Fortaleza%20-%20CE%2C%2060865-210!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* MURAL DE RECADOS */}
      <section className="bg-stone-50 py-16 px-6 border-y border-stone-200/60">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-[#3b4d3c] mb-2 text-center">Mural de Recados</h2>
          <p className="text-xs text-stone-500 mb-8 text-center">Deixe uma mensagem carinhosa para os noivos!</p>

          <form onSubmit={handleEnviarRecado} className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b4d3c] bg-white text-sm"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              required
            />
            <textarea
              placeholder="Escreva sua mensagem aqui..."
              className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b4d3c] bg-white h-24 text-sm"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-stone-800 text-white font-medium py-3 rounded-lg hover:bg-stone-900 transition-colors text-sm"
            >
              Publicar Recado
            </button>
          </form>

          <div className="space-y-4">
            {recados.map((recado, index) => (
              <div key={index} className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-sm">
                <strong className="text-[#3b4d3c] block font-serif">{recado.nome}</strong>
                <p className="text-stone-600 text-sm mt-1">{recado.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* RODAPÉ E CRÉDITOS */}
      <footer className="bg-[#2e3d2f] text-stone-300 text-xs py-6 text-center border-t border-white/10">
        <p>© 2026 Celio & Eloana. Todos os direitos reservados.</p>
        <p className="mt-1 text-stone-400">
          Desenvolvido com ❤️ por <span className="font-semibold text-white">CJ Studio</span> • <span className="italic">Web & Design</span>
        </p>
      </footer>
    </div>
  );
}