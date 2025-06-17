const coelhoSavassiSentinels = [
  {
    id: 'acamado',
    text: 'Toda pessoa restrita ao seu domicílio, por falta de habilidade e/ou incapacidade de locomoção por si só a qualquer unidade de saúde.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Acamado'
  },
  {
    id: 'deficienciaFisica',
    text: 'Condição física de longa duração ou permanente que dificulta ou impede a realização de determinadas atividades cotidianas, escolares, de trabalho ou de lazer.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Deficiência física'
  },
  {
    id: 'deficienciaMental',
    text: 'Condição mental de longa duração ou permanente que dificulta ou impede a realização de determinadas atividades cotidianas, escolares, de trabalho ou de lazer.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Deficiência mental'
  },
  {
    id: 'baixasCondicoesSaneamento',
    text: 'Saneamento implica o controle dos fatores do meio físico do homem que podem exercer efeitos prejudiciais à sua saúde.',
    points: 3,
    type: 'checkbox',
    allowQuantity: false,
    riskName: 'Baixas condições de saneamento'
  },
  {
    id: 'desnutricaoGrave',
    text: 'Percentil menor que 0,1 e/ou peso muito baixo para a idade, caracterizando desnutrição grave.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Desnutrição (grave)'
  },
  {
    id: 'drogadiccao',
    text: 'Utilização compulsiva de drogas lícitas ou ilícitas que apresentem potencial para causar dependência química (álcool, tabaco, benzodiazepínicos, barbitúricos e outras).',
    points: 2,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Drogadição'
  },
  {
    id: 'desemprego',
    text: 'Situação na qual a pessoa não está exercendo nenhuma ocupação remunerada. A realização de tarefas domésticas é considerada ocupação.',
    points: 2,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Desemprego'
  },
  {
    id: 'analfabetismo',
    text: 'Pessoa que, a partir da idade escolar, não sabe ler nem escrever um bilhete simples, e/ou que sabe apenas assinar o próprio nome.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Analfabetismo'
  },
  {
    id: 'menorDe6Meses',
    text: 'Lactente com idade até 5 meses e 29 dias.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Menor de 6 meses'
  },
  {
    id: 'maiorDe70Anos',
    text: 'Toda pessoa com 70 anos completos ou mais.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Maior de 70 anos'
  },
  {
    id: 'hipertensaoArterial',
    text: 'Pressão arterial sistólica ? 140mmHg e/ou pressão arterial diastólica ? 90mmHg, em indivíduos que não usam medicação anti-hipertensiva.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Hipertensão Arterial Sistêmica'
  },
  {
    id: 'diabetesMellitus',
    text: 'Grupo de doenças metabólicas caracterizadas por hiperglicemia e associadas a complicações, disfunções e insuficiência de vários órgãos.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Diabetes Mellitus'
  },
  {
    id: 'relacaoMoradorComodo',
    riskName: 'Relação morador/cômodo',
    textDefinition: 'Número de moradores do domicílio dividido pelo número de cômodos (excluindo banheiros e corredores). Pontuação: >1 = 3 pts; =1 = 2 pts; <1 = 1 pt.',
    type: 'customMoradorComodo',
    getPoints: (moradores, comodos) => {
      const relacao = moradores / comodos;
      if (relacao > 1) return 3;
      if (relacao === 1) return 2;
      return 1;
    }
  }
];

const getRiskLevelDetails = (score) => {
  if (score >= 9) return { level: 'R3 - Risco Alto', className: 'risk-max' };
  if (score >= 7) return { level: 'R2 - Risco Médio', className: 'risk-medium' };
  if (score >= 5) return { level: 'R1 - Risco Baixo', className: 'risk-low' };
  return { level: 'Risco Habitual', className: 'risk-very-low' };
}

const calculateCoelhoSavassi = (householdData) => {
    if (!householdData) {
        return { totalScore: 0, analyzedRisks: [], riskDetails: getRiskLevelDetails(0) };
    }

    let score = 0;
    const risks = [];
    const scaleData = householdData.coelhoSavassiScaleData || {};

    coelhoSavassiSentinels.forEach((sentinel) => {
      if (sentinel.type === "checkbox" && scaleData[sentinel.id]?.checked) {
        const quantity = sentinel.allowQuantity
          ? parseInt(scaleData[sentinel.id].quantity, 10) || 1
          : 1;
        score += sentinel.points * quantity;
        risks.push(
          `${sentinel.riskName} (${sentinel.points * quantity})`
        );
      }
    });

    const numMoradores = parseInt(householdData.numberOfResidents, 10) || parseInt(scaleData.numMoradores, 10) || 0;
    const numComodos = parseInt(householdData.numComodos, 10) || parseInt(scaleData.numComodos, 10) || 0;

    const moradorComodoSentinel = coelhoSavassiSentinels.find(s => s.type === 'customMoradorComodo');
    if (moradorComodoSentinel && numMoradores > 0 && numComodos > 0) {
        const relacao = numMoradores / numComodos;
        let pontosRelacao = 0;
        if (relacao > 1) pontosRelacao = 3;
        else if (relacao === 1) pontosRelacao = 2;
        else pontosRelacao = 1;

        score += pontosRelacao;
        risks.push(`${moradorComodoSentinel.riskName} (${pontosRelacao})`);
    }

    return {
      totalScore: score,
      analyzedRisks: risks,
      riskDetails: getRiskLevelDetails(score),
    };
}

export default {
    coelhoSavassiSentinels,
    getRiskLevelDetails,
    calculateCoelhoSavassi
};