import { Composition } from "remotion";
import { JuridicoVideo } from "./JuridicoVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="VideoJuridico"
        component={JuridicoVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          titulo: "Seus Direitos",
          subtitulo: "Paulo Nascimento - Advocacia Integrada",
          topicos: [
            "Direito 1",
            "Direito 2",
            "Direito 3",
          ],
          corPrimaria: "#1a365d",
          corSecundaria: "#e2e8f0",
          corDestaque: "#d69e2e",
        }}
      />
      <Composition
        id="ReelsCondominial"
        component={JuridicoVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          titulo: "Direito Condominial",
          subtitulo: "Paulo Nascimento - Advocacia Integrada",
          topicos: [
            "Condomino inadimplente pode perder o imovel",
            "Multa de ate 2% por atraso",
            "Bem de familia NAO protege divida condominial",
          ],
          corPrimaria: "#1a365d",
          corSecundaria: "#e2e8f0",
          corDestaque: "#d69e2e",
        }}
      />
      <Composition
        id="ReelsTrabalhista"
        component={JuridicoVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          titulo: "Direito Trabalhista",
          subtitulo: "Paulo Nascimento - Advocacia Integrada",
          topicos: [
            "Fui demitido: quais meus direitos?",
            "Aviso previo de 30 a 90 dias",
            "FGTS + multa de 40%",
          ],
          corPrimaria: "#1a365d",
          corSecundaria: "#e2e8f0",
          corDestaque: "#d69e2e",
        }}
      />
    </>
  );
};
