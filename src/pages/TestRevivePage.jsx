import TestReviveScene from "../components/scene/TestReviveScene";

const testExhibit = {
  id: "test-exhibit-1",
  dinosaur_id: "test-dino-1",
  era_id: "test-era-1",

  position: [0, 0, 0],
  rotation: [0, 0, 0],
  modelScale: 0.3,
  
  reviveOffset: [0, 0, 0],
  revivedScale: 1.2,
  revivedRotation: [0, -Math.PI, 0],
    
  isInteractive: true,
  order_index: 1,

  dinosaurs: {
    id: "test-dino-1",
    era_id: "test-era-1",

    scientific_name: "Triceratops horridus",
    slug: "triceratops",
    common_name_vi: "Khủng long ba sừng",
    common_name_en: "Triceratops",

    diet: "herbivore",
    length_m: 9,
    height_m: 3,
    weight_kg: 12000,

    habitat_vi: "Đồng bằng ngập lụt và rừng thưa cuối kỷ Phấn Trắng.",
    habitat_en: "Floodplains and open woodlands in the Late Cretaceous.",

    description_vi:
      "Triceratops là một loài khủng long ăn thực vật nổi bật với ba chiếc sừng và tấm khiên xương lớn phía sau đầu.",
    description_en:
      "Triceratops was a herbivorous dinosaur known for its three horns and large bony frill.",

    discovery_location: "Bắc Mỹ",
    image_url: null,

    fossil_model_url:
      "https://pub-62f0025b68a84e4a8cc1f0fcd8cd8664.r2.dev/fossils/Cretaceous/triceratops.glb",

    revived_model_url:
      "https://pub-62f0025b68a84e4a8cc1f0fcd8cd8664.r2.dev/revived/Cretaceous/triceratops.glb",

    eras: {
      id: "test-era-1",
      slug: "cretaceous",
      name_vi: "Kỷ Phấn Trắng",
      name_en: "Cretaceous",
      description_vi: "Giai đoạn cuối của Đại Trung Sinh.",
      description_en: "The final period of the Mesozoic Era.",
    },

    dinosaur_facts: [
      {
        id: "fact-1",
        fact_type: "defense",
        content_vi:
          "Ba chiếc sừng có thể được dùng để tự vệ hoặc thu hút bạn tình.",
        content_en:
          "Its three horns may have been used for defense or display.",
        order_index: 1,
      },
      {
        id: "fact-2",
        fact_type: "diet",
        content_vi: "Triceratops có mỏ cứng giúp cắt thực vật dai.",
        content_en: "Triceratops had a strong beak for cutting tough plants.",
        order_index: 2,
      },
    ],
  },
};

export default function TestRevivePage() {
  return <TestReviveScene exhibit={testExhibit} />;
}