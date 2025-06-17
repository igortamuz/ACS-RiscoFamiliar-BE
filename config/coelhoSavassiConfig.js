const coelhoSavassiSentinels = [
  {
    id: 'acamado',
    text: 'Toda pessoa restrita ao seu domic�lio, por falta de habilidade e/ou incapacidade de locomo��o por si s� a qualquer unidade de sa�de.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Acamado'
  },
  {
    id: 'deficienciaFisica',
    text: 'Condi��o f�sica de longa dura��o ou permanente que dificulta ou impede a realiza��o de determinadas atividades cotidianas, escolares, de trabalho ou de lazer.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Defici�ncia f�sica'
  },
  {
    id: 'deficienciaMental',
    text: 'Condi��o mental de longa dura��o ou permanente que dificulta ou impede a realiza��o de determinadas atividades cotidianas, escolares, de trabalho ou de lazer.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Defici�ncia mental'
  },
  {
    id: 'baixasCondicoesSaneamento',
    text: 'Saneamento implica o controle dos fatores do meio f�sico do homem que podem exercer efeitos prejudiciais � sua sa�de.',
    points: 3,
    type: 'checkbox',
    allowQuantity: false,
    riskName: 'Baixas condi��es de saneamento'
  },
  {
    id: 'desnutricaoGrave',
    text: 'Percentil menor que 0,1 e/ou peso muito baixo para a idade, caracterizando desnutri��o grave.',
    points: 3,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Desnutri��o (grave)'
  },
  {
    id: 'drogadiccao',
    text: 'Utiliza��o compulsiva de drogas l�citas ou il�citas que apresentem potencial para causar depend�ncia qu�mica (�lcool, tabaco, benzodiazep�nicos, barbit�ricos e outras).',
    points: 2,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Drogadi��o'
  },
  {
    id: 'desemprego',
    text: 'Situa��o na qual a pessoa n�o est� exercendo nenhuma ocupa��o remunerada. A realiza��o de tarefas dom�sticas � considerada ocupa��o.',
    points: 2,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Desemprego'
  },
  {
    id: 'analfabetismo',
    text: 'Pessoa que, a partir da idade escolar, n�o sabe ler nem escrever um bilhete simples, e/ou que sabe apenas assinar o pr�prio nome.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Analfabetismo'
  },
  {
    id: 'menorDe6Meses',
    text: 'Lactente com idade at� 5 meses e 29 dias.',
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
    text: 'Press�o arterial sist�lica ? 140mmHg e/ou press�o arterial diast�lica ? 90mmHg, em indiv�duos que n�o usam medica��o anti-hipertensiva.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Hipertens�o Arterial Sist�mica'
  },
  {
    id: 'diabetesMellitus',
    text: 'Grupo de doen�as metab�licas caracterizadas por hiperglicemia e associadas a complica��es, disfun��es e insufici�ncia de v�rios �rg�os.',
    points: 1,
    type: 'checkbox',
    allowQuantity: true,
    riskName: 'Diabetes Mellitus'
  },
  {
    id: 'relacaoMoradorComodo',
    riskName: 'Rela��o morador/c�modo',
    textDefinition: 'N�mero de moradores do domic�lio dividido pelo n�mero de c�modos (excluindo banheiros e corredores). Pontua��o: >1 = 3 pts; =1 = 2 pts; <1 = 1 pt.',
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
  if (score >= 7) return { level: 'R2 - Risco M�dio', className: 'risk-medium' };
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