import { useState, type ChangeEvent } from "react";
import { FileSpreadsheet, Upload, Info } from "lucide-react";

export default function ImportarArquivos() {
  const [titulosGerados, setTitulosGerados] = useState<File | null>(null);
  const [titulosPagos, setTitulosPagos] = useState<File | null>(null);

  function selecionarArquivo(
    evento: ChangeEvent<HTMLInputElement>,
    tipo: "gerados" | "pagos",
  ) {
    const arquivo = evento.target.files?.[0] ?? null;

    if (tipo === "gerados") {
      setTitulosGerados(arquivo);
    } else {
      setTitulosPagos(arquivo);
    }
  }

  const arquivosSelecionados = titulosGerados !== null && titulosPagos !== null;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#183B70]">Importar Arquivos</h1>
        <p className="mt-2 text-gray-500">
          Selecione os arquivos de títulos gerados e títulos pagos para preparar
          a análise dos resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <FileSpreadsheet className="mb-4 text-[#3F7DD9]" size={32} />

          <h2 className="mb-2 font-semibold">Títulos Gerados</h2>

          <p className="mb-4 text-sm text-gray-500">
            Selecione o arquivo contendo os títulos gerados.
          </p>

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(evento) => selecionarArquivo(evento, "gerados")}
            className="w-full text-sm"
          />

          {titulosGerados && (
            <p className="mt-3 break-all text-sm text-green-700">
              Selecionado: {titulosGerados.name}
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <FileSpreadsheet className="mb-4 text-[#3F7DD9]" size={32} />

          <h2 className="mb-2 font-semibold">Títulos Pagos</h2>

          <p className="mb-4 text-sm text-gray-500">
            Selecione o arquivo contendo os títulos pagos.
          </p>

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(evento) => selecionarArquivo(evento, "pagos")}
            className="w-full text-sm"
          />

          {titulosPagos && (
            <p className="mt-3 break-all text-sm text-green-700">
              Selecionado: {titulosPagos.name}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <button
          type="button"
          disabled
          className="flex items-center gap-2 rounded-lg bg-gray-300 px-5 py-3 font-medium text-gray-600"
        >
          <Upload size={18} />
          Importar e Analisar
        </button>

        <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
          <Info size={18} className="shrink-0" />
          <p>
            {arquivosSelecionados
              ? "Os dois arquivos foram selecionados. O processamento estará disponível após a integração com o Backend."
              : "Selecione os dois arquivos. A importação estará disponível após a integração com o Backend."}
          </p>
        </div>
      </div>
    </div>
  );
}
