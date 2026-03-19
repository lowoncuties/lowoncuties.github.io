function initRevealObserver() {
    const revealItems = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -32px 0px"
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function initSpaceCanvas() {
    const canvas = document.getElementById("space-canvas");

    if (!canvas) {
        return;
    }

    const context = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let stars = [];
    let animationId = null;

    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.4 + Math.random() * 1.3,
            alpha: 0.16 + Math.random() * 0.42,
            speed: 0.03 + Math.random() * 0.16,
            twinkle: Math.random() * Math.PI * 2
        };
    }

    function rebuildStars() {
        const count = Math.min(220, Math.max(90, Math.floor((width * height) / 14000)));
        stars = Array.from({ length: count }, createStar);
    }

    function resizeCanvas() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        rebuildStars();
    }

    function drawFrame() {
        context.clearRect(0, 0, width, height);

        stars.forEach((star) => {
            if (!prefersReducedMotion) {
                star.y += star.speed;
                star.twinkle += 0.015;
            }

            if (star.y > height + 4) {
                star.y = -4;
                star.x = Math.random() * width;
            }

            const opacity = star.alpha * (0.72 + Math.sin(star.twinkle) * 0.28);

            context.beginPath();
            context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            context.fill();
        });

        if (!prefersReducedMotion) {
            animationId = window.requestAnimationFrame(drawFrame);
        }
    }

    resizeCanvas();
    drawFrame();

    window.addEventListener("resize", () => {
        if (animationId) {
            window.cancelAnimationFrame(animationId);
        }

        resizeCanvas();
        drawFrame();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initRevealObserver();
    initSpaceCanvas();
});
