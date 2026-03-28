import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

interface JuridicoVideoProps {
  titulo: string;
  subtitulo: string;
  topicos: string[];
  corPrimaria: string;
  corSecundaria: string;
  corDestaque: string;
}

const Titulo: React.FC<{
  texto: string;
  subtitulo: string;
  corPrimaria: string;
  corDestaque: string;
}> = ({ texto, subtitulo, corPrimaria, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: corPrimaria,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: corDestaque,
            margin: "0 auto 40px",
          }}
        />
        <h1
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {texto}
        </h1>
        <p
          style={{
            color: corDestaque,
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            marginTop: 30,
            fontWeight: 500,
          }}
        >
          {subtitulo}
        </p>
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: corDestaque,
            margin: "40px auto 0",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Topico: React.FC<{
  texto: string;
  numero: number;
  corPrimaria: string;
  corDestaque: string;
}> = ({ texto, numero, corPrimaria, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 15 } });
  const translateX = interpolate(slideIn, [0, 1], [600, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: corPrimaria,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: corDestaque,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 40px",
          }}
        >
          <span
            style={{
              color: corPrimaria,
              fontSize: 48,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {numero}
          </span>
        </div>
        <h2
          style={{
            color: "white",
            fontSize: 56,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {texto}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

const Encerramento: React.FC<{
  subtitulo: string;
  corPrimaria: string;
  corDestaque: string;
}> = ({ subtitulo, corPrimaria, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: corPrimaria,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <h2
          style={{
            color: corDestaque,
            fontSize: 48,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            marginBottom: 20,
          }}
        >
          Precisa de ajuda?
        </h2>
        <p
          style={{
            color: "white",
            fontSize: 36,
            fontFamily: "Arial, sans-serif",
            marginBottom: 40,
          }}
        >
          Consulte um advogado especialista
        </p>
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: corDestaque,
            margin: "0 auto 30px",
          }}
        />
        <p
          style={{
            color: "white",
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            fontWeight: 500,
          }}
        >
          {subtitulo}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const JuridicoVideo: React.FC<JuridicoVideoProps> = ({
  titulo,
  subtitulo,
  topicos,
  corPrimaria,
  corSecundaria,
  corDestaque,
}) => {
  const DURACAO_TITULO = 90;
  const DURACAO_TOPICO = 90;
  const DURACAO_ENCERRAMENTO = 90;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={DURACAO_TITULO}>
        <Titulo
          texto={titulo}
          subtitulo={subtitulo}
          corPrimaria={corPrimaria}
          corDestaque={corDestaque}
        />
      </Sequence>

      {topicos.map((topico, index) => (
        <Sequence
          key={index}
          from={DURACAO_TITULO + index * DURACAO_TOPICO}
          durationInFrames={DURACAO_TOPICO}
        >
          <Topico
            texto={topico}
            numero={index + 1}
            corPrimaria={corPrimaria}
            corDestaque={corDestaque}
          />
        </Sequence>
      ))}

      <Sequence
        from={DURACAO_TITULO + topicos.length * DURACAO_TOPICO}
        durationInFrames={DURACAO_ENCERRAMENTO}
      >
        <Encerramento
          subtitulo={subtitulo}
          corPrimaria={corPrimaria}
          corDestaque={corDestaque}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
