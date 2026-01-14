import { TimelineLite, Back } from "gsap";
import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  ShapeGeometry,
} from "three/src/Three.Core.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import fontFile from "@/utils/fontFile";

const fontLoader = new FontLoader();
const font = fontLoader.parse(fontFile);

const FIX = 1.25;
function pxToWorld(px, camera, container) {
  const fovRad = (camera.fov * Math.PI) / 180;
  const worldHeight = 2 * camera.position.z * Math.tan(fovRad / 2);
  const worldPerPixel = worldHeight / container.clientHeight;

  return px * worldPerPixel;
}

function remToWorld(rem, camera, container) {
  const px =
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  return pxToWorld(px / FIX, camera, container);
}

export class AnimatedText3D extends Object3D {
  constructor(
    text,
    {
      size = 0.8,
      letterSpacing = 0.02,
      color = "#000000",
      duration = 0.3,
      opacity = 1,
      wireframe = false,
      lineHeight = 1.2,
      xEdge = 9999,
      yEdge = 9999,
      basicY = 0,
    } = {}
  ) {
    super();
    this.position.y = basicY;
    this.containerBasicY = basicY;
    this.basePositionX = 0;
    this.basePositionY = 0;
    this.size = size;

    const letters = [...text];
    this.overflow = null;
    let spaceCount = 0;
    const createMesh = (letter) => {
      const geom = new ShapeGeometry(font.generateShapes(letter, size, 1));
      geom.computeBoundingBox();
      const mat = new MeshBasicMaterial({
        color,
        opacity: 0,
        transparent: true,
        wireframe,
      });
      const mesh = new Mesh(geom, mat);

      mesh.position.x = this.basePositionX;
      mesh.position.y = this.basePositionY;
      mesh.userData.baseY = this.basePositionY;
      this.basePositionX += geom.boundingBox.max.x + letterSpacing;
      return mesh;
    };
    letters.forEach((letter, index) => {
      if (letter === " ") {
        spaceCount++;
        this.basePositionX += size * 0.5;
        let nextSpace = 0;
        for (let i = index + 1; i < letters.length; i++) {
          if (letters[i] === " " || i === letters.length - 1) {
            nextSpace = i;
            break;
          }
        }

        const wordCharCount = nextSpace - index > 0 ? nextSpace - index + 1 : 1;

        if (this.basePositionX + wordCharCount * size >= xEdge) {
          this.basePositionX = 0;
          // 查看下行的底部是否越线，一般越过一个size和一个lineHeight，但由于最顶部和最下部也有一半的lineHeight，所以总共减去两个lineHeight
          if (
            Math.abs(
              this.basePositionY - lineHeight - lineHeight - size - basicY
            ) >= yEdge &&
            typeof this.overflow !== "number"
          ) {
            this.overflow = index - spaceCount;
            this.children[this.overflow - 1].geometry.dispose();
            this.children[this.overflow - 1].geometry = new ShapeGeometry(
              font.generateShapes(".", size, 1)
            );
            this.children[this.overflow - 2].geometry.dispose();
            this.children[this.overflow - 2].geometry = new ShapeGeometry(
              font.generateShapes(".", size, 1)
            );
            this.children[this.overflow - 3].geometry.dispose();
            this.children[this.overflow - 3].geometry = new ShapeGeometry(
              font.generateShapes(".", size, 1)
            );
          }
          this.basePositionY -= lineHeight;
        }
      } else {
        this.add(createMesh(letter));
      }
    });

    // Bind
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  showing = false;
  async show(enterOffset) {
    if (this.showing) return;
    this.showing = true;
    const tm = new TimelineLite({ paused: true });
    tm.fromTo(
      this.position,
      { x: enterOffset.x || 0, y: this.position.y + (enterOffset.y || 0) },
      { x: 0, y: this.containerBasicY },
      0
    );
    this.children.forEach((letter, index) => {
      if (typeof this.overflow === "number" && this.overflow <= index) return;
      tm.fromTo(
        letter.position,
        {
          y:
            letter.userData.baseY +
            Math.sin(
              index * 0.1 + ((Math.PI * letter.userData.baseY) % (Math.PI / 4))
            ),
        },
        { y: letter.userData.baseY },
        0
      );
      tm.fromTo(
        letter.material,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        0
      );
      tm.fromTo(
        letter.rotation,
        { x: (index * 0.1 * Math.PI) % (Math.PI / 2) },
        { x: 0 },
        0
      );
    });
    await tm.play();
    await tm.kill();
    this.showing = false;
    return;
  }
  hidding = false;
  async hide(enterOffset) {
    if (this.hidding) return;
    this.hidding = true;
    const tm = new TimelineLite({ paused: true });
    tm.fromTo(
      this.position,
      { x: 0, y: this.containerBasicY },
      { x: enterOffset.x || 0, y: this.position.y + (enterOffset.y || 0) },

      0
    );
    this.children.forEach((letter, index) => {
      if (typeof this.overflow === "number" && this.overflow <= index) return;
      tm.fromTo(
        letter.position,
        { y: letter.userData.baseY },
        {
          y:
            letter.userData.baseY +
            Math.sin(
              index * 0.1 + ((Math.PI * letter.userData.baseY) % (Math.PI / 4))
            ),
        },

        0
      );
      tm.fromTo(
        letter.material,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },

        0
      );
      tm.fromTo(
        letter.rotation,
        { x: 0 },
        { x: (index * 0.1 * Math.PI) % (Math.PI / 2) },

        0
      );
    });
    await tm.play();
    await tm.kill();
    this.hidding = false;
    return;
  }
  destroy() {
    this.children.forEach((letter) => {
      this.remove(letter);
    });
  }
}

export { remToWorld, pxToWorld, AnimatedText3D };
