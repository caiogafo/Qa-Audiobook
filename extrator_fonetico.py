#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
EXTRATOR FONÉTICO E DETECTOR DE ESCRITAS DIFERENTES / ESTRANGEIRISMOS
Para Roteiros de Audiolivros (Audible Studios & Storytel)
=============================================================================
Uso:
    python3 extrator_fonetico.py livro.pdf
    python3 extrator_fonetico.py manuscrito.txt
    python3 extrator_fonetico.py livro.pdf -o termos_foneticos.json

Funcionalidades:
 1. Extração ultrarrápida de PDF via pdftotext ou leitura de TXT.
 2. Filtragem contra vocabulário comum do português e nomes brasileiros.
 3. Detecção de dígrafos e padrões fonéticos estrangeiros (sch, tz, cz, sz, w, k, y, etc.).
 4. Agrupamento de grafias diferentes da mesma palavra (Fuzzy Matching / Levenshtein).
 5. Geração de pronúncia sugerida no padrão Audible [FO-NÉ-TI-CA].
 6. Exportação em JSON pronta para importar na interface web do QA-Audiobook.
"""

import sys
import os
import re
import json
import difflib
import subprocess
from collections import Counter, defaultdict

# Dicionário de Pronúncias Consagradas (Filosofia, Literatura e Nomes Globais)
DICIONARIO_FONETICO_BASE = {
    # Filósofos e autores clássicos
    "chrysippos": "kri-SÍ-pos",
    "chrysippus": "kri-SÍ-pus",
    "crisipo": "kri-SÍ-po",
    "cleanthes": "kle-AN-tes",
    "cleantes": "kle-AN-tes",
    "zeno": "ZÊ-no",
    "zenão": "ze-NÃO",
    "epicteto": "e-pik-TÊ-to",
    "epictetus": "e-pik-TÊ-tus",
    "musonius": "mu-SÔ-ni-us",
    "marcus aurelius": "MAR-kus au-RÊ-lius",
    "hierocles": "ie-RÔ-kles",
    "posidonius": "po-si-DÔ-nius",
    "panaetius": "pa-NÉ-tius",
    "prohairesis": "pro-ai-RÊ-sis",
    "prohairetico": "pro-ai-RÉ-ti-co",
    "hegemonikon": "e-gue-mo-ni-KON",
    "ataraxia": "a-ta-rak-SÍ-a",
    "eudaimonia": "eu-dai-mo-NÍ-a",
    "amor fati": "a-MOR FÁ-ti",
    "memento mori": "me-MEN-to MÔ-ri",
    "apatheia": "a-pa-TÊ-ia",
    "kathekon": "ka-tê-KON",
    
    # Nomes e autores internacionais
    "sydney": "SÍD-ni",
    "nietzsche": "NI-tche",
    "schopenhauer": "chô-pen-RÁU-er",
    "kierkegaard": "KIR-ke-gard",
    "dostoievski": "dos-to-i-ÉF-ski",
    "dostoiévski": "dos-to-i-ÉF-ski",
    "dostoievsky": "dos-to-i-ÉF-ski",
    "tolstoi": "tols-TÓI",
    "tolstoy": "tols-TÓI",
    "stendhal": "sten-DÁL",
    "baudelaire": "bô-de-LÉR",
    "proust": "PRUST",
    "flaubert": "flô-BÉR",
    "camus": "ka-MI",
    "sartre": "SART-re",
    "montaigne": "mon-TÉ-nhe",
    "rousseau": "ru-SÔ",
    "voltaire": "vol-TÉR",
    "kafka": "KÁF-ka",
    "rilke": "RÍL-ke",
    "goethe": "GÊ-te",
    "shakespeare": "chêiks-PIR",
    "byron": "BAI-ron",
    "freud": "FRÓID",
    "jung": "IUNG",
    "csikszentmihalyi": "chik-sent-mi-RÁI",
    "kahneman": "KÁ-ne-man",
    "taleb": "TA-leb",
    "foucault": "fu-KÔ",
    "deleuze": "de-LÊZ",
    "derrida": "de-ri-DÁ",
    "heidegger": "RÁI-de-guer",
    "husserl": "RU-serl",
    "wittgenstein": "VIT-ghen-stain",
    "harari": "ra-RA-ri",
    "murakami": "mu-ra-KA-mi",
    "orwell": "OR-uel",
    "huxley": "RÂKS-li",
    "hemingway": "RÉ-ming-uei",
    "fitzgerald": "fits-DJÉ-rald",
    "poe": "POU",
    "whitman": "RÜÍ-tman",
    "emerson": "É-mer-son",
    "thoreau": "to-RÔ"
}

# Nomes brasileiros comuns e palavras em português a ignorar
EXCLUSOES_PT = {
    # Nomes e Sobrenomes brasileiros comuns
    "silva", "santos", "oliveira", "souza", "sousa", "rodrigues", "ferreira", "alves", "pereira",
    "lima", "gomes", "costa", "ribeiro", "martins", "carvalho", "almeida", "lopes", "soares",
    "fernandes", "vieira", "barbosa", "rocha", "dias", "nascimento", "andrade", "moreira", "nunes",
    "marques", "machado", "mendes", "freitas", "cardoso", "ramos", "goncalves", "santana", "teixeira",
    "araujo", "pessoa", "castro", "barros", "moura", "pinto", "cavalcanti", "monteiro", "correia",
    "katia", "cátia", "carlos", "joão", "joao", "maria", "ana", "paulo", "pedro", "lucas", "gabriel",
    "marcos", "marco", "aurelio", "aurélio", "luiz", "luís", "antônio", "antonio", "francisco", "josé",
    "jose", "jorge", "sena", "clarice", "lispector", "machado", "assis", "drummond", "guimarães", "rosa",
    "rio", "janeiro", "brasil", "brasileiro", "brasileira", "portugal", "lisboa", "porto",
    
    # Palavras do cotidiano incorporadas / não problemáticas
    "show", "shows", "rock", "jazz", "blues", "pop", "jeans", "shopping", "site", "sites", "email",
    "online", "offline", "feedback", "download", "link", "links", "post", "posts", "design", "designer",
    "podcast", "podcasts", "app", "apps", "smartphone", "wi-fi", "wifi", "internet", "web", "mouse",
    
    # Termos comuns do texto/gramática
    "capitulo", "capítulo", "parte", "introdução", "prefácio", "prólogo", "epílogo", "glossário",
    "livro", "autor", "autora", "editor", "editora", "leitor", "leitora", "obra", "texto", "página",
    "como", "quando", "onde", "porque", "porquê", "quem", "qual", "quais", "muito", "mais", "menos",
    "ela", "ele", "eles", "elas", "você", "vocês", "nós", "isso", "isto", "aquilo", "aquele", "aquela",
    "era", "eram", "tinha", "tinham", "havia", "foram", "seria", "seriam", "estava", "estavam",
    "primeiro", "segundo", "terceiro", "quarto", "quinto", "último", "antigo", "novo", "moderno",
    "sempre", "nunca", "ainda", "depois", "antes", "durante", "enquanto", "então", "assim", "portanto",
    "mesmo", "mesma", "próprio", "própria", "apenas", "somente", "quase", "tudo", "nada", "todos", "todas"
}

import unicodedata

# Padrões que indicam forte probabilidade de origem estrangeira
PADROES_ESTRANGEIROS = re.compile(
    r'(sch|tz|cz|sz|stein|berg|sky|ski|off|itch|eau|ight|ph|th|wh|sh|gh|'
    r'chrys|zeno|cleanth|nietz|dostoi|freud|jung|csik|kahn|taleb|wittg|'
    r'[wky]|ō|ū|ü|ö|ä|ë)',
    re.IGNORECASE
)

def normalizar_palavra(w):
    """Remove pontuações e acentos para comparação estrita."""
    if not w:
        return ""
    sem_acento = ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', sem_acento)

# Pré-computa conjuntos normalizados
EXCLUSOES_PT_NORM = {normalizar_palavra(w) for w in EXCLUSOES_PT}
DICIONARIO_FONETICO_BASE_NORM = {normalizar_palavra(k): v for k, v in DICIONARIO_FONETICO_BASE.items()}

def extrair_texto(caminho_arquivo):
    """Lê PDF via pdftotext ou lê arquivo TXT direto."""
    if caminho_arquivo.lower().endswith('.pdf'):
        print(f"📖 Extraindo texto de '{caminho_arquivo}' via pdftotext...")
        try:
            res = subprocess.run(['pdftotext', '-layout', caminho_arquivo, '-'],
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                 text=True, encoding='utf-8', errors='ignore', check=True)
            return res.stdout
        except Exception as e:
            print(f"⚠️ Erro ao rodar pdftotext: {e}")
            print("Tentando leitura direta...")
            with open(caminho_arquivo, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
    else:
        print(f"📖 Lendo arquivo de texto '{caminho_arquivo}'...")
        with open(caminho_arquivo, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()

def sugerir_fonetica(palavra):
    """Retorna a pronúncia consagrada ou gera uma sugestão aproximada."""
    norm = normalizar_palavra(palavra)
    if norm in DICIONARIO_FONETICO_BASE_NORM:
        return DICIONARIO_FONETICO_BASE_NORM[norm]
    
    # Heurística de apoio fonético se não estiver no dicionário
    sug = palavra.replace('sch', 'ch').replace('ph', 'f').replace('th', 't')
    sug = sug.replace('w', 'u').replace('y', 'i')
    # Se terminar em consoante forte, acentua a penúltima sílaba
    return sug.upper()

def analisar_manuscrito(texto):
    """
    Analisa o texto do livro procurando palavras raras, nomes estrangeiros
    e possíveis grafias duplicadas/diferentes.
    """
    # 1. Isola sentenças e parágrafos
    linhas = texto.splitlines()
    
    # 2. Extrai palavras com maiúsculas no meio da frase (nomes próprios ou estrangeirismos)
    tokens_com_contexto = []
    ocorrencias = Counter()
    contextos = defaultdict(list)
    
    # Regex para capturar palavras capitalizadas ou com letras estrangeiras
    palavra_regex = re.compile(r'\b[A-ZÁ-Úa-zá-ú][a-zá-úA-ZÁ-Ú\-]{2,}\b')
    
    for num_linha, linha in enumerate(linhas, 1):
        linha_limpa = linha.strip()
        if not linha_limpa or len(linha_limpa) < 2:
            continue
            
        # Pula cabeçalhos puros de capítulo ou números isolados
        if re.match(r'^\d+$', linha_limpa) or re.match(r'^(Capítulo|Parte)\s+\d+', linha_limpa, re.I):
            continue
            
        matches = palavra_regex.finditer(linha_limpa)
        for m in matches:
            pal = m.group(0)
            norm = normalizar_palavra(pal)
            
            # Pula exclusões e palavras muito curtas
            if norm in EXCLUSOES_PT_NORM or len(norm) < 3:
                continue
                
            # Verifica se começa com maiúscula ou tem caracteres estrangeiros
            tem_maiuscula = pal[0].isupper()
            tem_estrangeiro = bool(PADROES_ESTRANGEIROS.search(norm))
            
            # Se a palavra for a primeira da frase e não tem padrão estrangeiro, pode ser apenas início de frase
            e_inicio_linha = (m.start() == 0)
            if e_inicio_linha and not tem_estrangeiro and norm not in DICIONARIO_FONETICO_BASE_NORM:
                continue
                
            if tem_estrangeiro or norm in DICIONARIO_FONETICO_BASE_NORM or (tem_maiuscula and not e_inicio_linha):
                ocorrencias[pal] += 1
                if len(contextos[pal]) < 3:
                    # Salva contexto curto da frase
                    inicio_ctx = max(0, m.start() - 30)
                    fim_ctx = min(len(linha_limpa), m.end() + 30)
                    trecho = linha_limpa[inicio_ctx:fim_ctx].replace('\n', ' ')
                    contextos[pal].append(f"...{trecho}...")

    # 3. Agrupamento por Grafias Diferentes / Variações (Fuzzy Matching)
    todas_palavras = list(ocorrencias.keys())
    variacoes_detectadas = []
    processadas = set()

    for i, w1 in enumerate(todas_palavras):
        if w1.lower() in processadas:
            continue
        similares = difflib.get_close_matches(w1, todas_palavras[i+1:], n=3, cutoff=0.75)
        # Filtra falsos positivos (ex: variações de gênero do mesmo nome ou quase idênticas)
        similares_reais = [s for s in similares if s.lower() != w1.lower() and len(s) > 3]
        if similares_reais:
            variacoes_detectadas.append({
                "principal": w1,
                "variacoes": similares_reais,
                "ocorrencias_principal": ocorrencias[w1],
                "ocorrencias_variacoes": {s: ocorrencias[s] for s in similares_reais}
            })
            for s in similares_reais:
                processadas.add(s.lower())

    # 4. Monta lista final de termos sugeridos
    termos_resultado = []
    
    # Ordena por frequência decrescente
    for palavra, count in ocorrencias.most_common():
        norm = normalizar_palavra(palavra)
        # Prioriza palavras com padrão estrangeiro ou no dicionário consagrado
        if bool(PADROES_ESTRANGEIROS.search(norm)) or norm in DICIONARIO_FONETICO_BASE_NORM:
            fonetica = sugerir_fonetica(palavra)
            termos_resultado.append({
                "word": palavra,
                "ipa": fonetica,
                "ocorrencias": count,
                "contexto": contextos[palavra][0] if contextos[palavra] else ""
            })

    return termos_resultado, variacoes_detectadas

def main():
    if len(sys.argv) < 2:
        print("=" * 70)
        print("  EXTRATOR FONÉTICO E DETECTOR DE ESCRITAS DIFERENTES (AUDIOLIVROS)")
        print("=" * 70)
        print("Uso:")
        print("  python3 extrator_fonetico.py caminho/do/livro.pdf")
        print("  python3 extrator_fonetico.py caminho/do/texto.txt -o termos_foneticos.json")
        print("=" * 70)
        sys.exit(1)

    caminho = sys.argv[1]
    saida_json = "termos_foneticos.json"
    if "-o" in sys.argv:
        idx = sys.argv.index("-o")
        if idx + 1 < len(sys.argv):
            saida_json = sys.argv[idx + 1]

    if not os.path.exists(caminho):
        print(f"❌ Erro: Arquivo '{caminho}' não encontrado.")
        sys.exit(1)

    texto = extrair_texto(caminho)
    if not texto or len(texto.strip()) == 0:
        print("❌ Erro: O arquivo não contém texto legível.")
        sys.exit(1)

    print(f"🔍 Analisando vocabulário ({len(texto.split())} palavras)...")
    termos, variacoes = analisar_manuscrito(texto)

    print("\n" + "=" * 70)
    print(f"✦ TERMOS ESTRANGEIROS / NOMES DETECTADOS ({len(termos)} termos)")
    print("=" * 70)
    for t in termos[:25]:
        print(f"  • {t['word']:<22} [{t['ipa']}]  ({t['ocorrencias']}x no livro)")
        if t['contexto']:
            print(f"    ↳ Contexto: {t['contexto']}")

    if len(termos) > 25:
        print(f"  ... e mais {len(termos) - 25} termos no arquivo JSON.")

    if variacoes:
        print("\n" + "=" * 70)
        print("⚠️ GRAFIAS DIFERENTES DETECTADAS PARA O MESMO NOME (ATENÇÃO DE REVISÃO)")
        print("=" * 70)
        for v in variacoes:
            vars_str = ", ".join([f"'{s}' ({v['ocorrencias_variacoes'][s]}x)" for s in v['variacoes']])
            print(f"  • Principal: '{v['principal']}' ({v['ocorrencias_principal']}x) <--> Variações: {vars_str}")
            print(f"    ↳ Dica QA: Padronizar se for o mesmo personagem/conceito no áudio!")

    # Salva arquivo JSON
    with open(saida_json, 'w', encoding='utf-8') as f:
        json.dump(termos, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 70)
    print(f"✅ Arquivo salvo: {saida_json}")
    print("   Você pode importar este arquivo diretamente na aba do Roteiro no navegador!")
    print("=" * 70)

if __name__ == "__main__":
    main()
