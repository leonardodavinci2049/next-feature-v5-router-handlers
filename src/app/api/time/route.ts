export const dynamic = "force-static";
export const revalidate = 10;

export async function GET() {
  return Response.json({ 
    time: new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo'
    })
  });
}
