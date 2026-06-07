import { useProgress } from "@react-three/drei";
import LoadingScreen from "../common/LoadingScreen";

export default function MuseumLoader({ isFetchingAssets = false }) {
  const { progress, active } = useProgress();

  if (!isFetchingAssets && !active && progress >= 100) {
    return null;
  }

  return (
    <LoadingScreen
      progress={isFetchingAssets ? 10 : progress}
      message={
        isFetchingAssets
          ? "Retrieving museum data..."
          : "Loading museum model..."
      }
    />
  );
}
