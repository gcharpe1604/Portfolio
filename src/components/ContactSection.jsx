import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { links, site } from "../data/site";
import { ExternalLink } from "./ExternalLink";

const contactObjects = [
  {
    id: "mail-icon",
    label: "Mail",
    icon: "/assets/contact/mail.svg",
    kind: "icon",
  },
  {
    id: "email-label",
    label: "Email",
    kind: "label",
  },
  {
    id: "linkedin-icon",
    label: "LinkedIn",
    icon: "/assets/contact/linkedin.svg",
    kind: "icon",
  },
  {
    id: "linkedin-label",
    label: "LinkedIn",
    kind: "label",
  },
  {
    id: "github-icon",
    label: "GitHub",
    icon: "/assets/skills/github-original.svg",
    kind: "icon",
  },
  {
    id: "github-label",
    label: "GitHub",
    kind: "label",
  },
  {
    id: "x-icon",
    label: "X",
    icon: "/assets/contact/x.svg",
    kind: "icon",
  },
  {
    id: "x-label",
    label: "X",
    kind: "label",
  },
];

function ContactPhysics({ sectionRef }) {
  const layerRef = useRef(null);
  const itemRefs = useRef([]);
  const bodiesRef = useRef([]);
  const frameRef = useRef();
  const wakeRef = useRef(() => {});
  const boundsRef = useRef({ width: 0, height: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return undefined;

    let hasStarted = false;
    let previousTime = 0;
    let resizeObserver;

    const renderBody = (body, index) => {
      const element = itemRefs.current[index];
      if (!element) return;
      const { width, height } = boundsRef.current;
      element.style.left = `${(body.x / Math.max(width, 1)) * 100}%`;
      element.style.top = `${(body.y / Math.max(height, 1)) * 100}%`;
      element.style.transform = `rotate(${body.rotation}deg)`;
      element.style.opacity = "1";
    };

    const measure = () => {
      const width = layer.clientWidth;
      const height = layer.clientHeight;
      boundsRef.current = { width, height };

      bodiesRef.current.forEach((body, index) => {
        const element = itemRefs.current[index];
        if (!element) return;
        body.width = element.offsetWidth;
        body.height = element.offsetHeight;
        body.x = Math.min(body.x, Math.max(0, width - body.width));
        body.y = Math.min(body.y, Math.max(0, height - body.height));
        renderBody(body, index);
      });
    };

    const resolveBodyCollisions = () => {
      const bodies = bodiesRef.current;
      for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < bodies.length;
          secondIndex += 1
        ) {
          const first = bodies[firstIndex];
          const second = bodies[secondIndex];
          if (first.dragging || second.dragging) continue;

          const firstCenterX = first.x + first.width / 2;
          const firstCenterY = first.y + first.height / 2;
          const secondCenterX = second.x + second.width / 2;
          const secondCenterY = second.y + second.height / 2;
          const deltaX = secondCenterX - firstCenterX;
          const deltaY = secondCenterY - firstCenterY;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          const minimumDistance =
            (Math.max(first.width, first.height) +
              Math.max(second.width, second.height)) *
            0.42;
          if (distance >= minimumDistance) continue;

          const normalX = deltaX / distance;
          const normalY = deltaY / distance;
          const overlap = minimumDistance - distance;
          first.x -= normalX * overlap * 0.5;
          first.y -= normalY * overlap * 0.5;
          second.x += normalX * overlap * 0.5;
          second.y += normalY * overlap * 0.5;
          first.sleeping = false;
          second.sleeping = false;

          const relativeVelocity =
            (second.vx - first.vx) * normalX + (second.vy - first.vy) * normalY;
          if (relativeVelocity >= 0) continue;

          const impulse = -relativeVelocity * 0.72;
          first.vx -= impulse * normalX;
          first.vy -= impulse * normalY;
          second.vx += impulse * normalX;
          second.vy += impulse * normalY;
        }
      }
    };

    const animate = (time) => {
      frameRef.current = undefined;
      const { width, height } = boundsRef.current;
      const delta = Math.min((time - previousTime) / 1000 || 0, 0.032);
      previousTime = time;
      const gravity = height * 1.7;
      const edgeInset = Math.min(width, height) * 0.018;

      bodiesRef.current.forEach((body) => {
        if (body.dragging || body.sleeping || time < body.releaseAt) return;

        body.vy += gravity * delta;
        body.x += body.vx * delta;
        body.y += body.vy * delta;
        body.rotation += body.angularVelocity * delta;

        const rightEdge = width - body.width - edgeInset;
        const floor = height - body.height - edgeInset;

        if (body.x <= edgeInset) {
          body.x = edgeInset;
          body.vx = Math.abs(body.vx) * 0.64;
          body.angularVelocity *= -0.8;
        } else if (body.x >= rightEdge) {
          body.x = rightEdge;
          body.vx = -Math.abs(body.vx) * 0.64;
          body.angularVelocity *= -0.8;
        }

        if (body.y >= floor) {
          body.y = floor;
          body.vy = -Math.abs(body.vy) * 0.48;
          body.vx *= 0.86;
          body.angularVelocity *= 0.72;
          if (
            Math.abs(body.vy) < height * 0.025 &&
            Math.abs(body.vx) < width * 0.004 &&
            Math.abs(body.angularVelocity) < 2
          ) {
            body.vy = 0;
            body.vx = 0;
            body.angularVelocity = 0;
            body.sleeping = true;
          }
        } else if (body.y <= edgeInset && body.vy < 0) {
          body.y = edgeInset;
          body.vy = Math.abs(body.vy) * 0.5;
        }
      });

      resolveBodyCollisions();
      bodiesRef.current.forEach(renderBody);
      if (
        bodiesRef.current.some(
          (body) => !body.sleeping || time < body.releaseAt,
        )
      ) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const wake = () => {
      if (frameRef.current === undefined) {
        previousTime = performance.now();
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };
    wakeRef.current = wake;

    const start = () => {
      if (hasStarted) return;
      hasStarted = true;
      measure();
      const { width, height } = boundsRef.current;
      const now = performance.now();

      bodiesRef.current = contactObjects.map((_, index) => {
        const element = itemRefs.current[index];
        const objectWidth = element?.offsetWidth || width * 0.04;
        const objectHeight = element?.offsetHeight || objectWidth;
        const horizontalPosition = (index + 1) / (contactObjects.length + 1);
        return {
          x: width * horizontalPosition - objectWidth / 2,
          y: reduceMotion
            ? height - objectHeight - height * 0.018
            : -objectHeight,
          vx: reduceMotion ? 0 : (index % 2 === 0 ? 1 : -1) * width * 0.035,
          vy: 0,
          width: objectWidth,
          height: objectHeight,
          rotation: reduceMotion ? 0 : index % 2 === 0 ? -12 : 12,
          angularVelocity: reduceMotion ? 0 : (index % 2 === 0 ? 1 : -1) * 46,
          releaseAt: reduceMotion ? now : now + index * 140,
          dragging: false,
          offsetX: 0,
          offsetY: 0,
          lastX: 0,
          lastY: 0,
          lastTime: now,
          sleeping: reduceMotion,
        };
      });
      bodiesRef.current.forEach(renderBody);
      if (!reduceMotion) wake();
    };

    let intersectionObserver;
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            start();
            intersectionObserver.disconnect();
          }
        },
        { threshold: 0.18 },
      );
      intersectionObserver.observe(section);
    } else {
      start();
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(layer);
    } else {
      window.addEventListener("resize", measure);
    }

    return () => {
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
      window.cancelAnimationFrame(frameRef.current);
      wakeRef.current = () => {};
    };
  }, [reduceMotion, sectionRef]);

  const updateDraggedBody = (event, index) => {
    const body = bodiesRef.current[index];
    const layer = layerRef.current;
    if (!body?.dragging || !layer) return;

    const bounds = layer.getBoundingClientRect();
    const now = performance.now();
    const nextX = Math.max(
      0,
      Math.min(
        bounds.width - body.width,
        event.clientX - bounds.left - body.offsetX,
      ),
    );
    const nextY = Math.max(
      0,
      Math.min(
        bounds.height - body.height,
        event.clientY - bounds.top - body.offsetY,
      ),
    );
    const delta = Math.max((now - body.lastTime) / 1000, 0.016);
    body.vx = (nextX - body.lastX) / delta;
    body.vy = (nextY - body.lastY) / delta;
    body.rotation += (nextX - body.x) * 0.18;
    body.x = nextX;
    body.y = nextY;
    body.lastX = nextX;
    body.lastY = nextY;
    body.lastTime = now;
    event.currentTarget.style.left = `${(body.x / bounds.width) * 100}%`;
    event.currentTarget.style.top = `${(body.y / bounds.height) * 100}%`;
    event.currentTarget.style.transform = `rotate(${body.rotation}deg) scale(1.06)`;
  };

  const beginDrag = (event, index) => {
    const body = bodiesRef.current[index];
    const layer = layerRef.current;
    if (!body || !layer) return;

    const bounds = layer.getBoundingClientRect();
    body.dragging = true;
    body.sleeping = false;
    body.offsetX = event.clientX - bounds.left - body.x;
    body.offsetY = event.clientY - bounds.top - body.y;
    body.lastX = body.x;
    body.lastY = body.y;
    body.lastTime = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const endDrag = (event, index) => {
    const body = bodiesRef.current[index];
    if (!body) return;
    body.dragging = false;
    body.sleeping = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    wakeRef.current();
  };

  const moveWithKeyboard = (event, index) => {
    const body = bodiesRef.current[index];
    const { width, height } = boundsRef.current;
    if (!body) return;

    const distance = Math.min(width, height) * 0.04;
    const movement = {
      ArrowLeft: [-distance, 0],
      ArrowRight: [distance, 0],
      ArrowUp: [0, -distance],
      ArrowDown: [0, distance],
    }[event.key];

    if (movement) {
      event.preventDefault();
      body.x = Math.max(0, Math.min(width - body.width, body.x + movement[0]));
      body.y = Math.max(
        0,
        Math.min(height - body.height, body.y + movement[1]),
      );
      body.vx = 0;
      body.vy = 0;
      body.sleeping = true;
      const element = itemRefs.current[index];
      if (element) {
        element.style.left = `${(body.x / Math.max(width, 1)) * 100}%`;
        element.style.top = `${(body.y / Math.max(height, 1)) * 100}%`;
        element.style.transform = `rotate(${body.rotation}deg)`;
      }
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      body.vy = -height * 0.72;
      body.vx = (index % 2 === 0 ? 1 : -1) * width * 0.12;
      body.sleeping = false;
      wakeRef.current();
    }
  };

  return (
    <div
      ref={layerRef}
      className="contact-physics-layer"
      aria-label="Interactive draggable technology logos"
    >
      {contactObjects.map((item, index) => (
        <button
          key={item.id}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          className={`contact-physics-object is-${item.kind}`}
          type="button"
          aria-label={`Draggable ${item.label} ${item.kind}`}
          data-cursor="Drag"
          onPointerDown={(event) => beginDrag(event, index)}
          onPointerMove={(event) => updateDraggedBody(event, index)}
          onPointerUp={(event) => endDrag(event, index)}
          onPointerCancel={(event) => endDrag(event, index)}
          onKeyDown={(event) => moveWithKeyboard(event, index)}
        >
          {item.kind === "icon" ? (
            <img src={item.icon} alt="" draggable="false" />
          ) : (
            <span>{item.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function ContactSection() {
  const [message, setMessage] = useState("");
  const sectionRef = useRef(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setMessage("Email copied to clipboard.");
    } catch {
      setMessage(`Copy unavailable. Email: ${links.email}`);
    }
    window.setTimeout(() => setMessage(""), 3000);
  };

  return (
    <section
      ref={sectionRef}
      className="contact-section"
      data-section-tone="contact"
    >
      <ContactPhysics sectionRef={sectionRef} />
      <div className="contact-grid" id="contact">
        <div>
          <span className="eyebrow">Available for the right work</span>
          <h2>
            <span>Useful software</span>
            <span>deserves</span>
            <span>careful</span>
            <span>engineering.</span>
          </h2>
        </div>
        <div>
          <p className="contact-copy">
            I’m currently open to software engineering internships and
            open-source collaborations, particularly around backend systems,
            developer infrastructure and cloud-native tooling.
          </p>
          <p className="location">{site.location}</p>
          <a className="contact-email" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <div className="contact-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={copyEmail}
            >
              {message.startsWith("Email copied") ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              Copy email
            </button>
            <a
              className="button button-secondary"
              href={`mailto:${links.email}`}
            >
              <Mail aria-hidden="true" />
              Open mail client
            </a>
            <ExternalLink href={links.linkedIn} className="contact-action-link">
              <Linkedin aria-hidden="true" />
              LinkedIn
            </ExternalLink>
            <ExternalLink href={links.github} className="contact-action-link">
              <Github aria-hidden="true" />
              GitHub
            </ExternalLink>
            <ExternalLink href={links.twitter} className="contact-action-link">
              <Twitter aria-hidden="true" />
              Twitter
            </ExternalLink>
            <Link
              className="contact-action-link contact-resume-link"
              to={links.resume}
            >
              <span>Résumé</span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <p
            className={`copy-status ${message ? "is-visible" : ""}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
