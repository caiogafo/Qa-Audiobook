// Presets for analyzed literary works
const PRESETS = {
  beijo: {
    title: "O Beijo da Mulher-Aranha (Manuel Puig)",
    original: `[Pág 1] O beijo da mulher-aranha
[Pág 3] Manuel Puig. O beijo da mulher-aranha. Tradução: Sérgio Molina. Posfácio: Patricio Pron. Todavia.
[Pág 5] Sumário: O beijo da mulher-aranha 7. Precisamos das histórias para continuar vivendo, por Patricio Pron 281.
[Pág 7] Parte I
[Pág 9] I. - Tá na cara que tem algo estranho nela, que não é uma mulher como outra qualquer...
[Pág 75] 4. E esse é o início do romance entre Leni e o oficial...
[Pág 281] Precisamos das histórias para continuar vivendo, por Patricio Pron. Gostamos que nos contem histórias... Vários anos atrás, quando li este livro pela primeira vez...`,
    revised: `[Pág 1] O beijo da mulher-aranha
[Pág 2] INFOS GERAIS: Ponto de vista: narrativa construída... Tom: intimista...
[Pág 3] CAP 01 - PAG. 9 | CAP 02 - PÁG. 32 | CAP 03 - PÁG. 52 | CAP 05 - PÁG. 97 (OMISSÃO: CAP 04 AUSENTE NO SUMÁRIO)
[Pág 4] Audible Studios apresenta: O beijo da mulher-aranha. Escrito por Manuel Puig e narrado por [nome do narrador]
[Pág 5] Sumário...
[Pág 75] 4. E esse é o início do romance entre Leni e o oficial...
[Pág 281] Precisamos das histórias para continuar vivendo, por Patricio Pron.`,
    phonetics: [
      { word: "Irena", ipa: "i-RE-na", pagRev: "10", pagOrig: "12", lang: "Eslavo/Leste Europeu" },
      { word: "Budapeste", ipa: "bu-da-PES-te", pagRev: "9", pagOrig: "11", lang: "Húngaro" },
      { word: "Transilvânia", ipa: "tran-sil-VÂ-ni-a", pagRev: "9", pagOrig: "11", lang: "Romeno" },
      { word: "Jane Randolph", ipa: "djein REN-dolf", pagRev: "46", pagOrig: "48", lang: "Inglês" },
      { word: "robe de chambre", ipa: "rrob de CHAM-brr", pagRev: "17, 80", pagOrig: "19, 82", lang: "Francês" },
      { word: "maquis", ipa: "ma-KI", pagRev: "51, 75", pagOrig: "53, 77", lang: "Francês" },
      { word: "Tuileries / Tulherias", ipa: "tui-le-RI / tu-lhe-RI-as", pagRev: "50", pagOrig: "52", lang: "Francês" },
      { word: "Leni Lamaison", ipa: "LE-ni la-me-ZON", pagRev: "53, 82", pagOrig: "55, 84", lang: "Francês" },
      { word: "Werner", ipa: "VER-ner", pagRev: "83, 84", pagOrig: "85, 86", lang: "Alemão" },
      { word: "Goebbels", ipa: "GUÊ-bels", pagRev: "85", pagOrig: "87", lang: "Alemão" },
      { word: "Volk", ipa: "FOLK", pagRev: "83", pagOrig: "85", lang: "Alemão" },
      { word: "Mosel", ipa: "MO-zel", pagRev: "85", pagOrig: "87", lang: "Alemão" },
      { word: "Tobis-Berlin", ipa: "TO-bis ber-LIN", pagRev: "82", pagOrig: "84", lang: "Alemão" },
      { word: "Palatinado", ipa: "pa-la-ti-NA-do", pagRev: "55, 88", pagOrig: "57, 90", lang: "Alemão/Topônimo" },
      { word: "Jacob Levy", ipa: "ya-KOB LE-vi", pagRev: "87", pagOrig: "89", lang: "Hebraico/Alemão" },
      { word: "Yang-Tsé-kiang", ipa: "yang-tse-ki-ANG", pagRev: "86", pagOrig: "88", lang: "Chinês" },
      { word: "petit hotel", ipa: "pe-TI o-TEL", pagRev: "55", pagOrig: "57", lang: "Francês" },
      { word: "déshabillé", ipa: "de-za-bi-IÊ", pagRev: "75", pagOrig: "77", lang: "Francês" },
      { word: "capelina", ipa: "ca-pe-LI-na", pagRev: "74", pagOrig: "76", lang: "Espanhol/Francês" },
      { word: "soirée", ipa: "sua-RÊ", pagRev: "106", pagOrig: "108", lang: "Francês" },
      { word: "grand monde", ipa: "gran MOND", pagRev: "116", pagOrig: "118", lang: "Francês" },
      { word: "aplomb", ipa: "a-PLON", pagRev: "122", pagOrig: "124", lang: "Francês" },
      { word: "Sparafucile", ipa: "spa-ra-fu-TCHI-le", pagRev: "23", pagOrig: "25", lang: "Italiano (Ópera)" },
      { word: "saluti tanti, arrivederci", ipa: "sa-LU-ti TAN-ti, a-rri-ve-DER-tchi", pagRev: "23", pagOrig: "25", lang: "Italiano" },
      { word: "mantequilla", ipa: "man-te-KI-lha", pagRev: "18", pagOrig: "20", lang: "Espanhol" },
      { word: "Caballito", ipa: "ca-ba-LHI-to", pagRev: "46", pagOrig: "48", lang: "Espanhol (Buenos Aires)" },
      { word: "Criollitas", ipa: "cri-o-LHI-tas", pagRev: "156", pagOrig: "158", lang: "Espanhol" },
      { word: "Mario Clavel", ipa: "MA-rio cla-VEL", pagRev: "136", pagOrig: "138", lang: "Espanhol" },
      { word: "Agustín Lara", ipa: "a-gus-TIN LA-ra", pagRev: "136", pagOrig: "138", lang: "Espanhol" },
      { word: "surplus repression", ipa: "SER-ples re-PRE-shen", pagRev: "163", pagOrig: "165", lang: "Inglês Teórico" },
      { word: "D. J. West", ipa: "di-djei UEST", pagRev: "60, 96", pagOrig: "62, 98", lang: "Inglês (Autor)" },
      { word: "Swyer", ipa: "SUAI-er", pagRev: "60", pagOrig: "62", lang: "Inglês (Autor)" },
      { word: "Barahal", ipa: "ba-ra-RAL", pagRev: "61", pagOrig: "63", lang: "Autor Teórico" },
      { word: "Lang", ipa: "LANG", pagRev: "62", pagOrig: "64", lang: "Alemão/Inglês" },
      { word: "Pare", ipa: "PEIR", pagRev: "63", pagOrig: "65", lang: "Inglês (Autor)" },
      { word: "Money", ipa: "MÂ-ni", pagRev: "63", pagOrig: "65", lang: "Inglês (Autor)" },
      { word: "Kallman", ipa: "KAL-man", pagRev: "63", pagOrig: "65", lang: "Alemão/Inglês" },
      { word: "Gibbons", ipa: "GUI-bons", pagRev: "97", pagOrig: "99", lang: "Inglês (Autor)" },
      { word: "Fenichel", ipa: "FE-ni-shel", pagRev: "135, 202", pagOrig: "137, 204", lang: "Alemão/Psicanálise" },
      { word: "Marcuse", ipa: "mar-CU-ze", pagRev: "149, 162", pagOrig: "151, 164", lang: "Alemão/Filosofia" },
      { word: "Wilhelm Reich", ipa: "VIL-helm RAISH", pagRev: "149", pagOrig: "151", lang: "Alemão/Psicanálise" },
      { word: "Otto Rank", ipa: "O-to RANK", pagRev: "148", pagOrig: "150", lang: "Alemão/Psicanálise" },
      { word: "Rattray Taylor", ipa: "RA-trei TEI-lor", pagRev: "149", pagOrig: "151", lang: "Inglês (Autor)" },
      { word: "Norman O. Brown", ipa: "NOR-man ou BRAUN", pagRev: "150, 162", pagOrig: "152, 164", lang: "Inglês (Autor)" },
      { word: "Kate Millett", ipa: "keit MI-let", pagRev: "164", pagOrig: "166", lang: "Inglês (Autora)" },
      { word: "Unwin", ipa: "ÂN-uin", pagRev: "165", pagOrig: "167", lang: "Inglês (Autor)" },
      { word: "Anneli Taube", ipa: "a-NE-li TAU-be", pagRev: "203", pagOrig: "205", lang: "Dinamarquês/Fictício" },
      { word: "Flugel", ipa: "FLU-guel", pagRev: "191", pagOrig: "193", lang: "Alemão/Inglês" },
      { word: "Theodore Roszak", ipa: "TI-o-dor RO-zak", pagRev: "193", pagOrig: "195", lang: "Inglês (Autor)" }
    ],
    footnotes: [
      { cap: "Capítulo 3", pRev: "60-63", pOrig: "62-65", topic: "D. J. West: teorias físicas e biológicas da homossexualidade (hormonais, genéticas e intersexuais)." },
      { cap: "Capítulo 4", pRev: "82-90", pOrig: "84-92", topic: "Tobis-Berlin: Dossiê de propaganda nazista do filme 'Destino', com Leni Lamaison e Werner." },
      { cap: "Capítulo 5", pRev: "96-98", pOrig: "98-100", topic: "Teorias populares (perversão, sedução e segregação) e introdução à libido de Freud." },
      { cap: "Capítulo 6", pRev: "127-129", pOrig: "129-131", topic: "Anna Freud e Freud: latência, bissexualidade infantil e complexo de Édipo." },
      { cap: "Capítulo 7", pRev: "135-137", pOrig: "137-139", topic: "Otto Fenichel e Freud: identificação materna, narcisismo e fases oral/anal/genital." },
      { cap: "Capítulo 8", pRev: "148-151", pOrig: "150-153", topic: "Patriarcado, moral judaico-cristã, Wilhelm Reich, Marcuse e Norman O. Brown." },
      { cap: "Capítulo 9", pRev: "162-165", pOrig: "164-167", topic: "Sublimação vs 'surplus repression' de Marcuse, Kate Millett e J. C. Unwin (Sexo e Cultura)." },
      { cap: "Capítulo 10", pRev: "191-193", pOrig: "193-195", topic: "Rejeição social, Flugel (personalidade autoritária), Altman e Theodore Roszak." },
      { cap: "Capítulo 11", pRev: "202-206", pOrig: "204-208", topic: "Dra. Anneli Taube: homossexualidade como recusa revolucionária da opressão paterna." }
    ],
    structuralNotes: "OMISSÃO CRÍTICA NO SUMÁRIO: Na página 3 do arquivo revisado, a tabela pula do CAP 03 direto para o CAP 05 (o CAP 04 foi esquecido no sumário, apesar de constar no miolo na página 75). Além disso, a página 3 original (folha de rosto com créditos de tradução e posfácio) foi omitida no revisado."
  },
  mercadoria: {
    title: "A Mercadoria Mais Preciosa (Jean-Claude Grumberg)",
    original: `[Pág 1] A mercadoria mais preciosa
[Pág 3] Jean-Claude Grumberg. A mercadoria mais preciosa. Uma fábula. Tradução: Rosa Freire d'Aguiar. Todavia.
[Pág 5] I. Era uma vez, num grande bosque, uma pobre lenhadora e um pobre lenhador...
[Pág 75] Apêndice para amantes de histórias verdadeiras. O comboio número 45 partiu de Drancy...
[Pág 77] Ficha Catalográfica / CIP e Créditos de Tradução / Edição Todavia.
[Pág 78] Colofão: Fonte Register, papel Munken print cream 80 g/m2, impressão Geográfica.`,
    revised: `[Pág 1] Jean-Claude Grumberg. A mercadoria mais preciosa. Uma fábula. Tradução: Rosa Freire d'Aguiar. Todavia.
[Pág 2] INFOS GERAIS: Ponto de vista: narrador em terceira pessoa...
[Pág 3] CAP 01 - PAGS. 5 A 8 | CAP 02 - PÁGS. 9 A 14 ... APÊNDICE - PÁGS. 75
[Pág 4] Audible Studios apresenta: A mercadoria mais preciosa. Escrito por Jean-Claude Grumberg e narrado por [nome do narrador]
[Pág 5] I. Era uma vez...
[Pág 67] Apêndice...
[Pág 68] Essa é uma produção Audible Studios do livro A mercadoria mais preciosa...`,
    phonetics: [
      { word: "kasha", ipa: "KA-sha", pagRev: "17", pagOrig: "17", lang: "Russo (Culinária)" },
      { word: "chapka", ipa: "CHÁP-ka", pagRev: "29", pagOrig: "29", lang: "Russo (Vestuário)" },
      { word: "Drancy", ipa: "dran-SI", pagRev: "9, 67", pagOrig: "9, 75", lang: "Francês (Campo de concentração)" },
      { word: "Pithiviers", ipa: "pi-ti-vi-Ê", pagRev: "9", pagOrig: "9", lang: "Francês (Campo de trânsito)" },
      { word: "Iassi", ipa: "IÁ-ssi", pagRev: "13", pagOrig: "13", lang: "Romeno (Pogrom)" },
      { word: "papuch / mamuch", ipa: "pa-PUTCH / ma-MUTCH", pagRev: "45", pagOrig: "49", lang: "Eslavo/Afetuoso" },
      { word: "Bobigny-Gare", ipa: "bo-bi-NHI GAR", pagRev: "24", pagOrig: "25", lang: "Francês" },
      { word: "Zacharie", ipa: "za-ka-RI", pagRev: "67", pagOrig: "75", lang: "Francês/Hebraico" },
      { word: "Naphtali", ipa: "naf-ta-LI", pagRev: "67", pagOrig: "75", lang: "Hebraico" },
      { word: "Klarsfeld", ipa: "KLARS-feld", pagRev: "67", pagOrig: "75", lang: "Alemão/Francês" }
    ],
    footnotes: [
      { cap: "Capítulo 3", pRev: "17", pOrig: "17", topic: "Nota da Tradutora [N.T.]: Explicação sobre 'kasha' (prato russo à base de trigo-sarraceno)." },
      { cap: "Capítulo 6", pRev: "28", pOrig: "29", topic: "Nota da Edição [N.E.]: Definição de 'chapka' (gorro de pele típico do Leste Europeu)." }
    ],
    structuralNotes: "DIVERGÊNCIAS DETECTADAS: A página 1 original (Falsa Folha de Rosto) e as páginas finais 77 (Ficha Catalográfica / CIP completa) e 78 (Colofão tipográfico) foram omitidas no arquivo revisado. Por outro lado, foram criadas páginas exclusivas de audiolivro (Guia de Narração, Mapeamento de Capítulos e Créditos de Abertura/Encerramento da Audible)."
  }
};
