import { WebGLRenderer, PerspectiveCamera, Color, Scene, Vector3 } from "three";

class Engine {
  constructor(w, h, { backgroundColor, z = 10 } = {}) {
    this.width = w;
    this.height = h;
    this.meshCount = 0;
    this.destroyFlag = false;
    this.fov = 50;
    this.meshListeners = [];
    this.devicePixelRatio = window.devicePixelRatio
      ? Math.min(1.6, window.devicePixelRatio)
      : 1;
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(this.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    if (backgroundColor !== undefined)
      this.renderer.setClearColor(new Color(backgroundColor));
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      this.fov,
      this.width / this.height,
      1,
      1000,
    );
    this.camera.position.set(0, 0, z);

    this.dom = this.renderer.domElement;

    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);
  }

  /**
   * * *******************
   * * SCENE MANAGMENT
   * * *******************
   */

  updateSize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  add(mesh) {
    this.scene.add(mesh);
    if (!mesh.update) return;
    this.meshListeners.push(mesh.update);
    this.meshCount++;
  }
  remove(mesh) {
    this.scene.remove(mesh);
    if (!mesh?.update) return;
    const index = this.meshListeners.indexOf(mesh.update);
    if (index > -1) this.meshListeners.splice(index, 1);
    this.meshCount--;
  }
  clear() {
    this.destroyFlag = true;
    this.scene.clear();
    requestAnimationFrame(() => {
      this.destroyFlag = false;
      this.start();
    });
  }

  start() {
    this.update();
  }

  // Update render
  update() {
    if (this.destroyFlag) return;
    let i = this.meshCount;
    while (--i >= 0) {
      this.meshListeners[i].apply(this, null);
    }
    this.render();
    // Loop
    requestAnimationFrame(this.update);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // Resize
  resize(w, h) {
    this.width = w;
    this.height = h;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.resizeRender();
  }

  resizeRender() {
    this.renderer.setSize(this.width, this.height);
  }
  destroy() {
    this.renderer.domElement.remove();
    this.renderer.dispose();
    this.scene.clear();
    this.destroyFlag = true;
  }
}

export { Engine };
