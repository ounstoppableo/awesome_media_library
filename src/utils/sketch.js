import gsap, { Power2 } from "gsap";
import * as THREE from "three";
import { checkIsNone } from "./convention";

function isVideo(url = "") {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

class Sketch {
  constructor(opts) {
    this.contentId = opts.contentId;
    this.sliderId = opts.sliderId;
    this.eventRigisters = opts.eventRigisters;
    this.scene = new THREE.Scene();
    this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
    this.fragment = opts.fragment;
    this.uniforms = opts.uniforms;
    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.duration = opts.duration || 1;
    this.debug = opts.debug || false;
    this.easing = opts.easing || "easeInOut";
    this.noiseAngle = opts.noiseAngle || 0;
    this.displacement = opts.displacement;
    this.container = document.getElementById(this.contentId);
    this.direction = -1;
    this.destroyFlag = false;
    this.initiateErrorCb = opts.initiateErrorCb;

    this.slider = document.getElementById(this.sliderId);
    this.images = opts.images;
    this.width = this.slider.offsetWidth;
    this.height = this.slider.offsetHeight;
    this.slider.appendChild(this.renderer.domElement);
    this.currentRequestAnimation;
    this.imagesLoadedCb = opts.imagesLoadedCb;
    this.texturesSize = [];

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );

    this.camera.position.set(0, 0, 2);
    this.time = 0;
    this.current = 0;
    this.textures = [];

    this.paused = true;
    this.initiate(() => {
      this.setupResize();
      this.settings();
      this.addObjects();
      this.resize();
      this.play();
    });
  }

  videoDoms = [];
  eventClear = [];
  videoPlay() {
    this.videoDoms.forEach((video, index) => {
      if (
        index === this.current ||
        index === (this.current + 1) % this.textures.length ||
        index ===
          (this.current - 1 + this.textures.length) % this.textures.length
      ) {
        video?.play();
      } else {
        video?.pause();
      }
    });
  }
  loadVideoTexture(url, textureIndex) {
    return new Promise(async (resolve, reject) => {
      const absUrl = new URL(url, location.href).href;
      let video = this.videoDoms.find((v) => v?.src === absUrl);
      if (!video) {
        video = document.createElement("video");
        video.src = absUrl;
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
      }
      this.videoDoms[textureIndex] = video;

      const onReady = () => {
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
        this.textures[textureIndex] = texture;
        resolve(texture);
      };

      if (video.readyState >= video.HAVE_METADATA) {
        onReady();
      } else {
        video.addEventListener("loadedmetadata", onReady, { once: true });
        video.addEventListener("error", (e) => {
          reject(e);
        });
      }

      video.play().catch(() => {});
    });
  }

  async updateImages() {
    for (let i = 0; i < this.images.length; i++) {
      const url = this.images[i];
      await new Promise(async (resolve, reject) => {
        if (isVideo(url)) {
          await this.loadVideoTexture(url, i);
          resolve(1);
        } else {
          this.textures[i] = new THREE.TextureLoader().load(
            url,
            resolve,
            undefined,
            reject,
          );
        }
      });
      this.texturesSize.push({
        width: this.textures[i].width,
        height: this.textures[i].height,
      });
    }
    this.imagesLoadedCb?.();
  }

  async initiate(cb) {
    try {
      await Promise.all([this.updateImages()]).then(() => {
        if (this.destroyFlag) return;
        this.videoPlay();
        this.eventRigister();
        cb();
      });
    } catch (err) {
      this.initiateErrorCb?.(err);
      this.destroy();
    }
  }

  eventRigister() {
    if (this.eventRigisters) {
      this.eventRigisters.map((eventRigister) => {
        const _cb = (e) =>
          eventRigister.cb(e, this.prev.bind(this), this.next.bind(this), this);
        this.container.addEventListener(eventRigister.event, _cb);
        this.eventClear.push(() => {
          this.container.removeEventListener(eventRigister.event, _cb);
        });
        return () => {
          this.container.removeEventListener(eventRigister.event, _cb);
        };
      });
    }
  }
  settings() {
    let that = this;
    if (this.debug) this.gui = new dat.GUI();
    this.settings = { progress: 0.5 };

    Object.keys(this.uniforms).forEach((item) => {
      this.settings[item] = this.uniforms[item].value;
      if (this.debug)
        this.gui.add(
          this.settings,
          item,
          this.uniforms[item].min,
          this.uniforms[item].max,
          0.01,
        );
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  // cover
  computedImageFit(prevIndex, currentIndex) {
    const prevSize = this.texturesSize[prevIndex];
    const currentSize =
      this.texturesSize[
        checkIsNone(currentIndex) ? this.current : currentIndex
      ];
    if (
      !prevSize ||
      currentSize.width !== prevSize.height ||
      currentSize.height !== prevSize.height
    ) {
      this.imageAspect = currentSize.height / currentSize.width;
      let a1;
      let a2;
      if (this.height / this.width > this.imageAspect) {
        a1 = (this.width / this.height) * this.imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = this.height / this.width / this.imageAspect;
      }

      this.material.uniforms.resolution.value.x = this.width;
      this.material.uniforms.resolution.value.y = this.height;
      this.material.uniforms.resolution.value.z = a1;
      this.material.uniforms.resolution.value.w = a2;
    }
  }

  resize() {
    this.width = this.slider.offsetWidth;
    this.height = this.slider.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.computedImageFit();
    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    this.plane.scale.x = this.camera.aspect;
    this.plane.scale.y = 1;

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        border: { type: "f", value: 0 },
        intensity: { type: "f", value: 0 },
        scaleX: { type: "f", value: 40 },
        scaleY: { type: "f", value: 40 },
        transition: { type: "f", value: 40 },
        swipe: { type: "f", value: 0 },
        width: { type: "f", value: 0 },
        radius: { type: "f", value: 0 },
        texture1: { type: "f", value: this.textures[0] },
        texture2: { type: "f", value: this.textures[1] },
        displacement: {
          type: "f",
          value:
            this.displacement &&
            new THREE.TextureLoader().load(this.displacement),
        },
        angle: {
          value: this.noiseAngle,
        },
        direction: {
          value: this.direction,
        },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // wireframe: true,
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    this.render();
  }

  prev() {
    if (this.isRunning) return this.isRunning;
    const len = this.textures.length;
    const nextIndex = (this.current - 1 + len) % len;
    this.computedImageFit(this.current, nextIndex);
    this.material.uniforms.direction.value = 1;
    const nextTexture = this.textures[nextIndex];
    this.material.uniforms.texture2.value = nextTexture;

    const onComplete = () => {
      this.current = nextIndex;
      this.material.uniforms.texture1.value = nextTexture;
      this.material.uniforms.progress.value = 0;
      this.isRunning = null;
      this.videoPlay();
      _resolve(this.current);
    };
    let _resolve;
    this.isRunning = new Promise((resolve) => {
      _resolve = resolve;
    });
    gsap.to(this.material.uniforms.progress, {
      overwrite: true,
      value: 1,
      ease: Power2[this.easing],
      duration: this.duration,
      onComplete: onComplete,
    });
    return this.isRunning;
  }

  next() {
    if (this.isRunning) return this.isRunning;
    const len = this.textures.length;
    this.material.uniforms.direction.value = -1;
    const nextIndex = (this.current + 1) % len;
    this.computedImageFit(this.current, nextIndex);
    const nextTexture = this.textures[nextIndex];
    this.material.uniforms.texture2.value = nextTexture;

    const onComplete = () => {
      this.current = nextIndex;
      this.material.uniforms.texture1.value = nextTexture;
      this.material.uniforms.progress.value = 0;
      this.isRunning = null;
      this.videoPlay();
      _resolve(this.current);
    };

    let _resolve;
    this.isRunning = new Promise((resolve) => {
      _resolve = resolve;
    });
    gsap.to(this.material.uniforms.progress, {
      overwrite: true,
      value: 1,
      ease: Power2[this.easing],
      duration: this.duration,
      onComplete: onComplete,
    });
    return this.isRunning;
  }

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    // this.material.uniforms.progress.value = this.settings.progress;

    Object.keys(this.uniforms).forEach((item) => {
      this.material.uniforms[item].value = this.settings[item];
    });
    // this.camera.position.z = 3;
    // this.plane.rotation.y = 0.4*Math.sin(this.time)
    // this.plane.rotation.x = 0.5*Math.sin(0.4*this.time)
    this.currentRequestAnimation = requestAnimationFrame(
      this.render.bind(this),
    );
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.destroyFlag = true;
    this.eventClear.forEach((cb) => cb());
    this.videoDoms.forEach((video) => {
      video.remove();
    });
    this.renderer.domElement.remove();
    this.renderer.dispose();
    cancelAnimationFrame(this.currentRequestAnimation);
  }
}

export default Sketch;
