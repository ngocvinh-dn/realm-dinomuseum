import { useGLTF } from "@react-three/drei";
import { getSceneAssets } from "./sceneAssetsService";
import { getEnvironmentBySlug } from "./environmentService";
import { getExhibitsByEraSlug } from "./exhibitsService";

const _urlCache = new Map();    
const _fetchPromises = new Map();   
const _preloadedUrls = new Set();   

function _preloadGLB(url) {
  if (!url || _preloadedUrls.has(url)) return;
  _preloadedUrls.add(url);
  try {
    useGLTF.preload(url);
  } catch (e) {
    console.warn("[assetPreloader] preload failed:", url, e);
  }
}

function _dedup(key, fn) {
  if (_fetchPromises.has(key)) return _fetchPromises.get(key);
  const p = fn().finally(() => _fetchPromises.delete(key));
  _fetchPromises.set(key, p);
  return p;
}

export function prefetchMuseumAssets() {
  return _dedup("museum", async () => {
    try {
      const assets = await getSceneAssets();

      _urlCache.set("museum_env", assets.asset_url);
      _urlCache.set("fossil_triassic", assets.triassic_fossil_url);
      _urlCache.set("fossil_jurassic", assets.jurassic_fossil_url);
      _urlCache.set("fossil_cretaceous", assets.cretaceous_fossil_url);

      [
        assets.asset_url,
        assets.triassic_fossil_url,
        assets.jurassic_fossil_url,
        assets.cretaceous_fossil_url,
      ].forEach(_preloadGLB);

      return assets;
    } catch (err) {
      console.warn("[assetPreloader] Museum prefetch failed:", err);
      return null;
    }
  });
}

export function getCachedMuseumAssets() {
  const asset_url = _urlCache.get("museum_env");
  if (!asset_url) return null;
  return {
    asset_url,
    triassic_fossil_url: _urlCache.get("fossil_triassic") || null,
    jurassic_fossil_url: _urlCache.get("fossil_jurassic") || null,
    cretaceous_fossil_url: _urlCache.get("fossil_cretaceous") || null,
  };
}

export async function prefetchEraAssets(slug) {
  if (!slug) return null;

  return _dedup(`era_${slug}`, async () => {
    try {
      const [eraData, exhibitData] = await Promise.all([
        getEnvironmentBySlug(slug),
        getExhibitsByEraSlug(slug),
      ]);

      if (eraData?.environment_map_url) {
        _urlCache.set(`era_env_${slug}`, eraData.environment_map_url);
        _preloadGLB(eraData.environment_map_url);
      }

      // Preload fossil + revived models nếu có
      (exhibitData || []).forEach((exhibit) => {
        const dino = exhibit.dinosaur;
        if (dino?.fossil_model_url) {
          _preloadGLB(dino.fossil_model_url);
        }
      });

      _urlCache.set(`era_data_${slug}`, JSON.stringify(eraData));
      _urlCache.set(`exhibits_data_${slug}`, JSON.stringify(exhibitData || []));

      return { eraData, exhibitData: exhibitData || [] };
    } catch (err) {
      console.warn(`[assetPreloader] Era prefetch (${slug}) failed:`, err);
      return null;
    }
  });
}

/** Lấy cached era data nếu đã prefetch. */
export function getCachedEraData(slug) {
  const eraRaw = _urlCache.get(`era_data_${slug}`);
  const exhibitsRaw = _urlCache.get(`exhibits_data_${slug}`);
  if (!eraRaw) return null;
  try {
    return {
      eraData: JSON.parse(eraRaw),
      exhibitData: exhibitsRaw ? JSON.parse(exhibitsRaw) : [],
    };
  } catch {
    return null;
  }
}
