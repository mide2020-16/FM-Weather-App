import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export default function ThemeProvider({children}: {children: ReactNode}){
    return(
        <NextThemesProvider
            enableSystem
            attribute='data-theme'
            defaultTheme="system"
        >
            {children}
        </NextThemesProvider>
    );
}
