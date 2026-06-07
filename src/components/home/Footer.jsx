import React from "react";
import { Globe, Mail, Phone } from "lucide-react";
import RealmBrand from "../layout/RealmBrand";

const Footer = ({ locale }) => {
  const isVi = locale === "vi";
  const currentYear = new Date().getFullYear();

  const exhibitions = [
    isVi
      ? "Kỷ Tam Điệp (252 - 201 triệu năm)"
      : "Triassic Period (252-201 Mya)",
    isVi ? "Kỷ Jura (201 - 145 triệu năm)" : "Jurassic Period (201-145 Mya)",
    isVi
      ? "Kỷ Phấn Trắng (145 - 66 triệu năm)"
      : "Cretaceous Period (145-66 Mya)",
  ];

  const museum = [
    isVi ? "Dòng thời gian địa chất" : "Geological Timeline",
    isVi ? "Hiện vật nổi bật" : "Featured Specimens",
    isVi ? "Bản đồ bảo tàng" : "Museum Map",
  ];

  const visitInfo = [
    isVi ? "Mở cửa 24/7" : "Online: 24/7",
    isVi ? "Cập nhật hàng tuần" : "Updated: Weekly",
    isVi ? "Hoàn toàn miễn phí" : "Completely Free",
    isVi ? "Mọi thiết bị" : "All Devices",
  ];

  const contactItems = [
    { icon: Mail, label: "realm.trinova@gmail.com" },
    { icon: Phone, label: "0903 545 899" },
    { icon: Globe, label: isVi ? "Hỗ trợ 24/7" : "Available 24/7 online" },
  ];

  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{
        background: "var(--theme-nav-surface)",
        borderTop: "1px solid var(--theme-nav-border)",
        boxShadow: "var(--theme-nav-shadow)",
        transition:
          "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(245,158,11,0.08) 0%, transparent 45%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div>
            <div className="mb-4">
              <RealmBrand
                logoSize={76}
                titleClassName="text-[2rem]"
                subtitleFontSize={14}
              />
            </div>

            <p
              className="text-xs leading-6 italic mb-4"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {isVi
                ? "Bảo tàng ảo đầu tiên của Việt Nam về khủng long và cổ sinh vật học. Không cần kính VR."
                : "Vietnam's first immersive virtual museum on dinosaurs and paleontology. No VR headset needed."}
            </p>

            <ul
              className="space-y-2.5 text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {contactItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(245,158,11,0.08)",
                      border: "1px solid rgba(245,158,11,0.16)",
                      color: "var(--theme-accent)",
                    }}
                  >
                    <Icon size={12} strokeWidth={2.1} />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--theme-accent)" }}
            >
              {isVi ? "Trưng bày" : "Exhibitions"}
            </h4>
            <ul
              className="space-y-2.5 text-sm"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {exhibitions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--theme-accent)" }}
            >
              {isVi ? "Bảo tàng" : "Museum"}
            </h4>
            <ul
              className="space-y-2.5 text-sm"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {museum.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--theme-accent)" }}
            >
              {isVi ? "Giờ tham quan" : "Visit Hours"}
            </h4>
            <ul
              className="space-y-2.5 text-sm"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {visitInfo.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="h-px mt-8 mb-4"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--theme-nav-border), transparent)",
          }}
        />
        <div
          className="text-center text-xs"
          style={{ color: "var(--theme-text-dim)" }}
        >
          © {currentYear} R.E.A.L.M. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
