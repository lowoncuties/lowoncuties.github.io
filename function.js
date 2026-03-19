function initRevealObserver() {
    var revealItems = document.querySelectorAll(".reveal");
    var i;

    if (!("IntersectionObserver" in window)) {
        for (i = 0; i < revealItems.length; i += 1) {
            revealItems[i].classList.add("is-visible");
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        var entryIndex;

        for (entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
            if (entries[entryIndex].isIntersecting) {
                entries[entryIndex].target.classList.add("is-visible");
                observer.unobserve(entries[entryIndex].target);
            }
        }
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px"
    });

    for (i = 0; i < revealItems.length; i += 1) {
        observer.observe(revealItems[i]);
    }
}

function initSpaceCanvas() {
    var canvas = document.getElementById("space-canvas");
    var context;
    var prefersReducedMotion;
    var width = 0;
    var height = 0;
    var stars = [];
    var animationId = null;

    if (!canvas) {
        return;
    }

    context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        var count = Math.min(220, Math.max(90, Math.floor((width * height) / 14000)));
        var nextStars = [];
        var index;

        for (index = 0; index < count; index += 1) {
            nextStars.push(createStar());
        }

        stars = nextStars;
    }

    function resizeCanvas() {
        var ratio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        rebuildStars();
    }

    function drawFrame() {
        var index;

        context.clearRect(0, 0, width, height);

        for (index = 0; index < stars.length; index += 1) {
            var star = stars[index];
            var opacity;

            if (!prefersReducedMotion) {
                star.y += star.speed;
                star.twinkle += 0.015;
            }

            if (star.y > height + 4) {
                star.y = -4;
                star.x = Math.random() * width;
            }

            opacity = star.alpha * (0.72 + Math.sin(star.twinkle) * 0.28);

            context.beginPath();
            context.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            context.fill();
        }

        if (!prefersReducedMotion && window.requestAnimationFrame) {
            animationId = window.requestAnimationFrame(drawFrame);
        }
    }

    resizeCanvas();
    drawFrame();

    window.addEventListener("resize", function () {
        if (animationId && window.cancelAnimationFrame) {
            window.cancelAnimationFrame(animationId);
        }

        resizeCanvas();
        drawFrame();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initRevealObserver();
    initSpaceCanvas();
});
