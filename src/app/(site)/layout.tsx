import React from 'react';
import Header from "@/components/modules/Shared/header/Header";
import Footer from "@/components/modules/Shared/Footer";


export default  function Layout({children,}: {
    children: React.ReactNode
}) {



    return (
        <div>
            <Header/>
            {children}
            <Footer/>
        </div>
    );
}
