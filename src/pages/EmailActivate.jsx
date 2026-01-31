import React, { useEffect, useState } from 'react';

// Компонент страницы активации по ссылке /email/activate?token=...
// Предположение: endpoint для активации
const ACTIVATE_URL = 'http://127.0.0.1/api/v1/accounts/email/activate/';

export default function EmailActivate() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    setToken(t);
    if (t) {
      // Автоматически пытаемся активировать
      activate(t);
    } else {
      setError('Токен не найден в параметрах URL.');
    }
  }, []);

  async function activate(t) {
    setLoading(true);
    setError(null);
    setMessage(null);
    setSuccess(false);
    try {
      // Небольшая валидация
      if (!t || typeof t !== 'string' || !t.trim()) {
        setError('Невалидный токен.');
        return;
      }

      const res = await fetch(ACTIVATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: t })
      });

      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        let txt;
        try {
          if (contentType.includes('application/json')) {
            const data = await res.json();
            txt = data.detail || JSON.stringify(data);
          } else {
            txt = await res.text();
          }
        } catch {
          txt = `HTTP ${res.status}`;
        }
        setError(txt || `Сервер вернул ${res.status}`);
        return;
      }

      // Успешный ответ
      if (contentType.includes('application/json')) {
        const data = await res.json();
        setMessage(data.message || JSON.stringify(data));
      } else {
        const txt = await res.text();
        setMessage(txt || 'Активация прошла успешно.');
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Активация Email</h2>
      <div style={{ marginBottom: 12 }}>
        <strong>Токен:</strong>
        <div style={{ wordBreak: 'break-all', marginTop: 6 }}>{token || '(нет токена)'}</div>
      </div>

      {loading && <div>Отправка запроса на активацию...</div>}

      {success && (
        <div style={{ color: 'green', marginTop: 12 }}>
          Успех! {message || ''}
        </div>
      )}

      {error && (
        <div style={{ color: 'crimson', marginTop: 12 }}>
          Ошибка: {error}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={() => activate(token)} disabled={loading || !token}>
          {loading ? 'Отправка...' : 'Повторить активацию'}
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => (window.location.href = '/')}
          disabled={loading}
        >
          На главную
        </button>
      </div>

      <div style={{ marginTop: 12, color: '#666' }}>
        Если у вас проблемы с активацией — свяжитесь с поддержкой.
      </div>
    </div>
  );
}
