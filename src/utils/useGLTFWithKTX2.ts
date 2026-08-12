import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { KTX2Loader } from 'three-stdlib';
import { useMemo } from 'react';

let ktx2Loader: KTX2Loader | null = null;
let loaderInitialized = false;

export function useGLTFWithKTX2(url: string) {
  const gl = useThree((state) => state.gl);
  
  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader().setTranscoderPath('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r167/examples/jsm/libs/basis/');
  }
  
  // We must call detectSupport with the WebGLRenderer instance
  if (!loaderInitialized && gl) {
    ktx2Loader.detectSupport(gl);
    loaderInitialized = true;
  }

  const extendLoader = useMemo(() => {
    return (loader: any) => {
      if (ktx2Loader) {
        loader.setKTX2Loader(ktx2Loader);
      }
    };
  }, []);

  return useGLTF(url, true, true, extendLoader);
}
