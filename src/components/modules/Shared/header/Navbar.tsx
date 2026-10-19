import React from 'react';
import Link from "next/link";

const links = [
    {
        title: "خانه",
        href: "/",
    },
    {
        title: "ویلاها",
        href: "/villas",
    },
    {
        title: "تخفیف‌ها",
        href: "/discounts",
    },
    {
        title: "راهنما",
        href: "/guide",
    },
    {
        title: "درباره ما",
        href: "/about",
    },
    {
        title: "تماس با ما",
        href: "/contact",
    },
];


function Navbar() {
    return (
        <nav>
            <ul className=" items-center gap-[28px] text-[#45515B] hidden md:flex">
                {links.map((link) => (
                    <li
                        key={link.href}
                        className="text-[14px] font-medium"
                    >
                        <Link
                            href={link.href}
                            className="transition-colors hover:text-[#203140]"
                        >
                            {link.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;