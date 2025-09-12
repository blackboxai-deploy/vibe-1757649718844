// Variables y elementos del DOM
const form = document.getElementById('depreciation-form');
const costoActivoInput = document.getElementById('costo-activo');
const valorResidualInput = document.getElementById('valor-residual');
const vidaUtilInput = document.getElementById('vida-util');
const metodoSelect = document.getElementById('metodo-depreciacion');
const calcularBtn = document.getElementById('calcular-btn');
const limpiarBtn = document.getElementById('limpiar-btn');
const resultsSection = document.getElementById('results-section');
const resultsContent = document.getElementById('results-content');
const methodInfo = document.getElementById('method-info');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para el formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularDepreciacion();
    });

    // Event listener para el botón limpiar
    limpiarBtn.addEventListener('click', limpiarFormulario);

    // Event listeners para validación en tiempo real
    costoActivoInput.addEventListener('input', validarCostoMayorQueResidual);
    valorResidualInput.addEventListener('input', validarCostoMayorQueResidual);
});

// Función principal para calcular depreciación
function calcularDepreciacion() {
    try {
        // Obtener y validar valores de entrada
        const costoActivo = obtenerValorNumerico(costoActivoInput.value);
        const valorResidual = obtenerValorNumerico(valorResidualInput.value);
        const vidaUtil = parseInt(vidaUtilInput.value);
        const metodoSeleccionado = metodoSelect.value;

        // Validaciones
        if (!validarEntradas(costoActivo, valorResidual, vidaUtil, metodoSeleccionado)) {
            return;
        }

        // Mostrar indicador de carga
        mostrarCargando();

        // Calcular según el método seleccionado
        let resultados;
        switch (metodoSeleccionado) {
            case 'linea-recta':
                resultados = calcularLineaRecta(costoActivo, valorResidual, vidaUtil);
                break;
            case 'suma-digitos':
                resultados = calcularSumaDigitos(costoActivo, valorResidual, vidaUtil);
                break;
            default:
                mostrarError('Por favor selecciona un método de depreciación válido.');
                return;
        }

        // Mostrar resultados
        mostrarResultados(resultados, metodoSeleccionado);
        
    } catch (error) {
        console.error('Error en el cálculo:', error);
        mostrarError('Ha ocurrido un error en el cálculo. Por favor verifica los datos ingresados.');
    }
}

// Función para obtener valor numérico válido
function obtenerValorNumerico(valor) {
    const numero = parseFloat(valor);
    return isNaN(numero) ? 0 : numero;
}

// Función de validación de entradas
function validarEntradas(costoActivo, valorResidual, vidaUtil, metodoSeleccionado) {
    // Limpiar mensajes de error previos
    limpiarMensajesError();

    let esValido = true;
    let errores = [];

    // Validar costo del activo
    if (costoActivo <= 0) {
        errores.push('El costo del activo debe ser mayor a cero.');
        esValido = false;
    }

    // Validar valor residual
    if (valorResidual < 0) {
        errores.push('El valor residual no puede ser negativo.');
        esValido = false;
    }

    // Validar que el costo sea mayor al valor residual
    if (costoActivo <= valorResidual) {
        errores.push('El costo del activo debe ser mayor al valor residual.');
        esValido = false;
    }

    // Validar vida útil
    if (vidaUtil <= 0 || vidaUtil > 100) {
        errores.push('La vida útil debe estar entre 1 y 100 años.');
        esValido = false;
    }

    // Validar método seleccionado
    if (!metodoSeleccionado) {
        errores.push('Por favor selecciona un método de depreciación.');
        esValido = false;
    }

    // Mostrar errores si los hay
    if (!esValido) {
        mostrarError(errores.join('<br>'));
    }

    return esValido;
}

// Validación en tiempo real para costo y valor residual
function validarCostoMayorQueResidual() {
    const costoActivo = obtenerValorNumerico(costoActivoInput.value);
    const valorResidual = obtenerValorNumerico(valorResidualInput.value);
    
    if (costoActivo > 0 && valorResidual >= 0 && costoActivo <= valorResidual) {
        costoActivoInput.style.borderColor = '#dc3545';
        valorResidualInput.style.borderColor = '#dc3545';
    } else {
        costoActivoInput.style.borderColor = '#dee2e6';
        valorResidualInput.style.borderColor = '#dee2e6';
    }
}

// Método de Línea Recta
function calcularLineaRecta(costoActivo, valorResidual, vidaUtil) {
    const montoDepreciable = costoActivo - valorResidual;
    const depreciacionAnual = montoDepreciable / vidaUtil;
    
    const resultados = {
        metodo: 'Línea Recta',
        descripcion: 'Método que distribuye el costo del activo uniformemente a lo largo de su vida útil.',
        costoActivo: costoActivo,
        valorResidual: valorResidual,
        vidaUtil: vidaUtil,
        montoDepreciable: montoDepreciable,
        depreciacionAnual: depreciacionAnual,
        años: []
    };

    let valorLibros = costoActivo;
    
    for (let año = 1; año <= vidaUtil; año++) {
        const depreciacionAño = depreciacionAnual;
        const depreciacionAcumulada = depreciacionAnual * año;
        valorLibros = costoActivo - depreciacionAcumulada;
        
        resultados.años.push({
            año: año,
            depreciacionAnual: depreciacionAño,
            depreciacionAcumulada: depreciacionAcumulada,
            valorLibros: Math.max(valorLibros, valorResidual) // No puede ser menor al valor residual
        });
    }

    return resultados;
}

// Método de Suma de los Dígitos de los Años
function calcularSumaDigitos(costoActivo, valorResidual, vidaUtil) {
    const montoDepreciable = costoActivo - valorResidual;
    const sumaDigitos = (vidaUtil * (vidaUtil + 1)) / 2;
    
    const resultados = {
        metodo: 'Suma de los Dígitos de los Años',
        descripcion: 'Método acelerado que asigna mayor depreciación en los primeros años de vida del activo.',
        costoActivo: costoActivo,
        valorResidual: valorResidual,
        vidaUtil: vidaUtil,
        montoDepreciable: montoDepreciable,
        sumaDigitos: sumaDigitos,
        años: []
    };

    let depreciacionAcumuladaTotal = 0;
    
    for (let año = 1; año <= vidaUtil; año++) {
        const añosRestantes = vidaUtil - año + 1;
        const factor = añosRestantes / sumaDigitos;
        const depreciacionAnual = montoDepreciable * factor;
        depreciacionAcumuladaTotal += depreciacionAnual;
        const valorLibros = costoActivo - depreciacionAcumuladaTotal;
        
        resultados.años.push({
            año: año,
            añosRestantes: añosRestantes,
            factor: factor,
            depreciacionAnual: depreciacionAnual,
            depreciacionAcumulada: depreciacionAcumuladaTotal,
            valorLibros: Math.max(valorLibros, valorResidual) // No puede ser menor al valor residual
        });
    }

    return resultados;
}

// Función para mostrar resultados
function mostrarResultados(resultados, metodoSeleccionado) {
    // Actualizar información del método
    methodInfo.innerHTML = '<strong>' + resultados.metodo + ':</strong> ' + resultados.descripcion;
    
    // Crear HTML de resultados
    let html = '<div class="summary-cards">' +
        '<div class="summary-card">' +
            '<h3>Costo del Activo</h3>' +
            '<div class="value currency">$' + formatearNumero(resultados.costoActivo) + '</div>' +
        '</div>' +
        '<div class="summary-card">' +
            '<h3>Valor Residual</h3>' +
            '<div class="value currency">$' + formatearNumero(resultados.valorResidual) + '</div>' +
        '</div>' +
        '<div class="summary-card">' +
            '<h3>Vida Útil</h3>' +
            '<div class="value">' + resultados.vidaUtil + ' años</div>' +
        '</div>' +
        '<div class="summary-card">' +
            '<h3>Monto Depreciable</h3>' +
            '<div class="value currency">$' + formatearNumero(resultados.montoDepreciable) + '</div>' +
        '</div>' +
    '</div>';

    // Agregar información específica del método
    if (metodoSeleccionado === 'linea-recta') {
        html += '<div class="summary-cards">' +
            '<div class="summary-card">' +
                '<h3>Depreciación Anual</h3>' +
                '<div class="value currency">$' + formatearNumero(resultados.depreciacionAnual) + '</div>' +
            '</div>' +
        '</div>';
    } else if (metodoSeleccionado === 'suma-digitos') {
        html += '<div class="summary-cards">' +
            '<div class="summary-card">' +
                '<h3>Suma de Dígitos</h3>' +
                '<div class="value">' + resultados.sumaDigitos + '</div>' +
            '</div>' +
        '</div>';
    }

    // Crear tabla de resultados anuales
    html += '<table class="results-table">' +
        '<thead>' +
            '<tr>' +
                '<th>Año</th>' +
                (metodoSeleccionado === 'suma-digitos' ? '<th>Años Restantes</th><th>Factor</th>' : '') +
                '<th>Depreciación Anual</th>' +
                '<th>Depreciación Acumulada</th>' +
                '<th>Valor en Libros</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>';

    // Agregar filas de la tabla
    resultados.años.forEach(function(año) {
        html += '<tr>' +
            '<td>' + año.año + '</td>' +
            (metodoSeleccionado === 'suma-digitos' ? 
                '<td>' + año.añosRestantes + '</td><td>' + (año.factor * 100).toFixed(2) + '%</td>' : '') +
            '<td class="currency">$' + formatearNumero(año.depreciacionAnual) + '</td>' +
            '<td class="currency">$' + formatearNumero(año.depreciacionAcumulada) + '</td>' +
            '<td class="currency">$' + formatearNumero(año.valorLibros) + '</td>' +
        '</tr>';
    });

    html += '</tbody></table>';

    // Mostrar resultados con animación
    resultsContent.innerHTML = html;
    resultsContent.classList.add('show');
    
    // Scroll suave hacia los resultados
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Función para formatear números con separadores de miles y decimales
function formatearNumero(numero) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

// Función para mostrar indicador de carga
function mostrarCargando() {
    calcularBtn.innerHTML = '<span class="loading"></span> Calculando...';
    calcularBtn.disabled = true;
    
    // Simular delay para mostrar loading (opcional)
    setTimeout(function() {
        calcularBtn.innerHTML = 'Calcular Depreciación';
        calcularBtn.disabled = false;
    }, 1000);
}

// Función para limpiar formulario
function limpiarFormulario() {
    // Limpiar campos del formulario
    form.reset();
    
    // Ocultar resultados
    resultsContent.classList.remove('show');
    resultsContent.innerHTML = '';
    methodInfo.innerHTML = '';
    
    // Limpiar estilos de validación
    costoActivoInput.style.borderColor = '#dee2e6';
    valorResidualInput.style.borderColor = '#dee2e6';
    
    // Limpiar mensajes de error
    limpiarMensajesError();
    
    // Enfocar en el primer campo
    costoActivoInput.focus();
    
    // Mostrar mensaje de confirmación
    mostrarExito('Formulario limpiado correctamente.');
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    limpiarMensajesError();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = '⚠️ ' + mensaje;
    
    // Insertar antes del formulario
    form.parentNode.insertBefore(errorDiv, form);
    
    // Auto-remover después de 5 segundos
    setTimeout(function() {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    limpiarMensajesError();
    
    const exitoDiv = document.createElement('div');
    exitoDiv.className = 'success-message';
    exitoDiv.innerHTML = '✅ ' + mensaje;
    
    // Insertar antes del formulario
    form.parentNode.insertBefore(exitoDiv, form);
    
    // Auto-remover después de 3 segundos
    setTimeout(function() {
        if (exitoDiv.parentNode) {
            exitoDiv.remove();
        }
    }, 3000);
}

// Función para limpiar mensajes de error y éxito
function limpiarMensajesError() {
    const mensajes = document.querySelectorAll('.error-message, .success-message');
    mensajes.forEach(function(mensaje) {
        mensaje.remove();
    });
}