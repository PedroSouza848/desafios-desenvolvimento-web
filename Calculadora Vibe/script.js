const screen = document.getElementById('screen');
let currentExpression = '';
let isNewCalculation = false;

function updateScreen(value) {
  screen.value = value;
}

function appendNumber(num) {
  if (screen.value === '0' || isNewCalculation) {
    screen.value = num === ',' ? '0,' : num;
    isNewCalculation = false;
  } else {
    if (num === ',' && screen.value.includes(',')) return;
    screen.value += num;
  }
}

function appendOperator(op) {
  currentExpression = screen.value.replace(',', '.') + ' ' + op + ' ';
  isNewCalculation = true;
}

function clearAll() {
  screen.value = '0';
  currentExpression = '';
  isNewCalculation = false;
}

function clearEntry() {
  screen.value = '0';
}

function backspace() {
  if (screen.value.length > 1) {
    screen.value = screen.value.slice(0, -1);
  } else {
    screen.value = '0';
  }
}

function toggleSign() {
  if (screen.value !== '0') {
    if (screen.value.startsWith('-')) {
      screen.value = screen.value.slice(1);
    } else {
      screen.value = '-' + screen.value;
    }
  }
}

function specialOperation(type) {
  let val = parseFloat(screen.value.replace(',', '.'));
  let res = 0;

  switch (type) {
    case 'reciprocal':
      res = val !== 0 ? 1 / val : 'Erro';
      break;
    case 'square':
      res = Math.pow(val, 2);
      break;
    case 'sqrt':
      res = val >= 0 ? Math.sqrt(val) : 'Erro';
      break;
  }

  screen.value = res.toString().replace('.', ',');
  isNewCalculation = true;
}

function calculate() {
  if (!currentExpression) return;

  try {
    const fullExpr = currentExpression + screen.value.replace(',', '.');
    const result = eval(fullExpr);
    
    screen.value = Number.isInteger(result) 
      ? result.toString() 
      : result.toFixed(6).replace(/\.?0+$/, '').replace('.', ',');

    currentExpression = '';
    isNewCalculation = true;
  } catch (e) {
    screen.value = 'Erro';
    currentExpression = '';
  }
}

// Escuta os eventos do teclado
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Números (0 a 9)
  if (key >= '0' && key <= '9') {
    appendNumber(key);
  }

  // Vírgula ou Ponto
  if (key === ',' || key === '.') {
    appendNumber(',');
  }

  // Operadores
  if (key === '+') appendOperator('+');
  if (key === '-') appendOperator('-');
  if (key === '*') appendOperator('*');
  if (key === '/') appendOperator('/');
  if (key === '%') appendOperator('%');

  // Calcular (Enter ou =)
  if (key === 'Enter' || key === '=') {
    event.preventDefault(); // Impede comportamentos padrão do Enter
    calculate();
  }

  // Apagar (Backspace)
  if (key === 'Backspace') {
    backspace();
  }

  // Limpar tudo (Escape ou Delete)
  if (key === 'Escape' || key === 'Delete') {
    clearAll();
  }
});