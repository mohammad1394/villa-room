import React, {ReactNode} from 'react';

function Container({children  , className} : {children: ReactNode , className?: string}  ) {
    return (
        <div className={" w-[85%] mx-auto " + className}>
            {children}
        </div>
    );
}

export default Container;