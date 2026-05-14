import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteAssets } from '../../hooks/useSiteAssets';

const LeadForm = ({ onLoginClick, locale }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { assets } = useSiteAssets();
  const bgVideo = assets.find((a) => a.asset_type === 'video' && (a.asset_key === 'lead-bg-video' || a.asset_key === 'museum-video' || a.slug === 'lead-bg-video'))?.public_url || '';
  const bgAudio = assets.find((a) => a.asset_type === 'audio' && (a.asset_key === 'lead-bg-audio' || a.asset_key === 'ambient-audio' || a.slug === 'lead-bg-audio'))?.public_url || '';

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      name: prev.name || user.user_metadata?.full_name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.user_metadata?.phone || '',
    }));
  }, [user]);

  const museum = () => {
    navigate('/museum');
  };

  // Cập nhật giá trị form khi người dùng nhập liệu
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Xử lý submit form đặt vé tham quan
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra đăng nhập: nếu chưa đăng nhập thì mở modal auth
    if (!user) {
      onLoginClick?.();
      return;
    }

    setErrorMsg('');
    setStatus(null);
    museum();
  };

  const ticketCode = useMemo(() => `VIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`, []);

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: user?.user_metadata?.full_name || 'John Doe', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: user?.email || 'your@email.com', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900', required: false },
  ];

  return (
    <section
      id="dang-ky"
      className="section-pad relative overflow-hidden"
    style={{ background: 'linear-gradient(180deg, var(--theme-bg-alt) 0%, var(--theme-bg) 50%, var(--theme-bg-alt) 100%)' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bgVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: 0.12, filter: 'saturate(0.5) sepia(0.3)' }}
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--theme-bg) 0%, transparent 30%, transparent 70%, var(--theme-bg) 100%)' }} />
      </div>
      {bgAudio ? <audio src={bgAudio} autoPlay loop muted={false} className="hidden" /> : null}

      {/* Ánh sáng ambient màu vàng hổ phách */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.12) 0%, transparent 65%)' }}
      />

      {/* Đường kẻ dọc trang trí hai bên */}
      <div className="absolute top-0 left-1/4 w-px h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.2), transparent)' }} />
      <div className="absolute top-0 right-1/4 w-px h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.2), transparent)' }} />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Tiêu đề section Đăng Ký Vé */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="section-divider mx-auto" style={{ margin: '0 auto 1.5rem' }} />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b', fontFamily: 'var(--font-body)' }}>
            {locale === 'vi' ? 'Cổng vào bảo tàng' : 'Museum Entry Portal'}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--theme-text)', transition: 'color 0.4s ease' }}>
            {locale === 'vi' ? 'Mở cánh cổng đến ' : 'Open the Gates to '}
            <span className="text-gradient-amber">{locale === 'vi' ? 'bảo tàng ảo' : 'the Virtual Museum'}</span>
          </h2>
          <p className="text-sm" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
            {locale === 'vi' ? 'Đăng ký vé — nhận liên kết tour 3D ngay lập tức. Không cần kính VR, không cần thanh toán.' : 'Book your ticket — receive a 3D tour link instantly. No VR headset, no payment.'}
          </p>

          {!user && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-3 text-xs px-4 py-2 rounded-full inline-block"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fbbf24',
                fontFamily: 'var(--font-body)',
              }}
            >
              Sign in to book a ticket and manage your visits
            </motion.p>
          )}
        </motion.div>

        {/* CARD VÉ THAM QUAN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          {/* Vòng phát sáng bên ngoài card vé */}
          <motion.div
            className="absolute -inset-1 rounded-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08), rgba(245,158,11,0.15))',
              filter: 'blur(8px)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Khung card vé màu tối cao cấp */}
          <div
            className="relative overflow-hidden"
            style={{
              background: 'var(--theme-card-bg)',
              border: '1px solid var(--theme-border)',
              borderRadius: '24px',
              boxShadow: '0 0 40px rgba(245,158,11,0.12), 0 18px 48px rgba(0,0,0,0.22), inset 0 1px 0 rgba(245,158,11,0.12)',
            }}
          >
            {/* Đường kẻ vàng phía trên card */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: 'linear-gradient(90deg, transparent 5%, #f59e0b 30%, #fbbf24 50%, #f59e0b 70%, transparent 95%)',
            }} />

            {/* Ticket stub area (top) */}
            <div className="p-6 pb-4" style={{ borderBottom: '2px dashed rgba(245,158,11,0.25)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏛️</div>
                  <div className="text-left">
                    <div className="font-serif font-bold text-base" style={{ fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>
                      DINOSAUR MUSEUM
                    </div>
                    <div className="text-xs tracking-widest" style={{ color: 'rgba(245,158,11,0.5)', fontFamily: 'var(--font-body)' }}>
                      VIRTUAL TICKET — 2026
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: 'rgba(245,240,232,0.4)', fontFamily: 'var(--font-body)' }}>TICKET NO.</div>
                  <div className="font-mono text-sm font-bold" style={{ color: '#f59e0b' }}>
                    {ticketCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Two circular punched holes on the ticket stub edges */}
            <div className="absolute left-0 w-3 h-3 rounded-full -translate-x-1.5"
              style={{ top: '132px', background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }} />
            <div className="absolute right-0 w-3 h-3 rounded-full translate-x-1.5"
              style={{ top: '132px', background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }} />

            {/* Form content inside ticket */}
            <div className="p-6 pt-5">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      className="text-7xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >🎟️</motion.div>
                    <h3 className="font-serif text-2xl font-bold mb-3 text-gradient-amber"
                      style={{ fontFamily: 'var(--font-heading)' }}>
                      Museum Gates Open!
                    </h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)' }}>
                      Your virtual tour link has been sent to{' '}
                      <strong style={{ color: '#fbbf24' }}>{form.email || user?.email}</strong>.
                      <br />Please check your inbox (and spam folder).
                    </p>
                    <div className="p-4 rounded-xl mb-4 text-left"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'rgba(245,158,11,0.7)', fontFamily: 'var(--font-body)' }}>
                        Your Virtual Tour Link:
                      </p>
                      <code className="text-sm font-mono block" style={{ color: '#fbbf24', wordBreak: 'break-all' }}>
                        https://baotangkhunglong.vn/tour/virtual?ticket=VIP-2026
                      </code>
                    </div>
                    <div className="p-3 rounded-xl text-sm"
                      style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)' }}>
                      Welcome to the community of <strong style={{ color: '#fbbf24' }}>12,001 visitors</strong>!
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-4 mb-5">
                      {fields.map((field, i) => (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                        >
                          <label htmlFor={`lead-${field.name}`}
                            className="block text-left text-xs font-semibold mb-2 tracking-wider uppercase"
                            style={{ color: 'rgba(245,158,11,0.75)', fontFamily: 'var(--font-body)' }}>
                            {field.label}{' '}
                            {!field.required && <span style={{ color: 'var(--theme-text-dim)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>}
                          </label>
                          <input
                            id={`lead-${field.name}`}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={form[field.name]}
                            onChange={handleChange}
                            required={field.required}
                            className="input-dino text-left"
                            style={{ fontFamily: 'var(--font-body)' }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Ô check đồng ý điều khoản */}
                    <motion.label
                      htmlFor="lead-agree"
                      className="flex items-start gap-3 mb-5 cursor-pointer text-left"
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                      transition={{ delay: 0.55 }}
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <input type="checkbox" id="lead-agree" checked={agreed}
                          onChange={(e) => { setAgreed(e.target.checked); setErrorMsg(''); }}
                          className="sr-only" />
                        <div
                          className="w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-200"
                          style={{
                            background: agreed ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                            borderColor: agreed ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                          }}
                        >
                          {agreed && <span className="text-xs font-bold text-black">✓</span>}
                        </div>
                      </div>
                      <span className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--font-body)' }}>
                         I agree to receive updates from the Dinosaur Museum and understand I can unsubscribe at any time.
                         Personal data is protected per our{' '}
                         <a href="#" style={{ color: '#f59e0b' }} className="hover:underline">Privacy Policy</a>.
                       </span>
                    </motion.label>

                    {/* Error notification */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-sm text-red-400 text-center mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                          ⚠️ {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Main submit button */}
                    <motion.button
                      type="submit"
                      id="lead-submit-btn"
                      className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300"
                      style={{
                        background: user
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'linear-gradient(135deg, rgba(245,158,11,0.8), rgba(217,119,6,0.9))',
                        color: '#0a0804',
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '0.08em',
                        boxShadow: '0 0 30px rgba(245,158,11,0.3), 0 4px 20px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(245,158,11,0.4)',
                      }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: '0 0 50px rgba(245,158,11,0.5), 0 8px 30px rgba(0,0,0,0.5)',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {!user ? (
                        <>{locale === 'vi' ? 'ĐĂNG NHẬP ĐỂ TIẾP TỤC' : 'SIGN IN TO ENTER'}</>
                      ) : (
                        <>{locale === 'vi' ? 'ĐĂNG NHẬP ĐỂ TIẾP TỤC' : 'SIGN IN TO ENTER'}</>
                      )}
                    </motion.button>

                    <p className="text-xs text-center mt-3" style={{ color: 'var(--theme-text-dim)', fontFamily: 'var(--font-body)' }}>
                      🔒 No spam · Data never sold · Instant tour link
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Đường kẻ vàng phía dưới card */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(245,158,11,0.3) 30%, rgba(251,191,36,0.5) 50%, rgba(245,158,11,0.3) 70%, transparent 95%)',
            }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadForm;
