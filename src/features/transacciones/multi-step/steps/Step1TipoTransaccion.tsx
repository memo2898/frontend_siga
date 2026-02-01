import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import {
  SUBTIPOS_ENTRADA,
  SUBTIPOS_SALIDA,
  type TipoTransaccion,
  type SubtipoEntrada,
  type SubtipoSalida,
} from '../types';
import './Steps.css';

export function Step1TipoTransaccion() {
  const { state, dispatch } = useTransaccionWizardContext();

  const handleTipoChange = (tipo: TipoTransaccion) => {
    dispatch({ type: 'SET_TIPO_TRANSACCION', payload: { tipo } });
  };

  const handleSubtipoEntradaChange = (subtipo: SubtipoEntrada) => {
    dispatch({ type: 'SET_SUBTIPO_ENTRADA', payload: subtipo });
  };

  const handleSubtipoSalidaChange = (subtipo: SubtipoSalida) => {
    dispatch({ type: 'SET_SUBTIPO_SALIDA', payload: subtipo });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Tipo de Transaccion</h2>
        <p className="step-description">
          Seleccione el tipo de transaccion que desea realizar
        </p>
      </div>

      {/* Tipo principal */}
      <div className="step-section">
        <label className="step-label">Tipo de Operacion</label>
        <div className="radio-group radio-group-horizontal">
          <label
            className={`radio-card ${state.tipoTransaccion === 'ENTRADA' ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="tipoTransaccion"
              value="ENTRADA"
              checked={state.tipoTransaccion === 'ENTRADA'}
              onChange={() => handleTipoChange('ENTRADA')}
            />
            <div className="radio-card-content">
              <span className="radio-card-icon">+</span>
              <span className="radio-card-label">Entrada</span>
              <span className="radio-card-description">
                Ingreso de activos al inventario
              </span>
            </div>
          </label>

          <label
            className={`radio-card ${state.tipoTransaccion === 'SALIDA' ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="tipoTransaccion"
              value="SALIDA"
              checked={state.tipoTransaccion === 'SALIDA'}
              onChange={() => handleTipoChange('SALIDA')}
            />
            <div className="radio-card-content">
              <span className="radio-card-icon">-</span>
              <span className="radio-card-label">Salida</span>
              <span className="radio-card-description">
                Salida de activos del inventario
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Subtipos de Entrada */}
      {state.tipoTransaccion === 'ENTRADA' && (
        <div className="step-section">
          <label className="step-label">Tipo de Entrada</label>
          <div className="radio-group radio-group-vertical">
            {SUBTIPOS_ENTRADA.map((subtipo) => (
              <label
                key={subtipo.value}
                className={`radio-option ${state.subtipoEntrada === subtipo.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="subtipoEntrada"
                  value={subtipo.value}
                  checked={state.subtipoEntrada === subtipo.value}
                  onChange={() => handleSubtipoEntradaChange(subtipo.value)}
                />
                <div className="radio-option-content">
                  <span className="radio-option-label">{subtipo.label}</span>
                  <span className="radio-option-description">
                    {subtipo.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Subtipos de Salida */}
      {state.tipoTransaccion === 'SALIDA' && (
        <div className="step-section">
          <label className="step-label">Tipo de Salida</label>
          <div className="radio-group radio-group-vertical">
            {SUBTIPOS_SALIDA.map((subtipo) => (
              <label
                key={subtipo.value}
                className={`radio-option ${state.subtipoSalida === subtipo.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="subtipoSalida"
                  value={subtipo.value}
                  checked={state.subtipoSalida === subtipo.value}
                  onChange={() => handleSubtipoSalidaChange(subtipo.value)}
                />
                <div className="radio-option-content">
                  <span className="radio-option-label">{subtipo.label}</span>
                  <span className="radio-option-description">
                    {subtipo.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Errores */}
      {state.errors['step_0'] && state.errors['step_0'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_0'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
