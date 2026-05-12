const DINOSAUR_IMAGE_MAP = {
  eoraptor: "/images/Eoraptor_lunensis.png",
  "eoraptor lunensis": "/images/Eoraptor_lunensis.png",
  coelophysis: "/images/Coelophysis_bauri.png",
  "coelophysis bauri": "/images/Coelophysis_bauri.png",
  plateosaurus: "/images/Plateosaurus.png",
  "plateosaurus engelhardti": "/images/Plateosaurus.png",
  camarasaurus: "/images/Camarasaurus.png",
  styracosaurus: "/images/Styracosaurus%20.png",
  triceratops: "/images/Triceratops.png",
  "triceratops horridus": "/images/Triceratops.png",
  tyrannosaurus: "/images/Tyrannosaurus_rex.png",
  "tyrannosaurus rex": "/images/Tyrannosaurus_rex.png",
  "t-rex": "/images/Tyrannosaurus_rex.png",
  trex: "/images/Tyrannosaurus_rex.png",
  velociraptor: "/images/dino_velociraptor.png",
};

const DINOSAUR_IMAGE_POSITION_MAP = {
  eoraptor: "18% center",
  coelophysis: "18% center",
  plateosaurus: "24% center",
  camarasaurus: "34% center",
  styracosaurus: "center center",
  triceratops: "center center",
  tyrannosaurus: "center 22%",
  velociraptor: "center center",
};

const DINOSAUR_IMAGE_PRESENTATION_MAP = {
  eoraptor: { objectFit: "cover", scale: 1 },
  coelophysis: { objectFit: "cover", scale: 1 },
  plateosaurus: { objectFit: "cover", scale: 1 },
  camarasaurus: { objectFit: "cover", scale: 1 },
  styracosaurus: { objectFit: "cover", scale: 1 },
  triceratops: { objectFit: "cover", scale: 1 },
  tyrannosaurus: { objectFit: "cover", scale: 1 },
  velociraptor: { objectFit: "cover", scale: 1 },
};

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getDinosaurImage(dinosaur) {
  const candidates = [
    dinosaur?.scientific_name,
    dinosaur?.common_name_en,
    dinosaur?.common_name_vi,
    dinosaur?.slug,
  ]
    .map(normalizeName)
    .filter(Boolean);

  for (const candidate of candidates) {
    if (DINOSAUR_IMAGE_MAP[candidate]) {
      return DINOSAUR_IMAGE_MAP[candidate];
    }
  }

  for (const candidate of candidates) {
    const match = Object.entries(DINOSAUR_IMAGE_MAP).find(([key]) =>
      candidate.includes(key) || key.includes(candidate)
    );

    if (match) {
      return match[1];
    }
  }

  return dinosaur?.image_url || null;
}

export function getDinosaurImagePosition(dinosaur, fallback = "center center") {
  const candidates = [
    dinosaur?.scientific_name,
    dinosaur?.common_name_en,
    dinosaur?.common_name_vi,
    dinosaur?.slug,
  ]
    .map(normalizeName)
    .filter(Boolean);

  for (const candidate of candidates) {
    if (DINOSAUR_IMAGE_POSITION_MAP[candidate]) {
      return DINOSAUR_IMAGE_POSITION_MAP[candidate];
    }
  }

  for (const candidate of candidates) {
    const match = Object.entries(DINOSAUR_IMAGE_POSITION_MAP).find(([key]) =>
      candidate.includes(key) || key.includes(candidate)
    );

    if (match) {
      return match[1];
    }
  }

  return fallback;
}

export function getDinosaurImagePresentation(
  dinosaur,
  fallback = { objectFit: "cover", scale: 1 }
) {
  const candidates = [
    dinosaur?.scientific_name,
    dinosaur?.common_name_en,
    dinosaur?.common_name_vi,
    dinosaur?.slug,
  ]
    .map(normalizeName)
    .filter(Boolean);

  for (const candidate of candidates) {
    if (DINOSAUR_IMAGE_PRESENTATION_MAP[candidate]) {
      return DINOSAUR_IMAGE_PRESENTATION_MAP[candidate];
    }
  }

  for (const candidate of candidates) {
    const match = Object.entries(DINOSAUR_IMAGE_PRESENTATION_MAP).find(([key]) =>
      candidate.includes(key) || key.includes(candidate)
    );

    if (match) {
      return match[1];
    }
  }

  return fallback;
}
