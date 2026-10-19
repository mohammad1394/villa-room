"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function AOSInit() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });

        AOS.refresh();
    }, []);

    return null;
}

export default AOSInit;