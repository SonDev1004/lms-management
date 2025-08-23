import { useEffect, useState } from "react";
import { Galleria } from 'primereact/galleria';
import { photoService } from 'services/PhotoService';


const Banner = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        photoService.getImages().then(data => setImages(data || []));
    }, []);

    const itemTemplate = (item) => {
        if (!item) return null;
        return (
            <img
                src={item.itemImageSrc}
                alt={item.alt}
                className="w-full h-20rem object-cover block"
            />
        );
    };

    return (
        <div className="w-full max-w-screen-xl mx-auto overflow-hidden">
            <Galleria
                value={images}
                numVisible={1}
                circular
                autoPlay
                transitionInterval={2000}
                className="w-full"
                showThumbnails={false}
                showItemNavigators
                item={itemTemplate}
            />
        </div>
    );
};

export default Banner;