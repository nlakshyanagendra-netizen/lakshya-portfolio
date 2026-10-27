// Shared single-instance store for pointer + section state.
// Read by the scroll-reactive background and the cursor-lightning overlay.
// The cursor stays "active" once the visitor has moved it at least once,
// even when idle, so lightning keeps reacting to nearby elements.

export type PetBounds = { x: number; y: number; r: number };

class PointerStore {
  x = -9999;
  y = -9999;
  active = false;
  hasMoved = false; // once true, stays true — idle cursor is still "active"
  petBounds: PetBounds | null = null;

  setPointer(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.active = true;
    this.hasMoved = true;
  }
  clearPointer() {
    // keep active=true after first move so idle cursor still arcs
    if (!this.hasMoved) this.active = false;
  }
  setPetBounds(b: PetBounds | null) {
    this.petBounds = b;
  }
}

export const pointer = new PointerStore();
