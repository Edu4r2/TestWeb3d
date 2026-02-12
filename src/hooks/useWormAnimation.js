import { useState, useEffect, useRef, useCallback } from 'react';

export const useWormAnimation = (totalItems) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const gliderRef = useRef(null);
    const isAnimatingRef = useRef(false);
    const prevIndexRef = useRef(0);

    const STRIDE = 27;
    const DOT_SIZE = 12;
    const GLIDER_REST_WIDTH = 24;
    const GLIDER_OFFSET = (GLIDER_REST_WIDTH - DOT_SIZE) / 2;

    const animateWorm = useCallback((from, to) => {
        const glider = gliderRef.current;
        if (!glider || from === to) return;

        isAnimatingRef.current = true;
        const goingForward = to > from;

        const fromPos = from * STRIDE - GLIDER_OFFSET;
        const toPos = to * STRIDE - GLIDER_OFFSET;

        const P1 = 300;
        const P2 = 300;

        glider.style.transition = 'none';

        if (goingForward) {
            glider.style.left = fromPos + 'px';
            glider.style.width = GLIDER_REST_WIDTH + 'px';

            requestAnimationFrame(() => {
                glider.style.transition = `width ${P1}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                glider.style.width = (toPos + GLIDER_REST_WIDTH - fromPos) + 'px';

                setTimeout(() => {
                    glider.style.transition = `left ${P2}ms cubic-bezier(0.4, 0, 0.2, 1), width ${P2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                    glider.style.left = toPos + 'px';
                    glider.style.width = GLIDER_REST_WIDTH + 'px';

                    setTimeout(() => {
                        isAnimatingRef.current = false;
                    }, P2);
                }, P1);
            });
        } else {
            glider.style.left = fromPos + 'px';
            glider.style.width = GLIDER_REST_WIDTH + 'px';

            requestAnimationFrame(() => {
                glider.style.transition = `left ${P1}ms cubic-bezier(0.4, 0, 0.2, 1), width ${P1}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                glider.style.left = toPos + 'px';
                glider.style.width = (fromPos + GLIDER_REST_WIDTH - toPos) + 'px';

                setTimeout(() => {
                    glider.style.transition = `width ${P2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                    glider.style.width = GLIDER_REST_WIDTH + 'px';

                    setTimeout(() => {
                        isAnimatingRef.current = false;
                    }, P2);
                }, P1);
            });
        }
    }, [STRIDE, GLIDER_REST_WIDTH, GLIDER_OFFSET]);

    const changeIndex = useCallback((newIndex) => {
        const from = prevIndexRef.current;
        prevIndexRef.current = newIndex;
        setCurrentIndex(newIndex);
        animateWorm(from, newIndex);
    }, [animateWorm]);

    const next = useCallback(() => {
        const n = (prevIndexRef.current + 1) % totalItems;
        changeIndex(n);
    }, [totalItems, changeIndex]);

    const prev = useCallback(() => {
        const p = (prevIndexRef.current - 1 + totalItems) % totalItems;
        changeIndex(p);
    }, [totalItems, changeIndex]);

    const goTo = useCallback((index) => {
        if (index === prevIndexRef.current) return;
        changeIndex(index);
    }, [changeIndex]);

    useEffect(() => {
        const glider = gliderRef.current;
        if (glider) {
            glider.style.left = (0 * STRIDE - GLIDER_OFFSET) + 'px';
            glider.style.width = GLIDER_REST_WIDTH + 'px';
        }
    }, [STRIDE, GLIDER_OFFSET, GLIDER_REST_WIDTH]);

    return {
        currentIndex,
        gliderRef,
        next,
        prev,
        goTo
    };
};
