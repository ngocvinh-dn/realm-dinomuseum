import { useState } from "react";
import DinosaurPopup from "../components/museum/DinosaurPopup";

export default function PopupTestPage() {
  const [show, setShow] = useState(true);

  const mockDinosaur = {
    id: 1,
    common_name_vi: "Khủng long bạo chúa",
    common_name_en: "Tyrannosaurus Rex",
    scientific_name: "Tyrannosaurus rex",
    description_vi:
      "Một trong những loài khủng long ăn thịt lớn nhất từng tồn tại.",
    description_en:
      "One of the largest carnivorous dinosaurs ever to exist.",
    diet: "carnivore",
    length_m: 12,
    height_m: 4,
    weight_kg: 8000,
    habitat_vi: "Rừng nhiệt đới",
    habitat_en: "Tropical forest",
    discovery_location: "Bắc Mỹ",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Tyrannosaurus_Rex_Holotype.jpg",

    eras: {
      slug: "jurassic",
      name_vi: "Kỷ Jura",
      name_en: "Jurassic",
    },

    dinosaur_facts: [
      {
        id: 1,
        fact_type: "Size",
        content_vi: "Có thể dài tới 12 mét.",
        content_en: "Could reach up to 12 meters in length.",
        order_index: 1,
      },
      {
        id: 2,
        fact_type: "Teeth",
        content_vi: "Răng dài tới 30cm.",
        content_en: "Teeth could reach 30cm.",
        order_index: 2,
      },
      {
        id: 3,
        fact_type: "Speed",
        content_vi: "Chạy khoảng 20 km/h.",
        content_en: "Could run around 20 km/h.",
        order_index: 3,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0a0804",
        position: "relative",
      }}
    >
      <button
        onClick={() => setShow(true)}
        style={{ position: "absolute", top: 20, left: 20 }}
      >
        Show Popup
      </button>

      {show && (
        <DinosaurPopup
          dinosaur={mockDinosaur}
          language="vi"
          onClose={() => setShow(false)}
          onRevive={(dino) => console.log("Revive:", dino)}
        />
      )}
    </div>
  );
}