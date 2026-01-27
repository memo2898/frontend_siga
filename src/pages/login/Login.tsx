/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import './login.css';
import escudoClaro from '../../assets/imgs/escudo_claro.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface FormData {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    remember: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      if (!formData.username || !formData.password) {
        setLoginError('Por favor completa todos los campos');
        return;
      }
      
      console.log('Login attempt:', formData);
      
    } catch (error) {
      setLoginError('Error al iniciar sesión. Intenta nuevamente.');
    }
  };

  return (
    <div className="body_container">
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <img
                src={escudoClaro}
                alt="Escudo Alcaldía"
                className="escudo_login"
              />
            </div>
            <h1>Alcaldía del Distrito Nacional</h1>
            <p>Sistema Integral de Gestión de Activos (SIGA)</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div 
                className={`input-wrapper ${focusedInput === 'username' ? 'focused' : ''}`}
              >
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  autoComplete="off"
                  placeholder="Usuario"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div 
                className={`input-wrapper ${focusedInput === 'password' ? 'focused' : ''}`}
              >
                <FontAwesomeIcon icon={faLock} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input_pass"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  autoComplete="off"
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="form-options">
              {/* <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Recordarme
              </label> */}
              {/* <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a> */}
            </div>

            {loginError && (
              <div className="cont_login_error">
                <span className="login_error">{loginError}</span>
              </div>
            )}

            <button type="submit" className="login-btn">
              <span className="btn-text">Iniciar Sesión</span>
              <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
            </button>
          </form>

          <div className="login-footer">
            <p>&copy; {currentYear} Alcaldía del Distrito Nacional</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;