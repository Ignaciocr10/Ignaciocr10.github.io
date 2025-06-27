// Conversor de Watts a Soles
document.addEventListener('DOMContentLoaded', function() {
    const btnConvertir = document.getElementById('btnConvertir');
    if (btnConvertir) {
        btnConvertir.addEventListener('click', function(e) {
            e.preventDefault();
            const watts = parseFloat(document.getElementById('conv_watts').value) || 0;
            const horas = parseFloat(document.getElementById('conv_horas').value) || 0;
            const kwh = (watts * horas) / 1000;
            const costo = kwh * PRECIO_KWH;
            document.getElementById('conv_resultado').innerHTML =
                `<b>${kwh.toFixed(2)} kWh</b> = <b>S/ ${costo.toFixed(2)}</b>`;
        });
    }
});
const DIAS_MES = 22;
const PRECIO_KWH = 0.7; // Precio por kWh en soles

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function cargarHistorial() {
    return JSON.parse(localStorage.getItem('historialConsumo')) || [];
}

function guardarHistorial(historial) {
    localStorage.setItem('historialConsumo', JSON.stringify(historial));
}

let grafico = null;
function mostrarHistorial(historial) {
    if (historial.length === 0) {
        document.getElementById('historial').innerHTML = '';
        if (grafico) {
            grafico.data.labels = [];
            grafico.data.datasets[0].data = [];
            grafico.data.datasets[1].data = [];
            grafico.update();
        }
        return;
    }
    let html = "<h3>Historial de Consumo</h3><table style='width:100%;color:#fff;text-align:center'><tr><th>Mes</th><th>Consumo (kWh)</th><th>Costo (S/)</th></tr>";
    const labels = [];
    const datosKwh = [];
    const datosSoles = [];
    historial.forEach((item, i) => {
        html += `<tr><td>${item.mes}</td><td>${item.kwh}</td><td>${item.costo}</td></tr>`;
        labels.push(item.mes);
        datosKwh.push(Number(item.kwh));
        datosSoles.push(Number(item.costo));
    });
    html += "</table>";
    document.getElementById('historial').innerHTML = html;
    // Actualizar gráfico
    if (window.Chart) {
        if (!grafico) {
            const ctx = document.getElementById('graficoConsumo').getContext('2d');
            grafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Consumo (kWh)',
                            data: datosKwh,
                            borderColor: '#ffe066',
                            backgroundColor: 'rgba(255,224,102,0.12)',
                            yAxisID: 'y',
                            tension: 0.25,
                            pointRadius: 4,
                            pointBackgroundColor: '#ffe066',
                        },
                        {
                            label: 'Costo (S/)',
                            data: datosSoles,
                            borderColor: '#66e0ff',
                            backgroundColor: 'rgba(102,224,255,0.10)',
                            yAxisID: 'y1',
                            tension: 0.25,
                            pointRadius: 4,
                            pointBackgroundColor: '#66e0ff',
                        }
                    ]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            labels: { color: '#fff', font: { size: 13 } }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#ffe066', font: { size: 12 } }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: { display: true, text: 'kWh', color: '#ffe066' },
                            ticks: { color: '#ffe066', font: { size: 12 } }
                        },
                        y1: {
                            type: 'linear',
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: 'Soles', color: '#66e0ff' },
                            ticks: { color: '#66e0ff', font: { size: 12 } }
                        }
                    }
                }
            });
        } else {
            grafico.data.labels = labels;
            grafico.data.datasets[0].data = datosKwh;
            grafico.data.datasets[1].data = datosSoles;
            grafico.update();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const historial = cargarHistorial();
    mostrarHistorial(historial);
    // Botón de borrado de historial
    const btnBorrar = document.getElementById('borrarHistorial');
    if (btnBorrar) {
        btnBorrar.addEventListener('click', function() {
            if (confirm('¿Seguro que deseas borrar todo el historial de consumo?')) {
                localStorage.removeItem('historialConsumo');
                mostrarHistorial([]);
            }
        });
    }
});

document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();
    // Obtén cantidades y horas de uso
    const focos = parseInt(document.getElementById('focos').value) || 0;
    const horas_focos = parseFloat(document.getElementById('horas_focos').value) || 0;
    const computadoras = parseInt(document.getElementById('computadoras').value) || 0;
    const horas_computadoras = parseFloat(document.getElementById('horas_computadoras').value) || 0;
    const ventiladores = parseInt(document.getElementById('ventiladores').value) || 0;
    const horas_ventiladores = parseFloat(document.getElementById('horas_ventiladores').value) || 0;
    const proyectores = parseInt(document.getElementById('proyectores').value) || 0;
    const horas_proyectores = parseFloat(document.getElementById('horas_proyectores').value) || 0;
    const impresoras = parseInt(document.getElementById('impresoras').value) || 0;
    const horas_impresoras = parseFloat(document.getElementById('horas_impresoras').value) || 0;
    const otros = parseInt(document.getElementById('otros').value) || 0;
    const horas_otros = parseFloat(document.getElementById('horas_otros').value) || 0;

    // Calcula el consumo mensual de cada uno
    const consumoFocos = focos * 10 * horas_focos * DIAS_MES / 1000;
    const consumoComputadoras = computadoras * 100 * horas_computadoras * DIAS_MES / 1000;
    const consumoVentiladores = ventiladores * 60 * horas_ventiladores * DIAS_MES / 1000;
    const consumoProyectores = proyectores * 200 * horas_proyectores * DIAS_MES / 1000;
    const consumoImpresoras = impresoras * 50 * horas_impresoras * DIAS_MES / 1000;
    const consumoOtros = otros * horas_otros * DIAS_MES / 1000;

    const consumoMensualKWh = consumoFocos + consumoComputadoras + consumoVentiladores + consumoProyectores + consumoImpresoras + consumoOtros;
    const costoMensual = consumoMensualKWh * PRECIO_KWH;

    // Guardar en historial con mes progresivo
    let historial = cargarHistorial();
    let mes, anio;
    if (historial.length === 0) {
        // Primer registro: Junio 2025
        mes = "Junio";
        anio = 2025;
    } else {
        // Tomar el último mes y año del historial
        const ultimo = historial[historial.length - 1];
        let partes = ultimo.mes.split(" ");
        let mesAnterior = partes[0];
        let anioAnterior = parseInt(partes[1]);
        let idx = MESES.indexOf(mesAnterior);
        if (idx === -1) {
            // Si por alguna razón no se encuentra, reiniciar a Junio 2025
            mes = "Junio";
            anio = 2025;
        } else {
            idx++;
            if (idx >= MESES.length) {
                idx = 0;
                anioAnterior++;
            }
            mes = MESES[idx];
            anio = anioAnterior;
        }
    }
    let mesTexto = mes + " " + anio;
    historial.push({
        mes: mesTexto,
        kwh: consumoMensualKWh.toFixed(2),
        costo: costoMensual.toFixed(2)
    });
    guardarHistorial(historial);
    mostrarHistorial(historial);

    // Alerta si hay mal uso y animación de foquito roto
    if (historial.length > 1) {
        const anterior = parseFloat(historial[historial.length - 2].kwh);
        const actual = consumoMensualKWh;
        const focoNormal = document.getElementById('focoNormal');
        const focoRotoIzq = document.getElementById('focoRotoIzq');
        const focoRotoDer = document.getElementById('focoRotoDer');
        if (actual > anterior * 1.3) {
            // Animar foquito partido
            if (focoNormal && focoRotoIzq && focoRotoDer) {
                focoNormal.style.display = 'none';
                focoRotoIzq.style.display = 'block';
                focoRotoDer.style.display = 'block';
                // Forzar reflow para reiniciar animación
                focoRotoIzq.classList.remove('caida-izq');
                focoRotoDer.classList.remove('caida-der');
                void focoRotoIzq.offsetWidth;
                void focoRotoDer.offsetWidth;
                setTimeout(() => {
                    focoRotoIzq.classList.add('caida-izq');
                    focoRotoDer.classList.add('caida-der');
                }, 50);
            }
            alert('¡PELIGRO! El consumo aumentó más de un 30% respecto al mes pasado. El foquito se rompió.');
        } else {
            if (focoNormal && focoRotoIzq && focoRotoDer) {
                focoNormal.style.display = 'block';
                focoRotoIzq.style.display = 'none';
                focoRotoDer.style.display = 'none';
                focoRotoIzq.classList.remove('caida-izq');
                focoRotoDer.classList.remove('caida-der');
            }
            if (actual > anterior * 1.1) {
                alert('¡Alerta! El consumo aumentó más de un 10% respecto al mes pasado. Revisa posibles malos usos.');
            } else if (actual > anterior) {
                alert('¡Atención! El consumo de este mes es mayor que el anterior.');
            }
        }
    } else {
        // Primer registro, foquito normal
        const focoNormal = document.getElementById('focoNormal');
        const focoRotoIzq = document.getElementById('focoRotoIzq');
        const focoRotoDer = document.getElementById('focoRotoDer');
        if (focoNormal && focoRotoIzq && focoRotoDer) {
            focoNormal.style.display = 'block';
            focoRotoIzq.style.display = 'none';
            focoRotoDer.style.display = 'none';
            focoRotoIzq.classList.remove('caida-izq');
            focoRotoDer.classList.remove('caida-der');
        }
    }

    document.getElementById('resultado').innerHTML = `
        <strong>Consumo mensual estimado:</strong> ${consumoMensualKWh.toFixed(2)} kWh<br>
        <strong>Costo mensual estimado:</strong> S/ ${costoMensual.toFixed(2)}<br><br>
        <table style="margin:0 auto; background:#181818; color:#ffe066; border-radius:8px; font-size:1.05em;">
            <tr><th style='color:#fff;'>Aparato</th><th style='color:#fff;'>Consumo (kWh)</th><th style='color:#fff;'>Costo (S/)</th></tr>
            <tr><td>Focos</td><td>${consumoFocos.toFixed(2)}</td><td>${(consumoFocos*PRECIO_KWH).toFixed(2)}</td></tr>
            <tr><td>Computadoras</td><td>${consumoComputadoras.toFixed(2)}</td><td>${(consumoComputadoras*PRECIO_KWH).toFixed(2)}</td></tr>
            <tr><td>Ventiladores</td><td>${consumoVentiladores.toFixed(2)}</td><td>${(consumoVentiladores*PRECIO_KWH).toFixed(2)}</td></tr>
            <tr><td>Proyectores</td><td>${consumoProyectores.toFixed(2)}</td><td>${(consumoProyectores*PRECIO_KWH).toFixed(2)}</td></tr>
            <tr><td>Impresoras</td><td>${consumoImpresoras.toFixed(2)}</td><td>${(consumoImpresoras*PRECIO_KWH).toFixed(2)}</td></tr>
            <tr><td>Otros</td><td>${consumoOtros.toFixed(2)}</td><td>${(consumoOtros*PRECIO_KWH).toFixed(2)}</td></tr>
        </table>
    `;
});