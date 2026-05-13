import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { supabase } from '../../lib/supabaseClient';

// Hằng số cho tab đăng nhập và đăng ký
const TAB_LOGIN = 'login';
const TAB_REGISTER = 'register';

// Biến animation cho các ô input
const inputVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' }
  }),
};

// Kiểm tra định dạng số điện thoại Việt Nam
const isValidPhone = (phone) => /^(0[3|5|7|8|9])[0-9]{8}$/.test(phone.replace(/\s/g, ''));

const AuthModal = ({ isOpen, onClose, onLoginSuccess, locale = 'vi' }) => {
  const isVi = locale === 'vi';
  const [tab, setTab] = useState(TAB_LOGIN);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  // Reset form về trạng thái ban đầu
  const reset = () => {
    setForm({ name: '', email: '', password: '', phone: '' });
    setError('');
    setSuccess('');
    setLoading(false);
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();
  };

  // Chuyển đổi giữa tab đăng nhập và đăng ký
  const handleTabSwitch = (t) => {
    setTab(t);
    reset();
  };

  // Cập nhật dữ liệu form khi người dùng nhập
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  // Xử lý đăng nhập bằng Supabase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Vui lòng hoàn thành xác minh CAPTCHA.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
      options: { captchaToken },
    });
    if (error) {
      setError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } else {
      setSuccess('Đăng nhập thành công! Cổng bảo tàng đã mở.');
      setTimeout(() => {
        onClose();
        onLoginSuccess?.();
      }, 1400);
    }
    setLoading(false);
  };

  // Xử lý đăng ký tài khoản mới bằng Supabase Auth
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Kiểm tra độ dài mật khẩu
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      setLoading(false);
      return;
    }

    // Kiểm tra định dạng số điện thoại
    if (!isValidPhone(form.phone)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập số VN hợp lệ (VD: 0912345678).');
      setLoading(false);
      return;
    }

    // Bắt buộc phải hoàn thành captcha trước khi đăng ký
    if (!captchaToken) {
      setError('Vui lòng hoàn thành xác minh CAPTCHA.');
      setLoading(false);
      return;
    }

    // Gọi API đăng ký của Supabase với emailRedirectTo để sửa lỗi chuyển hướng liên kết xác nhận
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        // Chuyển hướng về trang hiện tại sau khi xác nhận email (sửa lỗi chuyển hướng localhost)
        emailRedirectTo: window.location.origin,
        captchaToken,
        data: {
          full_name: form.name,
          phone: form.phone.replace(/\s/g, ''),
        },
      },
    });

    if (error) {
      // Hiển thị lỗi từ Supabase (dịch các lỗi phổ biến sang tiếng Việt)
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        setError('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng một email khác.');
      } else {
        setError('Đăng ký thất bại: ' + error.message);
      }
      // Reset captcha khi có lỗi để người dùng giải lại
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } else {
      // Thông báo thành công kèm hướng dẫn xác thực email
      setSuccess('Đăng ký thành công! Vui lòng kiểm tra hộp thư email của bạn để xác nhận tài khoản (bao gồm cả thư mục rác).');
    }
    setLoading(false);
  };

  // Các trường nhập liệu theo ngôn ngữ
  const loginFields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: isVi ? 'email@cua-ban.com' : 'your@email.com' },
    { name: 'password', label: isVi ? 'Mật khẩu' : 'Password', type: 'password', placeholder: '••••••••' },
  ];

  const registerFields = [
    { name: 'name', label: isVi ? 'Họ và tên' : 'Full name', type: 'text', placeholder: isVi ? 'Nguyễn Văn A' : 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: isVi ? 'email@cua-ban.com' : 'your@email.com' },
    { name: 'phone', label: isVi ? 'Số điện thoại' : 'Phone number', type: 'tel', placeholder: isVi ? '0912 345 678' : '+84 912 345 678' },
    { name: 'password', label: isVi ? 'Mật khẩu' : 'Password', type: 'password', placeholder: isVi ? 'Ít nhất 6 ký tự' : 'At least 6 characters' },
  ];

  const fields = tab === TAB_LOGIN ? loginFields : registerFields;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Lớp nền tối phía sau modal */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal đăng nhập / đăng ký */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md pointer-events-auto"
              style={{
                background: 'var(--theme-card-bg)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '24px',
                boxShadow: '0 25px 80px rgba(0,0,0,0.8), 0 0 80px rgba(245, 158, 11, 0.1)',
                backdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Đường kẻ vàng trang trí phía trên */}
              <div style={{
                position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px',
                background: 'linear-gradient(90deg, transparent, #f59e0b, #fbbf24, transparent)',
                borderRadius: '2px',
              }} />

              {/* Viền phát sáng xung quanh modal */}
              <div style={{
                position: 'absolute', inset: -1, borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.08), transparent, rgba(245,158,11,0.05))',
                pointerEvents: 'none',
              }} />

              <div className="p-8">
                {/* Tiêu đề modal */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🏛️</span>
                      <h2
                        className="font-serif text-2xl font-bold"
                        style={{ fontFamily: 'Cormorant Garamond, serif', color: '#fbbf24' }}
>
                        {tab === TAB_LOGIN ? (isVi ? 'Mừng trở lại' : 'Welcome back') : (isVi ? 'Tạo tài khoản' : 'Create account')}
                      </h2>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                      {isVi ? 'Bảo tàng Khủng long — Trải nghiệm Thực tế ảo' : 'Dinosaur Museum — Immersive Virtual Experience'}
                    </p>
                  </div>
                  {/* Nút đóng modal */}
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{ color: 'var(--theme-text-muted)', border: '1px solid var(--theme-border)' }}
                    id="auth-modal-close"
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#f59e0b'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--theme-border)'}
                  >
                    ✕
                  </button>
                </div>

                {/* Tabs chuyển đổi đăng nhập / đăng ký */}
                <div className="flex mb-7 rounded-full p-1" style={{ background: 'rgba(245,158,11,0.08)' }}>
                  {[TAB_LOGIN, TAB_REGISTER].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTabSwitch(t)}
                      className="flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300"
                      style={{
                        background: tab === t ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                        color: tab === t ? '#0a0804' : 'var(--theme-text-muted)',
                        fontFamily: 'DM Sans, sans-serif',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {t === TAB_LOGIN ? (isVi ? 'Đăng nhập' : 'Sign In') : (isVi ? 'Đăng ký' : 'Sign Up')}
                    </button>
                  ))}
                </div>

                {/* Form đăng nhập hoặc đăng ký */}
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
                        <label
                          className="block text-xs font-semibold mb-2 tracking-wider uppercase"
                          style={{ color: 'rgba(245,158,11,0.8)', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          {field.label}
                          {field.name === 'phone' && (
                            <span className="ml-1 normal-case font-normal" style={{ color: 'var(--theme-text-dim)', letterSpacing: 0 }}>
                              (bắt buộc để xác minh)
                            </span>
                          )}
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
                          style={{ fontFamily: 'Nunito, sans-serif' }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* hCaptcha — hiển thị cho cả Login và Register */}
                  <motion.div
                    className="mt-5 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <HCaptcha
                      sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                      onVerify={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      theme="dark"
                      ref={captchaRef}
                    />
                  </motion.div>

                  {/* Hiển thị thông báo lỗi hoặc thành công */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 px-4 py-3 rounded-xl text-sm text-center"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                      >
                        ⚠️ {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 px-4 py-3 rounded-xl text-sm text-center"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}
                      >
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nút submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-amber-primary w-full mt-6 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      tab === TAB_LOGIN
                        ? (isVi ? 'Vào bảo tàng' : 'Enter Museum')
                        : (isVi ? 'Tạo tài khoản của tôi' : 'Create My Account')
                    )}
                  </motion.button>

                  {/* Hướng dẫn xác nhận email sau khi đăng ký */}
                  {tab === TAB_REGISTER && (
                    <p className="text-xs text-center mt-3" style={{ color: 'var(--theme-text-dim)', fontFamily: 'Nunito, sans-serif' }}>
                      Sau khi đăng ký, hãy kiểm tra email để xác nhận tài khoản (bao gồm cả thư mục rác).
                    </p>
                  )}
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
