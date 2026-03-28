import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

// Paleta do escritório
const CORES = {
  primaria: "#1a365d",
  secundaria: "#2d4a7a",
  destaque: "#d69e2e",
  texto: "#ffffff",
  textoClaro: "#e2e8f0",
  fundo: "#0f2440",
};

// Cores por categoria (inspiradas no infográfico)
const CATEGORIAS = {
  chat: "#c4956a",
  raciocinio: "#c4956a",
  desenvolvedor: "#c4956a",
  construir: "#8aab68",
  automacao: "#8aab68",
  navegador: "#8aab68",
  programacao: "#8aab68",
  integracoes: "#c4956a",
  skills: "#8aab68",
  projetos: "#c4956a",
};

// ========== LOGO ==========
const LogoPequena: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      opacity: 0.6,
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        border: `1.5px solid ${CORES.destaque}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 14,
        color: CORES.destaque,
        fontFamily: "serif",
        fontWeight: "bold",
      }}
    >
      PN
    </div>
    <span
      style={{
        color: CORES.textoClaro,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        letterSpacing: 1,
      }}
    >
      Paulo Nascimento - Advocacia Integrada
    </span>
  </div>
);

// ========== FUNDO PADRÃO ==========
const FundoPadrao: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(170deg, ${CORES.fundo} 0%, ${CORES.primaria} 100%)`,
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(214,158,46,0.3) 40px, rgba(214,158,46,0.3) 41px)",
      }}
    />
    {children}
    <div style={{ position: "absolute", bottom: 50 }}>
      <LogoPequena />
    </div>
  </AbsoluteFill>
);

// ========== CENA 1: ABERTURA ==========
const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subtitleOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <FundoPadrao>
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Logo PN */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `3px solid ${CORES.destaque}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 48,
              color: CORES.destaque,
              fontWeight: "bold",
              fontFamily: "serif",
            }}
          >
            PN
          </span>
        </div>

        <div
          style={{
            color: CORES.texto,
            fontSize: 20,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Paulo Nascimento - Advocacia Integrada
        </div>

        <div
          style={{ width: 120, height: 2, backgroundColor: CORES.destaque }}
        />

        <h1
          style={{
            color: CORES.texto,
            fontSize: 62,
            fontWeight: 800,
            fontFamily: "'Georgia', serif",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Como Aprender{" "}
          <span style={{ color: CORES.destaque }}>Claude</span>
        </h1>

        <p
          style={{
            opacity: subtitleOpacity,
            color: CORES.textoClaro,
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          Tudo o que você precisa saber
        </p>
      </div>
    </FundoPadrao>
  );
};

// ========== CENA: CONCEITO ==========
interface ConceitoProps {
  numero: number;
  tag: string;
  tagCor: string;
  icone: string;
  titulo: string;
  descricao: string;
  idealPara: string;
}

const Conceito: React.FC<ConceitoProps> = ({
  numero,
  tag,
  tagCor,
  icone,
  titulo,
  descricao,
  idealPara,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 14 } });
  const translateY = interpolate(slideIn, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const idealOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <FundoPadrao>
      {/* Número grande no fundo */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 50,
          fontSize: 220,
          fontWeight: 900,
          color: "rgba(214,158,46,0.04)",
          fontFamily: "'Georgia', serif",
        }}
      >
        {numero}
      </div>

      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          maxWidth: 900,
        }}
      >
        {/* Tag da categoria */}
        <div
          style={{
            backgroundColor: tagCor,
            padding: "8px 24px",
            borderRadius: 20,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        </div>

        {/* Ícone */}
        <div style={{ fontSize: 64 }}>{icone}</div>

        {/* Título */}
        <h2
          style={{
            color: CORES.texto,
            fontSize: 54,
            fontWeight: 700,
            fontFamily: "'Georgia', serif",
            textAlign: "center",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {titulo}
        </h2>

        {/* Card de descrição */}
        <div
          style={{
            opacity: cardOpacity,
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(214,158,46,0.2)",
            borderRadius: 16,
            padding: "30px 36px",
            maxWidth: 820,
          }}
        >
          <p
            style={{
              color: CORES.textoClaro,
              fontSize: 30,
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
              lineHeight: 1.6,
              textAlign: "center",
              margin: 0,
            }}
          >
            {descricao}
          </p>
        </div>

        {/* Ideal para */}
        <div
          style={{
            opacity: idealOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
          }}
        >
          <div
            style={{
              backgroundColor: CORES.destaque,
              padding: "4px 16px",
              borderRadius: 4,
            }}
          >
            <span
              style={{
                color: CORES.primaria,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Ideal para:
            </span>
          </div>
          <p
            style={{
              color: CORES.destaque,
              fontSize: 24,
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            {idealPara}
          </p>
        </div>
      </div>
    </FundoPadrao>
  );
};

// ========== CENA: ENCERRAMENTO ==========
const Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 10 } });
  const ctaOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaPulse = interpolate(frame % 40, [0, 20, 40], [1, 1.04, 1]);

  return (
    <FundoPadrao>
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 35,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: `3px solid ${CORES.destaque}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 42,
              color: CORES.destaque,
              fontWeight: "bold",
              fontFamily: "serif",
            }}
          >
            PN
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: CORES.texto,
              fontSize: 22,
              fontFamily: "'Georgia', serif",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Paulo Nascimento
          </div>
          <div
            style={{
              color: CORES.destaque,
              fontSize: 14,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            Advocacia Integrada
          </div>
        </div>

        <div
          style={{ width: 120, height: 2, backgroundColor: CORES.destaque }}
        />

        <h2
          style={{
            color: CORES.texto,
            fontSize: 44,
            fontWeight: 700,
            fontFamily: "'Georgia', serif",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          O <span style={{ color: CORES.destaque }}>Claude</span> já faz parte
          <br />
          do nosso escritório
        </h2>

        <p
          style={{
            color: CORES.textoClaro,
            fontSize: 26,
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 750,
          }}
        >
          48 skills jurídicas · 6 agentes especializados
          <br />
          Condominial · Trabalhista · Cível · Imobiliário · Família
        </p>

        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaPulse})`,
            marginTop: 15,
          }}
        >
          <div
            style={{
              backgroundColor: CORES.destaque,
              padding: "18px 44px",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                color: CORES.primaria,
                fontSize: 26,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1,
              }}
            >
              Tecnologia a favor do cliente
            </span>
          </div>
        </div>

        <div style={{ opacity: ctaOpacity, textAlign: "center", marginTop: 5 }}>
          <p
            style={{
              color: CORES.textoClaro,
              fontSize: 20,
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            paulo.nascimento@pnadvintegrada.com
          </p>
          <p
            style={{
              color: CORES.textoClaro,
              fontSize: 20,
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            83 99630-0681
          </p>
        </div>
      </div>
    </FundoPadrao>
  );
};

// ========== COMPOSIÇÃO PRINCIPAL ==========
export const ComoAprenderClaude: React.FC = () => {
  const DURACAO_ABERTURA = 100;
  const DURACAO_CONCEITO = 130;
  const DURACAO_ENCERRAMENTO = 120;

  const conceitos: ConceitoProps[] = [
    {
      numero: 1,
      tag: "Chat",
      tagCor: CATEGORIAS.chat,
      icone: "💬",
      titulo: "Claude.ai",
      descricao:
        "O ponto de partida. Analise petições, pesquise jurisprudência, redija pareceres, revise contratos e elabore teses.",
      idealPara:
        "Todo advogado. Se você trabalha com texto jurídico, deveria estar usando isso.",
    },
    {
      numero: 2,
      tag: "Raciocínio",
      tagCor: CATEGORIAS.raciocinio,
      icone: "🧠",
      titulo: "Pensamento Estendido",
      descricao:
        "O Claude raciocina passo a passo antes de responder. Use para análise de viabilidade recursal e teses complexas.",
      idealPara:
        "Advogados avaliando chances de êxito, divergência jurisprudencial ou estratégias recursais.",
    },
    {
      numero: 3,
      tag: "Desenvolvedor",
      tagCor: CATEGORIAS.desenvolvedor,
      icone: "⚡",
      titulo: "API",
      descricao:
        "Conecte o Claude ao sistema do seu escritório. Automatize triagem de processos e geração de peças em lote.",
      idealPara:
        "Escritórios que querem criar ferramentas próprias de automação jurídica com IA.",
    },
    {
      numero: 4,
      tag: "Construir",
      tagCor: CATEGORIAS.construir,
      icone: "📊",
      titulo: "Artefatos",
      descricao:
        "O Claude cria planilhas de cálculos judiciais, tabelas comparativas de contratos e dashboards de carteira.",
      idealPara:
        "Advogados que precisam de memoriais de cálculo, planilhas de prazos ou relatórios.",
    },
    {
      numero: 5,
      tag: "Automação",
      tagCor: CATEGORIAS.automacao,
      icone: "🤝",
      titulo: "Cowork",
      descricao:
        "Ferramenta desktop que lê seus arquivos reais e gera petições em Word, propostas em PDF e contratos.",
      idealPara:
        "Escritórios com alto volume de peças e documentos para produzir diariamente.",
    },
    {
      numero: 6,
      tag: "Navegador",
      tagCor: CATEGORIAS.navegador,
      icone: "🌐",
      titulo: "Claude no Chrome",
      descricao:
        "Agente que opera dentro do Chrome. Pesquisa jurisprudência no JusBrasil e consulta diários oficiais.",
      idealPara:
        "Advogados que gastam horas pesquisando em sites de tribunais e portais jurídicos.",
    },
    {
      numero: 7,
      tag: "Programação",
      tagCor: CATEGORIAS.programacao,
      icone: "💻",
      titulo: "Claude Code",
      descricao:
        "Terminal inteligente que programa de forma autônoma. Cria automações e sistemas internos do escritório.",
      idealPara:
        "Escritórios que querem criar suas próprias ferramentas de automação jurídica.",
    },
    {
      numero: 8,
      tag: "Integrações",
      tagCor: CATEGORIAS.integracoes,
      icone: "🔗",
      titulo: "Conectores",
      descricao:
        "Conecte Google Drive, Gmail, DocuSign e mais de 50 ferramentas. O Claude acessa tudo durante o chat.",
      idealPara:
        "Escritórios que usam múltiplas plataformas e querem um assistente que acessa todas.",
    },
    {
      numero: 9,
      tag: "Instruções",
      tagCor: CATEGORIAS.skills,
      icone: "📋",
      titulo: "Skills",
      descricao:
        "Pacotes de instruções reutilizáveis por área: trabalhista, imobiliário, condominial. Padrão de peças garantido.",
      idealPara:
        "Escritórios que precisam de padronização e consistência em todas as peças.",
    },
    {
      numero: 10,
      tag: "Contexto",
      tagCor: CATEGORIAS.projetos,
      icone: "📁",
      titulo: "Projetos",
      descricao:
        "Crie um projeto por cliente ou área. Salve contratos, procurações e instruções. Cada novo chat retoma o contexto.",
      idealPara:
        "Advogados com carteira ativa que precisam de continuidade entre sessões.",
    },
  ];

  let offset = 0;

  return (
    <AbsoluteFill>
      <Sequence from={offset} durationInFrames={DURACAO_ABERTURA}>
        <Abertura />
      </Sequence>

      {(offset += DURACAO_ABERTURA) && null}

      {conceitos.map((conceito, index) => {
        const from = offset + index * DURACAO_CONCEITO;
        return (
          <Sequence key={index} from={from} durationInFrames={DURACAO_CONCEITO}>
            <Conceito {...conceito} />
          </Sequence>
        );
      })}

      {(offset += conceitos.length * DURACAO_CONCEITO) && null}

      <Sequence from={offset} durationInFrames={DURACAO_ENCERRAMENTO}>
        <Encerramento />
      </Sequence>
    </AbsoluteFill>
  );
};
