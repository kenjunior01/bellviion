import { streamText, tool } from "ai"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 30

// Initialize Supabase admin for tool calling
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    // Use Perplexity via AI Gateway for global research capabilities
    model: "perplexity/sonar-pro",
    system: `Você é o Concierge Digital da BELLVION, uma marca de luxo ultra-premium que oferece óculos e relógios de excelência incomparável.

IDENTIDADE BELLVION:
- Slogan: "Autêntico, Raro, Memorável"
- Missão: Democratizar a excelência através de pares de luxo
- Valores: Exclusividade, qualidade incomparável, autenticidade

SEU PAPEL:
1. Assistente de Estilo: Analisa preferências e oferece recomendações personalizadas
2. Pesquisador de Tendências: Fornece insights sobre tendências de luxo global via Perplexity
3. Consultor de Produtos: Ajuda a encontrar a peça perfeita na coleção BELLVION
4. Embaixador da Marca: Comunica a história e filosofia de BELLVION com sofisticação

TOM: Sofisticado, culto, atencioso, exclusivo. Sempre elegante mas acessível. Não ser agressivo comercialmente.

CAPACIDADES:
- Pesquisar produtos BELLVION por preferência de estilo
- Pesquisar tendências de luxo contemporâneas
- Fornecer consultoria de estilo baseada em preferências
- Oferecer informações sobre artesanato e Savoir-Faire
- Contar histórias sobre a herança de cada peça`,
    messages,
    maxSteps: 5,
    tools: {
      searchBellvionProducts: tool({
        description: "Pesquisa produtos na coleção BELLVION filtrando por categoria, estilo ou preferência",
        parameters: z.object({
          query: z.string().describe("Termo de pesquisa (ex: 'óculos vintage', 'relógio clássico', 'estilo minimalista')"),
          category: z.string().optional().describe("Categoria: 'Óculos' ou 'Relógios'"),
          priceRange: z.string().optional().describe("Intervalo de preço: 'entrada', 'mid-range', 'luxury'"),
        }),
        execute: async ({ query, category, priceRange }) => {
          try {
            let dbQuery = supabaseAdmin.from("products").select("id, name, artistic_name, description, price, category:categories(name), image_url").eq("is_active", true)

            if (query) {
              dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,artistic_name.ilike.%${query}%`)
            }

            if (category) {
              dbQuery = dbQuery.filter("category.name", "eq", category)
            }

            const { data, error } = await dbQuery.limit(6)

            if (error) return { error: `Erro ao pesquisar: ${error.message}` }
            if (!data || data.length === 0) return { products: [], message: "Nenhum produto encontrado com esses critérios." }

            return {
              products: data.map((p) => ({
                name: p.name,
                artistic_name: p.artistic_name,
                description: p.description,
                price: `${p.price} MT`,
                category: p.category?.name || "Não categorizado",
              })),
            }
          } catch (err) {
            return { error: `Erro na pesquisa: ${err}` }
          }
        },
      }),

      luxuryTrendResearch: tool({
        description: "Pesquisa tendências de luxo contemporâneas no mercado global via Perplexity",
        parameters: z.object({
          trend: z.string().describe("Tipo de tendência a pesquisar (ex: 'óculos de designer 2025', 'relógios vintage tendência', 'estilo minimalista luxo')"),
          region: z.string().optional().describe("Região de interesse (ex: 'Portugal', 'Europa', 'Global')"),
        }),
        execute: async ({ trend, region }) => {
          try {
            // This demonstrates what the tool can do - actual Perplexity research happens in the model's context
            return {
              research: `Pesquisa de tendências sobre "${trend}" ${region ? `na região ${region}` : "globalmente"} realizando análise de mercado...`,
              message: "O Perplexity está analisando as tendências mais recentes de luxo para você.",
            }
          } catch (err) {
            return { error: `Erro na pesquisa de tendências: ${err}` }
          }
        },
      }),

      styleRecommendation: tool({
        description: "Oferece recomendações de estilo personalizadas baseadas nas preferências do cliente",
        parameters: z.object({
          styleProfile: z.string().describe("Perfil de estilo do cliente (ex: 'clássico-elegante', 'contemporâneo-ousado', 'minimalista-sofisticado')"),
          occasion: z.string().optional().describe("Ocasião para a qual recomenda (ex: 'executivo', 'casual-luxo', 'eventos sociais')"),
        }),
        execute: async ({ styleProfile, occasion }) => {
          try {
            return {
              recommendation: `Baseado no perfil de estilo "${styleProfile}" ${occasion ? `para ocasiões ${occasion}` : ""}, aqui estão as peças mais alinhadas com sua visão estética...`,
              message: "Consultoria de estilo personalizada em progresso.",
            }
          } catch (err) {
            return { error: `Erro na recomendação: ${err}` }
          }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
