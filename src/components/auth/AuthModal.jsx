import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const TAB_LOGIN = 'login';
const TAB_REGISTER = 'register';

const inputVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' }
  }),
};

const AuthModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState(TAB_LOGIN);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => {
    setForm({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleTabSwitch = (t) => {
    setTab(t);
    reset();
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } else {
      setSuccess('Đăng nhập thành công!');
      setTimeout(() => onClose(), 1200);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    if (error) {
      setError('Đăng ký thất bại: ' + error.message);
    } else {
      setSuccess('Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.');
    }
    setLoading(false);
  };

  const loginFields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: '••••••••' },
  ];

  const registerFields = [
    { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Ít nhất 6 ký tự' },
  ];

  const fields = tab === TAB_LOGIN ? loginFields : registerFields;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md pointer-events-auto"
              style={{
                background: 'rgba(17, 14, 8, 0.97)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '20px',
                boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 60px rgba(245, 158, 11, 0.08)',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
                background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                borderRadius: '2px'
              }} />

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-amber-400" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {tab === TAB_LOGIN ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'rgba(245,240,232,0.5)' }}>DinoArchive</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-amber-400 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-400/10"
                    id="auth-modal-close"
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex mb-8 rounded-full p-1" style={{ background: 'rgba(245,158,11,0.08)' }}>
                  {[TAB_LOGIN, TAB_REGISTER].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTabSwitch(t)}
                      className="flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300"
                      style={{
                        background: tab === t ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                        color: tab === t ? '#0a0804' : 'rgba(245,240,232,0.5)',
                        fontWeight: tab === t ? '700' : '500',
                      }}
                    >
                      {t === TAB_LOGIN ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={tab === TAB_LOGIN ? handleLogin : handleRegister}>
                  <div className="space-y-4">
                    {fields.map((field, i) => (
                      <motion.div
                        key={`${tab}-${field.name}`}
                        custom={i}
                        variants={inputVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <label className="block text-xs font-medium mb-2 tracking-wider uppercase"
                          style={{ color: 'rgba(245,158,11,0.7)' }}>
                          {field.label}
                        </label>
                        <input
                          id={`auth-${field.name}`}
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={form[field.name]}
                          onChange={handleChange}
                          required
                          className="input-dino"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Error / Success */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 text-sm text-red-400 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 text-sm text-amber-400 text-center font-medium"
                      >
                        ✓ {success}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-amber-primary w-full mt-6 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      tab === TAB_LOGIN ? 'Đăng nhập' : 'Tạo tài khoản'
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
