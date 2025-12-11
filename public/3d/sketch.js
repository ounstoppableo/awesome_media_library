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

    this.slider = document.getElementById(this.sliderId);
    this.images = JSON.parse(this.slider.getAttribute("data-images"));
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

  initiate(cb) {
    const promises = [];
    let that = this;
    this.images.forEach((url, i) => {
      let promise = new Promise((resolve) => {
        that.textures[i] = new THREE.TextureLoader().load(url, resolve);
      });
      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      cb();
    });
  }

  eventRigister() {
    if (this.eventRigisters) {
      this.eventRigisters.map((eventRigister) => {
        const _cb = (e) =>
          eventRigister.cb(e, this.prev.bind(this), this.next.bind(this));
        this.container.addEventListener(eventRigister.event, _cb);
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
    if (this.isRunning) return null;
    const len = this.textures.length;
    const nextIndex = (this.current - 1 + len) % len;
    this.material.uniforms.direction.value = -1;
    const nextTexture = this.textures[nextIndex];
    this.material.uniforms.texture2.value = nextTexture;

    const onComplete = () => {
      this.current = nextIndex;
      this.material.uniforms.texture1.value = nextTexture;
      this.material.uniforms.progress.value = 0;
      this.isRunning = null;
      _resolve(this.current);
    };
    let _resolve;
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    this.isRunning = gsap.to(this.material.uniforms.progress, {
      overwrite: true,
      value: 1,
      ease: Power2[this.easing],
      duration: this.duration,
      onComplete: onComplete,
    });
    return promise;
  }

  next() {
    if (this.isRunning) return null;
    const len = this.textures.length;
    this.material.uniforms.direction.value = 1;
    const nextIndex = (this.current + 1) % len;
    const nextTexture = this.textures[nextIndex];
    this.material.uniforms.texture2.value = nextTexture;

    const onComplete = () => {
      this.current = nextIndex;
      this.material.uniforms.texture1.value = nextTexture;
      this.material.uniforms.progress.value = 0;
      this.isRunning = null;
      _resolve(this.current);
    };

    let _resolve;
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    this.isRunning = gsap.to(this.material.uniforms.progress, {
      overwrite: true,
      value: 1,
      ease: Power2[this.easing],
      duration: this.duration,
      onComplete: onComplete,
    });
    return promise;
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

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

window.Sketch = Sketch;
