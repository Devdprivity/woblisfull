import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/img/woblisistipo.png" alt="Woblis Logo" style={{backgroundColor: 'black'}} />
    );
}
