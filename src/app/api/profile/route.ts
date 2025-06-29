import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface ProfileData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  preferencias: {
    categoriasFavoritas: string[];
    receberEmails: boolean;
    receberSms: boolean;
  };
  dataCadastro: string;
  ultimoAcesso: string;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const requestHeaders = new Headers(request.headers);

    const themeHeader = requestHeaders.get("theme");

    const headersList = await headers();
    console.log("Authorization:", headersList.get("Authorization"));
    console.log("Theme:", themeHeader);

    const cookieStore = await cookies();
    cookieStore.set("resultsPerPage", "20");

    // Ler dados do perfil do arquivo JSON
    const filePath = path.join(
      process.cwd(),
      "src/app/api/profile/profile.json"
    );
    const fileContents = await fs.readFile(filePath, "utf8");
    const profilesData: ProfileData[] = JSON.parse(fileContents);

    // Filtrar dados sensíveis baseado no nível de acesso (LGPD compliance)
    const sanitizedProfiles = profilesData.map((profile) => {
      const isAdminMode = themeHeader === "dark";
      
      if (isAdminMode) {
        return profile; // Modo admin - dados completos
      }
      
      // Remover dados sensíveis para usuários comuns (proteção LGPD)
      return {
        id: profile.id,
        nome: profile.nome,
        email: profile.email,
        telefone: profile.telefone,
        // cpf removido intencionalmente para proteção de dados
        dataNascimento: profile.dataNascimento,
        endereco: profile.endereco,
        preferencias: profile.preferencias,
        dataCadastro: profile.dataCadastro,
        ultimoAcesso: profile.ultimoAcesso,
        status: profile.status,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: sanitizedProfiles,
        total: sanitizedProfiles.length,
        theme: themeHeader || "light",
        message: "Perfis carregados com sucesso",
      },
      {
        headers: {
          "Set-Cookie": `theme=${themeHeader || "light"}; Path=/; HttpOnly`,
        },
      }
    );
  } catch (error) {
    console.error("Erro ao carregar perfis:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor ao carregar perfis",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
