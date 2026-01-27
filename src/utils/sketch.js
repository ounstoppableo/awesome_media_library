import gsap, { Power2 } from "gsap";
import * as THREE from "three";

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

    this.slider = document.getElementById(this.sliderId);
    this.images = opts.images;
    this.width = this.slider.offsetWidth;
    this.height = this.slider.offsetHeight;
    this.slider.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
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

  canvasDom = [];
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
        const canvas = document.createElement("canvas");
        this.canvasDom.push(canvas);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.flipY = true;
        texture.colorSpace = THREE.SRGBColorSpace;
        const update = () => {
          if (video.readyState >= video.HAVE_CURRENT_DATA) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            texture.needsUpdate = true;
          }
        };
        this.videoUpdaters ??= [];
        this.videoUpdaters.push(update);

        this.textures[textureIndex] = texture;
        resolve(texture);
      };

      if (video.readyState >= video.HAVE_METADATA) {
        onReady();
      } else {
        video.addEventListener("loadedmetadata", onReady, { once: true });
      }

      video.play().catch(() => {});
    });
  }

  async updateImages() {
    for (let i = 0; i < this.images.length; i++) {
      const url = this.images[i];
      await new Promise(async (resolve) => {
        if (isVideo(url)) {
          await this.loadVideoTexture(url, i);
          resolve(1);
        } else {
          this.textures[i] = new THREE.TextureLoader().load(url, resolve);
        }
      });
    }
  }

  initiate(cb) {
    Promise.all([this.updateImages()]).then(() => {
      if (this.destroyFlag) return;
      this.videoPlay();
      this.eventRigister();
      cb();
    });
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
          0.01
        );
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.slider.offsetWidth;
    this.height = this.slider.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // image cover
    this.imageAspect =
      this.textures[0].image.height / this.textures[0].image.width;
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
    this.videoUpdaters?.forEach((fn) => fn());
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.destroyFlag = true;
    this.eventClear.forEach((cb) => cb());
    this.videoDoms.forEach((video) => {
      video.remove();
    });
    this.canvasDom.forEach((canvas) => {
      canvas.remove();
    });
    this.renderer.domElement.remove();
    this.renderer.dispose();
  }
}

export default Sketch;
