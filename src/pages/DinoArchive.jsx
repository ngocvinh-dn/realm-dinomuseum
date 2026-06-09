import React, { useEffect, useState, useRef } from "react";

import { Viewer, Entity, PointGraphics } from "resium";

import { Cartesian3, Color, Ion } from "cesium";

import { supabase } from "../../supabase/supabaseclinet/supabase-clinet";

Ion.defaultAccessToken = "YOUR_CESIUM_ION_TOKEN";

export default function DinoArchive() {
  const [dinos, setDinos] = useState([]); // Chứa 30 loài

  const [selectedDino, setSelectedDino] = useState(null);

  const viewerRef = useRef(null);

  // 1. Kéo data từ Supabase

  useEffect(() => {
    const fetchDinos = async () => {
      const { data, error } = await supabase
        .from("fossil_locations")
        .select("*");

      if (data) setDinos(data);
    };

    fetchDinos();
  }, []);

  // 2. Hàm xử lý khi chọn một loài (Fly Camera)

  const handleSelectDino = (dino) => {
    setSelectedDino(dino);

    if (viewerRef.current && viewerRef.current.cesiumElement) {
      viewerRef.current.cesiumElement.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          dino.longitude,
          dino.latitude,
          15000,
        ), // Bay đến tọa độ, cao 15km

        duration: 2, // Thời gian bay 2 giây
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#000",
      }}
    >
      {/* TRÁI: QUẢ ĐỊA CẦU 3D */}

      <div style={{ flex: 1, position: "relative" }}>
        <Viewer
          full
          ref={viewerRef}
          timeline={false} // Tắt thanh thời gian cho đẹp
          animation={false} // Tắt la bàn
          baseLayerPicker={false} // Tắt chọn bản đồ mặc định
        >
          {dinos.map((dino) => (
            <Entity
              key={dino.id}
              name={dino.name}
              position={Cartesian3.fromDegrees(dino.longitude, dino.latitude)}
              onClick={() => handleSelectDino(dino)}
            >
              <PointGraphics
                pixelSize={12}
                color={Color.fromCssColorString("#f59e0b")}
                outlineWidth={2}
              />
            </Entity>
          ))}
        </Viewer>
      </div>

      {/* PHẢI: BẢNG THÔNG TIN (HÀNH TRÌNH KHÁM PHÁ) */}

      <div
        className="info-sidebar"
        style={{
          width: "400px",
          background: "#0a0804",
          padding: "20px",
          overflowY: "auto",
          borderLeft: "1px solid #f59e0b44",
        }}
      >
        {selectedDino ? (
          <div>
            <h1 style={{ color: "#f59e0b", fontFamily: "Playfair Display" }}>
              {selectedDino.name}
            </h1>

            <img
              src={selectedDino.image_url}
              style={{ width: "100%", borderRadius: "12px", margin: "15px 0" }}
            />

            <p style={{ color: "#ccc" }}>
              📍 <b>Vị trí:</b> {selectedDino.location_province},{" "}
              {selectedDino.country}
            </p>

            <p style={{ color: "#ccc" }}>
              🦴 <b>Bộ phận:</b> {selectedDino.fossil_parts}
            </p>

            <div
              style={{
                background: "#f59e0b11",
                padding: "15px",
                borderLeft: "3px solid #f59e0b",
                marginTop: "20px",
              }}
            >
              <p style={{ fontStyle: "italic", color: "#fbbf24" }}>
                {selectedDino.fun_fact}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ color: "#666", textAlign: "center", marginTop: "50%" }}>
            Chọn một điểm hóa thạch trên địa cầu để khám phá...
          </p>
        )}
      </div>
    </div>
  );
}
