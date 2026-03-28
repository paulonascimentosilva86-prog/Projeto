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

// Paleta de cores do escritório
const CORES = {
  primaria: "#1a365d",
  secundaria: "#2d4a7a",
  destaque: "#d69e2e",
  texto: "#ffffff",
  textoClaro: "#e2e8f0",
  fundo: "#0f2440",
  fundoCard: "rgba(255,255,255,0.08)",
  bordaCard: "rgba(214,158,46,0.3)",
};

// ========== LOGO DO ESCRITÓRIO ==========
const Logo: React.FC<{ tamanho?: number; animado?: boolean }> = ({
  tamanho = 1,
  animado = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animado
    ? spring({ frame, fps, config: { damping: 12, stiffness: 80 } })
    : 1;
  const opacity = animado
    ? interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <div
      style={{
        transform: `scale(${scale * tamanho})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Ícone balança da justiça estilizado */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `3px solid ${CORES.destaque}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 40,
            color: CORES.destaque,
            fontWeight: "bold",
            fontFamily: "serif",
          }}
        >
          PN
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            color: CORES.texto,
            fontSize: 26,
            fontWeight: 700,
            fontFamily: "'Georgia', serif",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Paulo Nascimento
        </div>
        <div
          style={{
            width: 160,
            height: 2,
            backgroundColor: CORES.destaque,
            margin: "8px auto",
          }}
        />
        <div
          style={{
            color: CORES.destaque,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Advocacia Integrada
        </div>
      </div>
    </div>
  );
};

// ========== CENA 1: ABERTURA COM LOGO ==========
const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const linhaWidth = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });
  const textoOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${CORES.fundo} 0%, ${CORES.primaria} 50%, ${CORES.secundaria} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Linhas decorativas de fundo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(214,158,46,0.3) 40px, rgba(214,158,46,0.3) 41px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        <Logo tamanho={1.3} />

        <div
          style={{
            width: interpolate(linhaWidth, [0, 1], [0, 400]),
            height: 1,
            backgroundColor: CORES.destaque,
            opacity: 0.5,
          }}
        />

        <div style={{ opacity: textoOpacity, textAlign: "center" }}>
          <p
            style={{
              color: CORES.textoClaro,
              fontSize: 24,
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            apresenta
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ========== CENA 2: TÍTULO PRINCIPAL ==========
const TituloPrincipal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
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

      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            width: 60,
            height: 4,
            backgroundColor: CORES.destaque,
            margin: "0 auto 40px",
            borderRadius: 2,
          }}
        />
        <h1
          style={{
            color: CORES.texto,
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "'Georgia', serif",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          A Importância do{" "}
          <span style={{ color: CORES.destaque }}>Advogado</span>
          <br />
          para o Condomínio
        </h1>
        <div
          style={{
            width: 60,
            height: 4,
            backgroundColor: CORES.destaque,
            margin: "40px auto 0",
            borderRadius: 2,
          }}
        />
      </div>

      <div
        style={{
          opacity: subtitleOpacity,
          position: "absolute",
          bottom: 120,
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: CORES.destaque,
            fontSize: 22,
            fontFamily: "Arial, sans-serif",
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          Por que seu condomínio precisa de assessoria jurídica?
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== CENA 3-7: TÓPICOS ==========
interface TopicoProps {
  numero: number;
  titulo: string;
  descricao: string;
  icone: string;
}

const Topico: React.FC<TopicoProps> = ({
  numero,
  titulo,
  descricao,
  icone,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const translateY = interpolate(slideIn, [0, 1], [80, 0]);
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const descOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(frame, [10, 50], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
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

      {/* Número do tópico no fundo */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 60,
          fontSize: 200,
          fontWeight: 900,
          color: "rgba(214,158,46,0.06)",
          fontFamily: "'Georgia', serif",
        }}
      >
        {numero}
      </div>

      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          textAlign: "center",
          maxWidth: 850,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Ícone */}
        <div
          style={{
            fontSize: 70,
            marginBottom: 10,
          }}
        >
          {icone}
        </div>

        {/* Número badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: CORES.destaque,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: CORES.primaria,
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {numero}
            </span>
          </div>
          <div
            style={{
              width: barWidth,
              height: 2,
              backgroundColor: CORES.destaque,
              opacity: 0.5,
            }}
          />
        </div>

        {/* Título */}
        <h2
          style={{
            color: CORES.texto,
            fontSize: 52,
            fontWeight: 700,
            fontFamily: "'Georgia', serif",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {titulo}
        </h2>

        {/* Descrição */}
        <p
          style={{
            opacity: descOpacity,
            color: CORES.textoClaro,
            fontSize: 30,
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
            lineHeight: 1.5,
            maxWidth: 750,
          }}
        >
          {descricao}
        </p>
      </div>

      {/* Logo pequena no rodapé */}
      <div style={{ position: "absolute", bottom: 50 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: 0.5,
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
      </div>
    </AbsoluteFill>
  );
};

// ========== CENA FINAL: ENCERRAMENTO + CTA ==========
const Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 70 },
  });
  const ctaOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaPulse = interpolate(
    frame % 40,
    [0, 20, 40],
    [1, 1.05, 1],
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${CORES.fundo} 0%, ${CORES.primaria} 50%, ${CORES.secundaria} 100%)`,
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

      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <Logo tamanho={1.1} animado={false} />

        <div style={{ height: 20 }} />

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
          Proteja seu{" "}
          <span style={{ color: CORES.destaque }}>patrimônio</span>
          <br />
          com assessoria especializada
        </h2>

        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaPulse})`,
            marginTop: 20,
          }}
        >
          <div
            style={{
              backgroundColor: CORES.destaque,
              padding: "20px 50px",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                color: CORES.primaria,
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1,
              }}
            >
              Consulte um especialista
            </span>
          </div>
        </div>

        <p
          style={{
            opacity: ctaOpacity,
            color: CORES.textoClaro,
            fontSize: 20,
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
            letterSpacing: 1,
            marginTop: 10,
          }}
        >
          Direito Condominial | Trabalhista | Cível | Imobiliário
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ========== COMPOSIÇÃO PRINCIPAL ==========
export const AdvogadoCondominio: React.FC = () => {
  const DURACAO_ABERTURA = 90;
  const DURACAO_TITULO = 120;
  const DURACAO_TOPICO = 150;
  const DURACAO_ENCERRAMENTO = 120;

  const topicos: TopicoProps[] = [
    {
      numero: 1,
      icone: "📋",
      titulo: "Cobrança de Inadimplentes",
      descricao:
        "Execução judicial de cotas condominiais com multa de 2%, juros de 1% a.m. e correção pelo INPC",
    },
    {
      numero: 2,
      icone: "📜",
      titulo: "Assembleias Regulares",
      descricao:
        "Convocações com quórum correto, atas válidas e deliberações juridicamente seguras",
    },
    {
      numero: 3,
      icone: "🛡️",
      titulo: "Prevenção de Conflitos",
      descricao:
        "Convenção e regimento interno bem elaborados reduzem 80% dos litígios condominiais",
    },
    {
      numero: 4,
      icone: "⚖️",
      titulo: "Defesa do Condomínio",
      descricao:
        "Representação em ações judiciais, embargos, obrigações de fazer e destituição de síndico",
    },
    {
      numero: 5,
      icone: "💰",
      titulo: "Economia e Segurança",
      descricao:
        "Contratos revisados, notificações extrajudiciais e mediação evitam gastos desnecessários com litígios",
    },
  ];

  let offset = 0;

  return (
    <AbsoluteFill>
      <Sequence from={offset} durationInFrames={DURACAO_ABERTURA}>
        <Abertura />
      </Sequence>

      {(offset += DURACAO_ABERTURA) && null}

      <Sequence from={offset} durationInFrames={DURACAO_TITULO}>
        <TituloPrincipal />
      </Sequence>

      {(offset += DURACAO_TITULO) && null}

      {topicos.map((topico, index) => {
        const from = offset + index * DURACAO_TOPICO;
        return (
          <Sequence key={index} from={from} durationInFrames={DURACAO_TOPICO}>
            <Topico {...topico} />
          </Sequence>
        );
      })}

      {(offset += topicos.length * DURACAO_TOPICO) && null}

      <Sequence from={offset} durationInFrames={DURACAO_ENCERRAMENTO}>
        <Encerramento />
      </Sequence>
    </AbsoluteFill>
  );
};
