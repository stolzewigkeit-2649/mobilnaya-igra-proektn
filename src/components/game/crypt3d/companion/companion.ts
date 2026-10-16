import * as THREE from 'three';

export const companion = {
  timon: false,
  pos: new THREE.Vector3(0, 0, 0),
  head: new THREE.Vector3(0, 1.6, 0),
  rise: 1,
};

export function setTimon(on: boolean, at?: THREE.Vector3, rising = false) {
  companion.timon = on;
  if (at) companion.pos.copy(at);
  companion.rise = rising ? 0 : 1;
}
