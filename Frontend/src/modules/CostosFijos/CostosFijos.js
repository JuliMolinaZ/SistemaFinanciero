import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CostosFijos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from 'recharts';

const CostosFijos = () => {
  const [costosFijos, setCostosFijos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostoId, setEditingCostoId] = useState(null);
  const [formData, setFormData] = useState({
    colaborador: '',
    puesto: '',
    monto_usd: '',
    comentarios: '',
    fecha: '',
  });
  const [mesFiltro, setMesFiltro] = useState('');
  const [tipoCambio] = useState(20);
  const [porcentajeUtilidad, setPorcentajeUtilidad] = useState(40); // Cambiado a 40% por defecto
  const [resultadoUtilidad, setResultadoUtilidad] = useState(0);
  const [totalCostos, setTotalCostos] = useState(0);

  useEffect(() => {
    fetchCostosFijos();
  }, [mesFiltro]);

  useEffect(() => {
    calcularUtilidad();
  }, [costosFijos, porcentajeUtilidad]);

  const fetchCostosFijos = async () => {
    try {
      const response = await axios.get('https://sigma.runsolutions-services.com/api/costos-fijos', {
        params: { mes: mesFiltro },
      });
      // Asegurarse de que monto_mxn sea un número válido
      const costos = response.data.map((costo) => ({
        ...costo,
        monto_mxn: parseFloat(costo.monto_mxn) || 0,
        monto_usd: parseFloat(costo.monto_usd) || 0,
        impuestos_imss: parseFloat(costo.impuestos_imss) || 0,
      }));
      setCostosFijos(costos);
    } catch (error) {
      console.error('Error al obtener costos fijos:', error.response?.data || error.message);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({
      colaborador: '',
      puesto: '',
      monto_usd: '',
      comentarios: '',
      fecha: '',
    });
    setIsEditing(false);
    setEditingCostoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const monto_usd = parseFloat(formData.monto_usd) || 0;
    const monto_mxn = monto_usd * tipoCambio;
    const impuestos_imss = monto_mxn * 0.35;

    try {
      if (isEditing) {
        await axios.put(`https://sigma.runsolutions-services.com/api/costos-fijos/${editingCostoId}`, {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
        });
      } else {
        await axios.post('https://sigma.runsolutions-services.com/api/costos-fijos', {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
        });
      }
      fetchCostosFijos();
      toggleForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este costo fijo?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://sigma.runsolutions-services.com/api/costos-fijos/${id}`);
      setCostosFijos(costosFijos.filter((costo) => costo.id !== id));
    } catch (error) {
      console.error('Error al eliminar el costo fijo:', error.response?.data || error.message);
    }
  };

  const handleEdit = (costo) => {
    setIsEditing(true);
    setEditingCostoId(costo.id);
    setFormData({
      colaborador: costo.colaborador,
      puesto: costo.puesto,
      monto_usd: costo.monto_usd,
      comentarios: costo.comentarios,
      fecha: costo.fecha,
    });
    setShowForm(true);
  };

  const calcularUtilidad = () => {
    const total = costosFijos.reduce((acc, costo) => acc + (isNaN(costo.monto_mxn) ? 0 : costo.monto_mxn), 0);
    setTotalCostos(total);
    const utilidad = total * (porcentajeUtilidad / 100);
    setResultadoUtilidad(utilidad);
  };

  // Formateadores de moneda
  const formatterMXN = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  });

  const formatterUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  // Preparar datos para la gráfica
  const dataGrafica = costosFijos.length > 0 ? [
    {
      name: mesFiltro ? `Mes ${mesFiltro}` : 'Total',
      'Costos Fijos': totalCostos,
      'Costos Fijos + Utilidad': totalCostos + resultadoUtilidad,
    },
  ] : [];

  // Definir el componente CustomTooltip dentro de CostosFijos.js
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${formatterMXN.format(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <section className="costos-fijos-module">
      <h2>Costos Fijos</h2>

      {/* Gráfica de Costos Fijos y Utilidad Mejorada */}
      <div className="grafica-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={dataGrafica}
            margin={{ top: 50, right: 30, left: 20, bottom: 50 }}
          >
            <defs>
              <linearGradient id="colorCostosFijos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCostosFijosUtilidad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "#555" }} />
            <YAxis tick={{ fill: "#555" }}>
              <text
                x={-50}
                y={10}
                angle={-90}
                textAnchor="middle"
                fill="#555"
                fontSize="12px"
              >
                Monto en MXN
              </text>
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="Costos Fijos"
              fill="url(#colorCostosFijos)"
              animationDuration={1500}
              radius={[10, 10, 0, 0]}
            >
              <LabelList dataKey="Costos Fijos" position="top" formatter={(value) => formatterMXN.format(value)} />
            </Bar>
            <Bar
              dataKey="Costos Fijos + Utilidad"
              fill="url(#colorCostosFijosUtilidad)"
              animationDuration={1500}
              radius={[10, 10, 0, 0]}
            >
              <LabelList dataKey="Costos Fijos + Utilidad" position="top" formatter={(value) => formatterMXN.format(value)} />
            </Bar>
            {/* Línea de referencia para Total Costos */}
            {totalCostos > 0 && (
              <ReferenceLine
                y={totalCostos}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  position: 'insideTopRight',
                  value: 'Total Costos',
                  fill: 'red',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tarjeta de Totales y Utilidad */}
      <div className="totales-utilidad-container">
        <h3>Totales y Utilidad</h3>
        <div className="porcentaje-utilidad">
          <label>Seleccionar porcentaje de utilidad:</label>
          <select
            value={porcentajeUtilidad}
            onChange={(e) => setPorcentajeUtilidad(Number(e.target.value))}
            className="utilidad-select"
          >
            {[30, 40, 50, 60, 80, 100, 120].map((porcentaje) => (
              <option key={porcentaje} value={porcentaje}>
                {porcentaje}%
              </option>
            ))}
          </select>
        </div>
        <p>
          <strong>Total Costos Fijos:</strong> {formatterMXN.format(totalCostos)}
        </p>
        <p>
          <strong>Resultado de utilidad ({porcentajeUtilidad}%):</strong> {formatterMXN.format(resultadoUtilidad)}
        </p>
      </div>

      {/* Botón para Registrar Costo Fijo */}
      <button onClick={toggleForm} className="toggle-form-button">
        {showForm ? 'Cerrar formulario' : 'Registrar costo fijo'}
      </button>

      {/* Formulario para Registrar/Actualizar Costo Fijo */}
      {showForm && (
        <form onSubmit={handleSubmit} className="costos-fijos-form">
          <label>Colaborador:</label>
          <input
            type="text"
            name="colaborador"
            value={formData.colaborador}
            onChange={handleChange}
            required
          />

          <label>Puesto:</label>
          <input
            type="text"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            required
          />

          <label>Monto en USD:</label>
          <input
            type="number"
            name="monto_usd"
            value={formData.monto_usd}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />

          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />

          <label>Comentarios:</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
          />

          <div className="button-container">
            <button type="submit">{isEditing ? 'Actualizar Costo Fijo' : 'Registrar Costo Fijo'}</button>
          </div>
        </form>
      )}

      {/* Tabla de Costos Fijos Registrados */}
      <h3>Costos Fijos Registrados</h3>
      <table className="costos-fijos-table">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Puesto</th>
            <th>Monto USD</th>
            <th>Monto MXN</th>
            <th>Impuestos</th>
            <th>Comentarios</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {costosFijos.map((costo) => (
            <tr key={costo.id}>
              <td>{costo.colaborador}</td>
              <td>{costo.puesto}</td>
              <td>{formatterUSD.format(costo.monto_usd)}</td>
              <td>{formatterMXN.format(costo.monto_mxn)}</td>
              <td>{formatterMXN.format(costo.impuestos_imss)}</td>
              <td>{costo.comentarios}</td>
              <td>{new Date(costo.fecha).toLocaleDateString('es-MX')}</td>
              <td className="actions">
                <button className="icon-button edit-button" onClick={() => handleEdit(costo)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete-button" onClick={() => handleDelete(costo.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CostosFijos;








