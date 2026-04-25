import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const LeadForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setErrorMsg('Vui lòng đồng ý với điều khoản.'); return; }
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase
      .from('leads')
      .insert([{ name: form.name, email: form.email, phone: form.phone || null }]);

    if (error) {
      if (error.code === '23505') {
        setErrorMsg('Email này đã được đăng ký. Hãy kiểm tra hộp thư của bạn!');
      } else {
        setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
      setLoading(false);
      return;
    }

    setStatus('success');
    setLoading(false);
  };

  const fields = [
    { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A', required: true },
    { name: 'email', label: 'Địa chỉ Email', type: 'email', placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '090 xxx xxxx', required: false },
  ];

  return (
    <section
      id="download"
      className="section-pad relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #110e08 0%, #1a1208 50%, #110e08 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.08) 0%, transparent 60%)' }} />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="section-divider mx-auto" style={{ margin: '0 auto 1.5rem' }} />
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>
            Nhận tài liệu ngay hôm nay
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Tải{' '}
            <span className="text-gradient-amber">Miễn Phí</span>{' '}
            Bộ Ebook
          </h2>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
            Điền thông tin bên dưới — nhận link tải ngay trong email của bạn.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="glass-card p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(245,158,11,0.05)' }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-6">🦕</div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-gradient-amber"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                  Tuyệt vời! Đã gửi thành công.
                </h3>
                <p className="text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
                  Link tải ebook đã được gửi tới <strong style={{ color: '#fbbf24' }}>{form.email}</strong>.
                  <br />Hãy kiểm tra hộp thư đến (và thư mục spam) của bạn!
                </p>
                <div className="mt-6 p-4 rounded-xl text-sm"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(245,240,232,0.7)' }}>
                  🎉 Chào mừng bạn gia nhập cộng đồng <strong style={{ color: '#fbbf24' }}>12,848 người</strong> yêu khủng long!
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-5 mb-6">
                  {fields.map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <label
                        htmlFor={`lead-${field.name}`}
                        className="block text-left text-xs font-medium mb-2 tracking-wider uppercase"
                        style={{ color: 'rgba(245,158,11,0.7)' }}
                      >
                        {field.label}{' '}
                        {!field.required && <span style={{ color: 'rgba(245,240,232,0.3)' }}>(tuỳ chọn)</span>}
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
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Checkbox */}
                <motion.label
                  className="flex items-start gap-3 mb-6 cursor-pointer text-left"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="lead-agree"
                      checked={agreed}
                      onChange={(e) => { setAgreed(e.target.checked); setErrorMsg(''); }}
                      className="sr-only"
                    />
                    <div
                      onClick={() => { setAgreed(!agreed); setErrorMsg(''); }}
                      className="w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-200"
                      style={{
                        background: agreed ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                        borderColor: agreed ? '#f59e0b' : 'rgba(245,158,11,0.3)',
                      }}
                    >
                      {agreed && <span className="text-xs font-bold text-black">✓</span>}
                    </div>
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)' }}>
                    Tôi đồng ý nhận thông tin từ DinoArchive và hiểu rằng có thể hủy đăng ký bất kỳ lúc nào.
                    Thông tin cá nhân được bảo mật theo{' '}
                    <a href="#" style={{ color: '#f59e0b' }} className="hover:underline">Chính sách bảo mật</a>.
                  </span>
                </motion.label>

                {/* Error message */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-sm text-red-400 text-center mb-4"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  id="lead-submit-btn"
                  disabled={loading}
                  className="btn-amber-primary w-full flex items-center justify-center gap-2 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    '🦴 Tải Ebook Miễn Phí Ngay'
                  )}
                </motion.button>

                <p className="text-xs text-center mt-4" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  🔒 Không spam. Không bán thông tin. Tải về ngay lập tức.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadForm;
